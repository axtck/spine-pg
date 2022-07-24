import { RequestHandler } from "express";
import { HttpMethod } from "./HttpMethod";

export interface IControllerRoute {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
  localMiddleware: RequestHandler[];
}
