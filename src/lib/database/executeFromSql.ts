import { container } from "tsyringe";
import { createSqlLog } from "./../functions/logging";
import { Client } from "pg";
import { createMultipleStatementsClient } from "./createConnections";
import { lazyHandleException } from "../functions/exceptionHandling";
import { Logger } from "../../core/Logger";
import fs from "fs";

export const executeSqlFromFile = async (sqlFilePath: string): Promise<void> => {
    const logger: Logger = container.resolve(Logger);
    try {
        const extension: string | undefined = sqlFilePath.split(".").pop();
        if (!extension || extension !== "sql") throw new Error("file should have '.sql' extension");

        const sql: string = fs.readFileSync(sqlFilePath).toString();
        const client: Client = createMultipleStatementsClient();
        await client.connect();
        await client.query(sql);

        logger.debug(`executing query from file succeeded: ${JSON.stringify(createSqlLog(sql))}`);
    } catch (e) {
        lazyHandleException(e, "executing query from file failed", logger);
    }
};