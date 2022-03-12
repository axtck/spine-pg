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
        const bearer: string | undefined = req.headers.authorization; // full Bearer token

        if (!bearer) {
            next(ApiError.forbidden("no authorization token provided"));
            return;
        }

        try {
            if (!bearer.startsWith("Bearer ")) throw new Error("authorization token has to start with Bearer");
            const token: string = bearer.slice(7); // slice token from Bearer
            const decoded: string | JwtPayload = jwt.verify(token, penv.auth.jwtAuthkey);
            if (!decoded || typeof decoded === "string") {
                next(ApiError.internal("decoding token failed"));
                return;
            }
            res.locals.userId = decoded.sub; // pass the decoded sub (id) value to the next middleware
            next();
        } catch (e) {
            if (e instanceof Error) {
                next(ApiError.internal(`token authorization failed: ${e.message}`));
                return;
            }
            next(ApiError.internal(`token authorization failed: ${e}`));
            return;
        }
    };

    public isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId: Nullable<Id> = res.locals.userId;
        if (!userId) {
            next(ApiError.forbidden("no id in request"));
            return;
        }

        const userRoleNames = await this.userService.getUserRoleNames(userId);
        this.authenticateRole(userId, userRoleNames, "admin", next);
    };

    public isModerator = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId: Nullable<Id> = res.locals.userId;
        if (!userId) {
            next(ApiError.forbidden("no id in request"));
            return;
        }

        const userRoleNames: string[] = await this.userService.getUserRoleNames(userId);
        this.authenticateRole(userId, userRoleNames, "moderator", next);
    };

    private authenticateRole = (userId: Id, userRoleNames: string[], role: string, next: NextFunction): void => {
        if (!userRoleNames.length) {
            next(ApiError.internal("no roles found", { userId: userId }));
            return;
        }

        if (!userRoleNames.includes(role)) {
            next(ApiError.forbidden("require role", { role: role }));
            return;
        }

        next();
    };
}