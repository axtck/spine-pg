import { lazyHandleException } from "./../functions/exceptionHandling";
import { Id, Nullable, QueryString } from "./../../types";
import { Database } from "./../../core/Database";
import { readdir } from "fs/promises";
import { IMigrationFile, IMigrationFileInfo, CreationStatus } from "./types";
import { Logger } from "../../core/Logger";
import path from "path";

export const runMigrations = async (migrationsFolderPath: string, database: Database): Promise<void> => {
    const logger: Logger = new Logger();
    try {
        // create migrations table
        const createTableStatus: CreationStatus = await createMigrationsTable(database);
        if (createTableStatus === CreationStatus.Exists) logger.info("migrations table not created (exists)");

        let files: string[];
        try {
            // get migrations
            files = await readdir(migrationsFolderPath);
        } catch {
            logger.info("no migrations to run");
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

const createMigrationsTable = async (database: Database): Promise<CreationStatus> => {
    const existingTable = await database.query<unknown>("SHOW TABLES LIKE 'migrations'");
    if (existingTable?.length) return CreationStatus.Exists;

    const createMigrationsTableQuery: QueryString = `
        CREATE TABLE \`migrations\` (
            \`id\` bigint NOT NULL,
            \`name\` varchar(100) NOT NULL,
            \`succeeded\` tinyint(1) NOT NULL,
            \`created\` datetime NOT NULL,
            \`executed\` datetime NOT NULL,
            PRIMARY KEY (\`id\`)
        )
    `;

    await database.query(createMigrationsTableQuery);
    return CreationStatus.Created;
};

const insertOrUpdateMigration = async (database: Database, migrationFileInfo: IMigrationFileInfo, succeeded: boolean): Promise<void> => {
    const insertMigrationQuery: QueryString = `
        INSERT INTO migrations 
        (id, name, succeeded, created, executed)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        succeeded = VALUES (succeeded), 
        executed = VALUES (executed)
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

const getStoredMigrations = async (database: Database): Promise<Nullable<Array<{ id: Id; }>>> => {
    const getStoredMigrationsQuery: QueryString = "SELECT id FROM migrations";
    const storedMigrations = await database.query<{ id: Id; }>(getStoredMigrationsQuery);
    return storedMigrations;
};

const getFailedMigrations = async (database: Database): Promise<Nullable<Array<{ id: Id; }>>> => {
    const getMigrationsQuery: QueryString = "SELECT id FROM migrations WHERE succeeded = FALSE";
    const failedMigrations = await database.query<{ id: number; }>(getMigrationsQuery);
    return failedMigrations;
};

const getMigrationsToRun = async (database: Database, migrationFiles: string[]): Promise<string[]> => {
    const storedMigrationIds = (await getStoredMigrations(database) || []).map(m => m.id);
    const failedMigrationIds = (await getFailedMigrations(database) || []).map(m => m.id);

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