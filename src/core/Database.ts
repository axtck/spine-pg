import { createCleanSqlLogString, createSqlLog } from "../lib/utils/logging";
import { createPoolConnection } from "../lib/database/connections";
import { runMigrations } from "../lib/database/upgrade";
import {
  createDatabaseIfNotExists,
  createSchemaIfNotExists,
  createInitialTablesIfNotExists
} from "../lib/database/initialize";
import { Logger } from "./Logger";
import { Pool, QueryResult } from "pg";
import { injectable } from "inversify";
import { Nullable } from "./types/core";

@injectable()
export class Database {
  private readonly pool: Pool;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.pool = createPoolConnection();
    this.logger = logger;
  }

  public query = async <T>(sql: string, parameters?: unknown[]): Promise<T[]> => {
    this.logger.info(`executing query: ${createCleanSqlLogString(createSqlLog(sql, parameters))}}`);
    const result: QueryResult<T> = await this.pool.query<T>(sql, parameters);
    return result.rows;
  };

  public queryOne = async <T>(sql: string, parameters?: unknown[]): Promise<T> => {
    const result: T[] = await this.query<T>(sql, parameters);
    if (!result || !result.length) {
      throw new Error(`query did not return any rows: ${createCleanSqlLogString(createSqlLog(sql, parameters))}}`);
    }
    if (result.length < 1) {
      throw new Error(`more than one row for query: ${createCleanSqlLogString(createSqlLog(sql, parameters))}`);
    }

    return result[0];
  };

  public queryOneOrDefault = async <T>(sql: string, parameters?: unknown[]): Promise<Nullable<T>> => {
    const result: T[] = await this.query<T>(sql, parameters);
    if (!result || !result.length) return null;
    if (result.length < 1) {
      throw new Error(`more than one row for query: ${createCleanSqlLogString(createSqlLog(sql, parameters))}`);
    }

    return result[0];
  };

  public createDatabaseIfNotExists = async (): Promise<void> => {
    await createDatabaseIfNotExists();
  };

  public createSchemaIfNotExists = async (): Promise<void> => {
    await createSchemaIfNotExists();
  };

  public createInitialTablesIfNotExists = async (): Promise<void> => {
    await createInitialTablesIfNotExists();
  };

  public runMigrations = async (migrationsFolderPath: string, database: Database): Promise<void> => {
    await runMigrations(migrationsFolderPath, database);
  };
}
