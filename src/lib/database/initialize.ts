import { Database } from "../../core/Database";
import { QueryString } from "../../core/types/core";
import { createPoolConnectionWithoutDatabase } from "./connections";
import { lazyHandleException } from "../utils/exceptions";
import { Logger } from "../../core/Logger";
import { Pool, QueryResult } from "pg";
import { executeSqlFromFile } from "./execute";
import { penv } from "../../config/penv";
import { buildPathFromRoot } from "../utils/paths";
import { container } from "../../inversify.config";

export const createDatabaseIfNotExists = async (): Promise<void> => {
  const logger: Logger = container.resolve(Logger);
  const dbName: string = penv.db.pgDb;
  try {
    const pool: Pool = createPoolConnectionWithoutDatabase();
    const db: QueryResult<unknown[]> = await pool.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`
    );
    if (db.rows.length) {
      logger.info(`database '${dbName}' not created (exists)`);
      return;
    }

    await pool.query(`CREATE DATABASE ${dbName}`);
    logger.info(`created database '${dbName}'`);
  } catch (e) {
    lazyHandleException(e, "creating database failed", logger);
  }
};

export const createSchemaIfNotExists = async (): Promise<void> => {
  const logger: Logger = container.resolve(Logger);
  const database: Database = container.resolve(Database);
  const schemaName: string = penv.db.pgSchema;
  try {
    const existingSchema: unknown[] = await database.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${schemaName}'`
    );
    if (existingSchema.length) {
      logger.info(`schema '${schemaName}' not created (exists)`);
      return;
    }

    await database.query(`CREATE SCHEMA ${schemaName} AUTHORIZATION ${penv.db.pgUser}`);
    await database.query(`ALTER DATABASE ${penv.db.pgDb} SET search_path TO ${schemaName}`); // set the search path to schema
    logger.info(`created schema '${schemaName}' and set search_path`);
  } catch (e) {
    lazyHandleException(e, "creating schema failed", logger);
  }
};

export const createInitialTablesIfNotExists = async (): Promise<void> => {
  const logger: Logger = container.resolve(Logger);
  const database: Database = container.resolve(Database);
  const schemaName: string = penv.db.pgSchema;
  try {
    const getTableNamesQuery: QueryString = `
      SELECT table_name as name
      FROM information_schema.tables 
      WHERE table_schema = '${schemaName}'
    `;
    const existingTables: Array<{ name: string }> = await database.query(getTableNamesQuery);
    if (existingTables.length) {
      logger.info(`tables '${existingTables.map(t => t.name).join(", ")}' not created (exist), returning`);
      return;
    }

    const sqlFilePath: string = buildPathFromRoot("database", "initialize.sql");
    await executeSqlFromFile(sqlFilePath);
    const existingTablesAfterInsert: Array<{ name: string }> = await database.query(getTableNamesQuery);
    logger.info(`tables '${existingTablesAfterInsert.map(t => t.name).join(", ")}' successfully created`);
  } catch (e) {
    lazyHandleException(e, "creating initial tables failed", logger);
  }
};
