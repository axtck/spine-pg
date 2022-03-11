export type LogMessageTypes = unknown;

export interface IQueryError {
    code: string;
    errno: number;
    sql: string;
    sqlState: string;
    sqlMessage: string;
}

