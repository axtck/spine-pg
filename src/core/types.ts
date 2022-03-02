import { RequestHandler } from "express";
import { HttpMethod } from "../types";

export type LogMessageTypes = unknown;

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