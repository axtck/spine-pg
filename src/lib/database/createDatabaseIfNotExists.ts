import { createNoDatabaseSelectedConnection } from "./createConnections";
import { lazyHandleException } from "../functions/exceptionHandling";
import { Logger } from "../../core/Logger";
import { Connection } from "mysql2/promise";
import { executeSqlFromFile } from "./executeFromSql";
import { penv } from "../../config/penv";
import { DbQueryResult } from "../../core/types";
import path from "path";

export const createDatabaseIfNotExists = async (): Promise<void> => {
    const logger: Logger = new Logger();
    const dbName: string = penv.db.mysqlDb;
    try {
        const connection: Connection = await createNoDatabaseSelectedConnection();
        const [dbs] = await connection.execute<DbQueryResult<unknown[]>>(`SHOW DATABASES LIKE '${penv.db.mysqlDb}'`);

        if (dbs?.length) {
            logger.info(`database '${penv.db.mysqlDb}' not created (exists)`);
            return;
        }

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        logger.info(`created database '${dbName}'`);

        const sqlFilePath: string = path.join(__dirname, "..", "..", "..", "database", "createInitialTables.sql");
        await executeSqlFromFile(sqlFilePath);
    } catch (e) {
        lazyHandleException(e, "creating database failed", logger);
    }
};