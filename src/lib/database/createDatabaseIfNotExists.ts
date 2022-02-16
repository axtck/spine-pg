import { container } from "tsyringe";
import { createMultipleStatementsClient, createNoDatabaseSelectedClient } from "./createConnections";
import { lazyHandleException } from "../functions/exceptionHandling";
import { Logger } from "../../core/Logger";
import { Client, QueryResult } from "pg";
import { executeSqlFromFile } from "./executeFromSql";
import { penv } from "../../config/penv";
import path from "path";

export const createDatabaseIfNotExists = async (): Promise<void> => {
    const logger: Logger = container.resolve(Logger);
    const dbName: string = penv.db.pgDb;
    try {
        const client: Client = createNoDatabaseSelectedClient();
        await client.connect();
        const db: QueryResult<unknown[]> = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);

        if (db.rows.length) {
            logger.info(`database '${dbName}' not created (exists)`);
            return;
        }

        await client.query(`CREATE DATABASE ${dbName}`);
        logger.info(`created database '${dbName}'`);
    } catch (e) {
        lazyHandleException(e, "creating database failed", logger);
    }
};

export const createSchemaIfNotExists = async (): Promise<void> => {
    const logger: Logger = container.resolve(Logger);
    const schemaName: string = penv.db.pgSchema;
    try {
        const client: Client = createMultipleStatementsClient();
        await client.connect();
        const existingSchema: QueryResult<unknown[]> = await client.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${schemaName}'`);

        if (existingSchema.rows.length) {
            logger.info(`schema '${schemaName}' not created (exists)`);
            return;
        }

        await client.query(`CREATE SCHEMA ${schemaName} AUTHORIZATION ${penv.db.pgUser}`);
        logger.info(`created schema '${schemaName}'`);

        const sqlFilePath: string = path.join(__dirname, "..", "..", "..", "database", "createInitialTables.sql");
        await executeSqlFromFile(sqlFilePath);
    } catch (e) {
        lazyHandleException(e, "creating schema failed", logger);
    }
};
