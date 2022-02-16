import { createMultipleStatementsConnection } from "./createConnections";
import { lazyHandleException } from "../functions/exceptionHandling";
import { Connection } from "mysql2/promise";
import { Logger } from "../../core/Logger";
import fs from "fs";

export const executeSqlFromFile = async (sqlFilePath: string): Promise<void> => {
    const logger: Logger = new Logger();
    try {
        const connection: Connection = await createMultipleStatementsConnection();
        const extension: string | undefined = sqlFilePath.split(".").pop();
        if (!extension || extension !== "sql") throw new Error("file should have '.sql' extension");

        const sql: string = fs.readFileSync(sqlFilePath).toString();
        await connection.query(sql);
        logger.debug(`executing query from file succeeded: ${sql}`);
    } catch (e) {
        lazyHandleException(e, "executing query from file failed", logger);
    }
};