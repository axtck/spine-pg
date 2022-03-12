import { Nullable } from "./../types";
import { ApiError } from "./../lib/errors/ApiError";
import { UserService } from "../controllers/user/services/UserService";
import { Request, Response, NextFunction } from "express";
import { penv } from "../config/penv";
import { Middleware } from "../core/Middleware";
import { Logger } from "../core/Logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Id } from "../types";
import { injectable } from "tsyringe";

@injectable()
export class AuthJwtMiddleware extends Middleware {
    private readonly userService: UserService;
    constructor(logger: Logger, userService: UserService) {
        super(logger);
        this.userService = userService;
    }

    public verifyToken = (req: Request, res: Response, next: NextFunction): Response | void => {
        const token: string | undefined = req.header("x-access-token");

        if (!token) {
            next(ApiError.forbidden("no token provided"));
            return;
        }

        try {
            const decoded: string | JwtPayload = jwt.verify(token, penv.auth.jwtAuthkey);
            if (!decoded || typeof decoded === "string") {
                next(ApiError.internal("decoding token failed"));
                return;
            }
            res.locals.userId = decoded.id; // pass the decoded id value to the next middleware
            next();
        } catch (e) {
            next(ApiError.internal(`token authorization failed: ${e}`));
            return;
        }
    };

    private authenticateRole = (userId: Id, userRoleNames: string[], role: string, next: NextFunction): void => {
        if (!userRoleNames) {
            next(ApiError.internal("no roles found", { userId: userId }));
            return;
        }

        if (userRoleNames.includes(role)) {
            next();
            return;
        }

        next(ApiError.forbidden("require role", { role: role }));
        return;
    };

    public isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId: Nullable<Id> = res.locals.id;
        if (!userId) {
            next(ApiError.forbidden("no id in request"));
            return;
        }

        const userRoleNames = await this.userService.getUserRoleNames(userId);
        this.authenticateRole(userId, userRoleNames, "admin", next);
    };

    public isModerator = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId: Nullable<Id> = res.locals.id;
        if (!userId) {
            next(ApiError.forbidden("no id in request"));
            return;
        }

        const userRoleNames = await this.userService.getUserRoleNames(userId);
        this.authenticateRole(userId, userRoleNames, "moderator", next);
    };
}