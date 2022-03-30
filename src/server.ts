import "reflect-metadata";
import express, { Application, RequestHandler } from "express";
import { penv } from "./config/penv";
import { Server } from "./core/Server";
import { Logger } from "./core/Logger";
import { Database } from "./core/Database";
import { container } from "tsyringe";
import { Controller } from "./core/Controller";
import { AuthController } from "./controllers/auth/AuthController";
import { UserController } from "./controllers/user/UserController";
import { apiErrorHandler } from "./middlewares/apiErrorHandler";
import { lazyHandleException } from "./lib/utils/exceptionHandling";
import { AuthJwtMiddleware } from "./middlewares/AuthJwtMiddleware";
import { buildPathFromRoot } from "./lib/utils/paths";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

const app: Application = express();
const logger: Logger = container.resolve(Logger);
const database: Database = container.resolve(Database);
const authJwtMiddleware: AuthJwtMiddleware = container.resolve(AuthJwtMiddleware);
const server: Server = new Server(logger, app, database, authJwtMiddleware);

const globalMiddleWares: RequestHandler[] = [
    morgan("dev"),
    helmet(),
    cors({ origin: penv.cors.origin }), // access for origin
    express.json(), // parse requests
    express.urlencoded({ extended: true })
];

const authController: AuthController = container.resolve(AuthController);
const userController: UserController = container.resolve(UserController);
const controllers: Controller[] = [
    authController,
    userController
];

server.initDatabase(buildPathFromRoot("src", "migrations")).then(() => {
    server.listEnv();
    server.loadGlobalMiddlewares(globalMiddleWares);
    server.serveStaticFiles();
    server.loadControllers("/api/v1", controllers);
    server.loadErrorHandlingMiddleware(apiErrorHandler);
    server.listen();
}).catch((e: unknown) => {
    lazyHandleException(e, "initializing database failed", logger);
});
