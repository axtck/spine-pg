import { Database } from "./../../core/Database";
import { container } from "tsyringe";
import { lazyHandleException } from "../functions/exceptionHandling";
import { Logger } from "../../core/Logger";
import fs from "fs";

export const executeSqlFromFile = async (sqlFilePath: string): Promise<void> => {
    const logger: Logger = container.resolve(Logger);
    const database: Database = container.resolve(Database);
    try {
        const extension: string | undefined = sqlFilePath.split(".").pop();
        if (!extension || extension !== "sql") throw new Error("file should have '.sql' extension");

        const sql: string = fs.readFileSync(sqlFilePath).toString();
        await database.query(sql);

    } catch (e) {
        lazyHandleException(e, "executing query from file failed", logger);
    }
};