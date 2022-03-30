import { container } from "tsyringe";
import { penv } from "./../../config/penv";
import { lazyHandleException } from "../utils/exceptionHandling";
import { Id, QueryString } from "./../../types";
import { Database } from "./../../core/Database";
import { readdir } from "fs/promises";
import { IMigrationFile, IMigrationFileInfo } from "./types";
import { Logger } from "../../core/Logger";
import path from "path";

export const runMigrations = async (migrationsFolderPath: string, database: Database): Promise<void> => {
    const logger: Logger = new Logger();
    try {
        // create migrations table
        await createMigrationsTable(database);

        let files: string[];
        try {
            // get migrations
            files = await readdir(migrationsFolderPath);
        } catch {
            logger.info("reading migrations folder failed (possibly empty because no migration was created / needed)");
            return;
        }
        const compiledMigrationFiles: string[] = files.filter((f) => f.split(".")[f.split(".").length - 1] === "js");
        const migrationsToRun: string[] = await getMigrationsToRun(database, compiledMigrationFiles);
        if (!migrationsToRun || !migrationsToRun.length) {
            logger.info("no migrations to run");
            return;
        }

        // sort based on timestamp (chronological order)
        const sortedMigrationsToRun: string[] = migrationsToRun.sort((a, b) => {
            return convertFilename(a).id - convertFilename(b).id;
        });
        logger.info(`migrations to run (in order): ${migrationsToRun.map(m => convertFilename(m).id).join(", ").slice(0, -2)}.`);

        // upgrade all migrations to run
        for (const file of sortedMigrationsToRun) {
            const migration: IMigrationFile = await import(path.join(migrationsFolderPath, file)); // import migration
            const migrationFileInfo: IMigrationFileInfo = convertFilename(file); // extract file info

            try {
                if (!migration.upgrade) throw new Error(`migration ${file} doesn't have an upgrade function`);
                logger.info(`upgrading: migration ${migrationFileInfo.id} (${migrationFileInfo.name})`);
                await migration.upgrade(database);
                logger.info(`migration ${migrationFileInfo.id} successfully upgraded`);
                await insertOrUpdateMigration(database, migrationFileInfo, true);
            } catch (e) {
                lazyHandleException(e, `migration ${migrationFileInfo.id} failed upgrading`, logger);
                await insertOrUpdateMigration(database, migrationFileInfo, false);
            }
        }
    } catch (e) {
        lazyHandleException(e, "upgrading database failed", logger);
    }
};

const createMigrationsTable = async (database: Database): Promise<void> => {
    const logger: Logger = container.resolve(Logger);
    const getMigrationsTableQuery: QueryString = `
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = '${penv.db.pgSchema}' AND table_name = 'migrations'
    `;

    const existingTable: unknown[] = await database.query(getMigrationsTableQuery);
    if (existingTable.length) {
        logger.info("migrations table not created (exists)");
        return;
    }

    const createMigrationsTableQuery: QueryString = `
        CREATE TABLE migrations (
            "id" int8 NOT NULL,
            "name" varchar(100) NOT NULL,
            "succeeded" bool NOT NULL,
            "created" timestamp NOT NULL,
            "executed" timestamp NOT NULL,
            CONSTRAINT migrations_pk PRIMARY KEY ("id")
        )
    `;

    await database.query(createMigrationsTableQuery);
    logger.info("successfully created migrations table");
};

const insertOrUpdateMigration = async (database: Database, migrationFileInfo: IMigrationFileInfo, succeeded: boolean): Promise<void> => {
    const insertMigrationQuery: QueryString = `
        INSERT INTO migrations
        ("id", "name", "succeeded", "created", "executed") 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("id") DO UPDATE 
        SET "succeeded" = excluded.succeeded, "executed" = excluded.executed
    `;

    const parameters: Array<number | string | Date | boolean> = [
        migrationFileInfo.id, // id
        migrationFileInfo.name, // name
        succeeded, // succeeded
        new Date(migrationFileInfo.id), // created
        new Date() // executed
    ];

    await database.query(insertMigrationQuery, parameters);
};

const getStoredMigrations = async (database: Database): Promise<Array<{ id: string; }>> => {
    const getStoredMigrationsQuery: QueryString = "SELECT id FROM migrations";
    const storedMigrations: Array<{ id: string; }> = await database.query(getStoredMigrationsQuery);
    return storedMigrations;
};

const getFailedMigrations = async (database: Database): Promise<Array<{ id: string; }>> => {
    const getMigrationsQuery: QueryString = "SELECT id FROM migrations WHERE succeeded = FALSE";
    const failedMigrations: Array<{ id: string; }> = await database.query(getMigrationsQuery);
    return failedMigrations;
};

const getMigrationsToRun = async (database: Database, migrationFiles: string[]): Promise<string[]> => {
    const storedMigrationIds: Id[] = (await getStoredMigrations(database)).map(m => Number(m.id));
    const failedMigrationIds: Id[] = (await getFailedMigrations(database)).map(m => Number(m.id));

    // filter out new migrations 
    const newMigrations = migrationFiles.filter((m) => {
        return !storedMigrationIds.includes(convertFilename(m).id);
    });

    // filter out failed migrations
    const failedMigrations = migrationFiles.filter((m) => {
        return failedMigrationIds.includes(convertFilename(m).id);
    });

    const migrationsToRun = [...newMigrations, ...failedMigrations]; // concat new and failed migrations
    return migrationsToRun;
};

const convertFilename = (filename: string): IMigrationFileInfo => {
    const parts = filename.slice(0, -3).split(/_(.+)/).filter(x => x); // slice of extention and split on first _
    if (!parts || parts.length !== 2) throw new Error(`converting filename '${filename}' failed`);
    if (isNaN(Number(parts[0]))) throw new Error("migration timestamp missing in filename");
    const info: IMigrationFileInfo = {
        id: Number(parts[0]),
        name: parts[1]
    };
    return info;
};