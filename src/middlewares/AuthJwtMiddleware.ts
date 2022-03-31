import { toNullableId } from "./../lib/utils/verification";
import { UserRole } from "./../controllers/user/types";
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
        try {
            const bearer: string | undefined = req.headers.authorization; // full Bearer token

            // validate Bearer token
            if (!bearer) return next(ApiError.forbidden("no authorization token provided"));
            if (!bearer.startsWith("Bearer ")) return next(ApiError.forbidden("authorization token has to start with Bearer"));

            const token: string = bearer.slice(7); // slice token from Bearer
            const decoded: string | JwtPayload = jwt.verify(token, penv.auth.jwtAuthkey);

            // validate decoded value
            if (!decoded) return next(ApiError.internal("decoding token failed, decoded token undefined"));
            if (typeof decoded === "string") return next(ApiError.internal("decoding token failed, decoded token is not an object"));
            if (!decoded.sub) return next(ApiError.internal("decoding token failed, decoded token sub value undefined"));

            const id: Nullable<Id> = toNullableId(decoded.sub);
            if (!id) return next(ApiError.internal("decoding token failed, decoded token sub value is NaN"));

            req.userId = id; // pass the decoded sub (id) value to the next middleware
            next();
        } catch (e) {
            if (e instanceof Error) return next(ApiError.internal(`token authorization failed: ${e.message}`));
            return next(ApiError.internal(`token authorization failed: ${e}`));
        }
    };

    public isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId: Id = req.userId;

        const userRoleNames: string[] = await this.userService.getUserRoleNames(userId);
        this.authenticateRole(userId, userRoleNames, UserRole.Admin, next);
        next();
    };

    public isModerator = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId: Id = req.userId;

        const userRoleNames: string[] = await this.userService.getUserRoleNames(userId);
        this.authenticateRole(userId, userRoleNames, UserRole.Moderator, next);
        next();
    };

    private authenticateRole = (userId: Id, userRoleNames: string[], role: UserRole, next: NextFunction): void => {
        if (!userRoleNames.length) return next(ApiError.internal("no roles found", { userId: userId }));
        if (!userRoleNames.includes(role)) return next(ApiError.forbidden("require role", { role: role }));
    };
}