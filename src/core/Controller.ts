import { Logger } from "./Logger";
import { Response, Router } from "express";
import { HttpMethod } from "../types";
import { IControllerRoute } from "./types";

export abstract class Controller {
    public router: Router;
    public abstract path: string;
    protected abstract readonly routes: IControllerRoute[];
    protected readonly logger: Logger;

    constructor(logger: Logger) {
        this.router = Router();
        this.logger = logger;
    }

    public setRoutes(): Router {
        for (const route of this.routes) {
            for (const middleware of route.localMiddleware) {
                this.router.use(route.path, middleware);
            }
            switch (route.method) {
                case HttpMethod.Get:
                    this.router.get(route.path, route.handler);
                    break;
                case HttpMethod.Post:
                    this.router.post(route.path, route.handler);
                    break;
                case HttpMethod.Put:
                    this.router.put(route.path, route.handler);
                    break;
                case HttpMethod.Delete:
                    this.router.delete(route.path, route.handler);
                    break;
                default:
                    this.logger.error("not a valid method");
                    break;
            }
        }
        return this.router;
    }

    protected sendSuccess(res: Response, data?: unknown, message?: string): Response {
        return res.status(200).json({
            message: message || "success",
            payload: data
        });
    }
}