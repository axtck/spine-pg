import { RequestHandler } from "express";
import { HttpMethod, Id } from "./../types";

export interface ILoginResponse {
    id: Id;
    username: string;
    email: string;
    roles: string[];
    accessToken: string;
}

export interface IControllerRoute {
    path: string;
    method: HttpMethod;
    handler: RequestHandler;
    localMiddleware: RequestHandler[];
}