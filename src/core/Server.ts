import { Database } from "./Database";
import express, { Application, ErrorRequestHandler, RequestHandler, Router } from "express";
import { Controller } from "./Controller";
import { Logger } from "./Logger";
import { penv } from "../config/penv";
import http from "http";
import path from "path";

export class Server {
    private readonly logger: Logger;
    private readonly app: Application;
    private readonly database: Database;

    constructor(logger: Logger, app: Application, database: Database) {
        this.logger = logger;
        this.app = app;
        this.database = database;
    }

    public listen = (): http.Server => {
        return this.app.listen(penv.app.port, () => {
            this.logger.debug(`listening on ${penv.app.port}`);
        });
    };

    public loadGlobalMiddlewares = (middlewares: RequestHandler[]): void => {
        for (const middleware of middlewares) {
            this.app.use(middleware);
        }
    };

    public serveStaticFiles = (): void => {
        this.app.use("/images", express.static(penv.static.images.path));
    };

    public loadControllers = (basePath: string, controllers: Controller[]): void => {
        for (const controller of controllers) {
            const controllerPath: string = path.posix.join(basePath, controller.path).replace(/\/+/g, "/"); // create the full base path e.g. api/v1/auth
            const controllerRouter: Router = controller.setRoutes(); // set all routes for controller
            this.app.use(controllerPath, controllerRouter);
        }
    };

    public loadErrorHandlingMiddleware = (errorHandlingMiddleware: ErrorRequestHandler): void => {
        this.app.use(errorHandlingMiddleware);
    };

    public listEnv = (): void => {
        this.logger.debug(`environment variables: ${JSON.stringify(penv)}`);
    };

    public initDatabase = async (migrationsFolderPath: string): Promise<void> => {
        await this.database.createDatabaseIfNotExists();
        await this.database.createSchemaIfNotExists();
        await this.database.createInitialTablesIfNotExists();
        await this.database.runMigrations(migrationsFolderPath, this.database);
    };
}