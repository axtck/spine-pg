import "reflect-metadata";
import { container } from "./inversify.config";
import express, { Application, RequestHandler } from "express";
import { penv } from "./config/penv";
import { Server } from "./core/Server";
import { Logger } from "./core/Logger";
import { Database } from "./core/Database";
import { Controller } from "./core/Controller";
import { lazyHandleException } from "./lib/utils/exceptions";
import { AuthJwtMiddleware } from "./middlewares/AuthJwtMiddleware";
import { buildPathFromRoot } from "./lib/utils/paths";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";
import { ApiErrorHandler } from "./middlewares/ApiErrorHandler";
import path from "path";

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
const controllers: Controller[] = [authController, userController];
const migrationsFolderPath: string = path.join(__dirname, "migrations"); // at runtime, this will point to dist/migrations

server
  .initDatabase(buildPathFromRoot(migrationsFolderPath))
  .then(() => {
    server.listEnv();
    server.loadGlobalMiddlewares(globalMiddleWares);
    server.serveStaticFiles();
    server.loadControllers("/api/v1", controllers);
    server.loadErrorHandlingMiddleware(ApiErrorHandler.handleError);
    server.listen();
  })
  .catch((e: unknown) => lazyHandleException(e, "initializing database failed", logger));
