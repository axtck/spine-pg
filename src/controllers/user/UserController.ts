import { Logger } from "../../core/Logger";
import { AuthJwtMiddleware } from "../../middlewares/AuthJwtMiddleware";
import { Request, Response } from "express";
import { Controller } from "../../core/Controller";
import { IControllerRoute } from "../types";
import { HttpMethod, Nullable } from "../../types";
import { injectable } from "tsyringe";
import { IUserBase } from "./models/UserBase";
import { UserService } from "./services/UserService";

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

    public async handleGetUserInfo(req: Request, res: Response): Promise<void> {
        const userInfo: Nullable<IUserBase> = await this.userService.getBaseById(req.id);

        if (!userInfo) {
            this.sendSuccess(res, undefined, `no user found with id '${req.id}'`);
            return;
        }

        this.sendSuccess(res, userInfo, "user base info");
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
                path: "/userbaseinfo",
                method: HttpMethod.Get,
                handler: this.handleGetUserInfo.bind(this),
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