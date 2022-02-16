import { createSqlLog } from "./../lib/functions/logging";
import { createPoolConnection } from "./../lib/database/createConnections";
import { runMigrations } from "./../lib/database/upgrade";
import { createDatabaseIfNotExists } from "../lib/database/createDatabaseIfNotExists";
import { Logger } from "./Logger";
import { Nullable } from "./../types";
import { Pool } from "mysql2/promise";
import { DbQueryResult } from "./types";
import { injectable } from "tsyringe";

@injectable()
export class Database {
    private readonly pool: Pool;
    private readonly logger: Logger;

    constructor(logger: Logger) {
        this.pool = createPoolConnection();
        this.logger = logger;
    }

    public async query<T>(sql: string, parameters?: unknown[]): Promise<DbQueryResult<T[]>> {
        this.logger.info(`executing query: ${JSON.stringify(createSqlLog(sql, parameters))}}`);
        const [result] = await this.pool.query<DbQueryResult<T[]>>(sql, parameters);
        return result;
    }

    public async queryOne<T>(sql: string, parameters?: Array<string | number>): Promise<Nullable<T>> {
        const result = await this.query<T>(sql, parameters);
        if (!result || !result.length) return null;
        if (result.length < 1) throw new Error(`more than one row for query: ${JSON.stringify(createSqlLog(sql, parameters))}`);
        return result[0];
    }

    public async createDatabaseIfNotExists(): Promise<void> {
        await createDatabaseIfNotExists();
    }

    public async runMigrations(migrationsFolderPath: string, database: Database): Promise<void> {
        await runMigrations(migrationsFolderPath, database);
    }
}