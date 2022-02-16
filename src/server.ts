import "reflect-metadata";
import express, { Application, RequestHandler } from "express";
import Server from "./core/Server";
import { Database } from "./core/Database";
import { Logger } from "./core/Logger";
import { Controller } from "./core/Controller";
import { AuthController } from "./controllers/auth/AuthController";
import { UserController } from "./controllers/user/UserController";
import { apiErrorHandler } from "./middlewares/apiErrorHandler";
import { lazyHandleException } from "./lib/functions/exceptionHandling";
import { container } from "tsyringe";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";

const app: Application = express();
const logger: Logger = container.resolve(Logger);
const database: Database = container.resolve(Database);
const server: Server = new Server(logger, app, database);

const globalMiddleWares: RequestHandler[] = [
    morgan("dev"),
    helmet(),
    cors({ origin: "http://localhost:3000" }), // access for origin 3000 (front-end)
    express.json(), // parse requests
    express.urlencoded({ extended: true })
];

const authController: AuthController = container.resolve(AuthController);
const userController: UserController = container.resolve(UserController);
const controllers: Controller[] = [
    authController,
    userController
];

server.initDatabase(path.join(__dirname, "migrations")).then(() => {
    server.listEnv();
    server.loadGlobalMiddlewares(globalMiddleWares);
    server.loadControllers("/api/v1", controllers);
    server.loadErrorHandlingMiddleware(apiErrorHandler);
    server.listen();
}).catch((e: unknown) => {
    lazyHandleException(e, "initializing database failed", logger);
});
