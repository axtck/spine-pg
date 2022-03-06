import { Logger } from "../../core/Logger";
import { AuthJwtMiddleware } from "../../middlewares/AuthJwtMiddleware";
import { UserService } from "./services/UserService";
import { Request, Response } from "express";
import { Controller } from "../../core/Controller";
import { IControllerRoute } from "../types";
import { HttpMethod } from "../../types";
import { injectable } from "tsyringe";

@injectable()
export class UserController extends Controller {
    public path = "/content";
    private readonly userService: UserService;
    private readonly authJwtMiddleware: AuthJwtMiddleware;

    constructor(logger: Logger, userService: UserService, authJwtMiddleware: AuthJwtMiddleware) {
        super(logger);
        this.userService = userService;
        this.authJwtMiddleware = authJwtMiddleware;
    }

    public async handleAllContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "all content");
    }

    public async handleUserContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "user content");
    }

    public async handleAdminContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "admin content");
    }

    public async handleModeratorContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "moderator content");
    }

    protected get routes(): IControllerRoute[] {
        const routes: IControllerRoute[] = [
            {
                path: "/all",
                method: HttpMethod.Get,
                handler: this.handleAllContent.bind(this),
                localMiddleware: []
            },
            {
                path: "/user",
                method: HttpMethod.Get,
                handler: this.handleUserContent.bind(this),
                localMiddleware: [
                    this.authJwtMiddleware.verifyToken
                ]
            },
            {
                path: "/admin",
                method: HttpMethod.Get,
                handler: this.handleAdminContent.bind(this),
                localMiddleware: [
                    this.authJwtMiddleware.verifyToken,
                    this.authJwtMiddleware.isAdmin
                ]
            },
            {
                path: "/moderator",
                method: HttpMethod.Get,
                handler: this.handleModeratorContent.bind(this),
                localMiddleware: [
                    this.authJwtMiddleware.verifyToken,
                    this.authJwtMiddleware.isModerator
                ]
            }
        ];

        return routes;
    }
}