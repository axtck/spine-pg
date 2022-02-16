import { RequestHandler } from "express";
import { OkPacket, RowDataPacket } from "mysql2";
import { HttpMethod } from "../types";

export type LogMessageTypes = string | number | Record<string, unknown> | unknown;

export type DbDefaults = RowDataPacket[] | RowDataPacket[][] | OkPacket[] | OkPacket;
export type DbQueryResult<T> = T & DbDefaults;

export interface IQueryError {
    code: string;
    errno: number;
    sql: string;
    sqlState: string;
    sqlMessage: string;
}

export interface IControllerRoute {
    path: string;
    method: HttpMethod;
    handler: RequestHandler;
    localMiddleware: RequestHandler[];
}