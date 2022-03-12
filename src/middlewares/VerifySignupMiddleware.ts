import { AuthService } from "./../controllers/auth/AuthService";
import { Constants } from "./../Constants";
import { UserRole } from "../controllers/user/types";
import { ApiError } from "./../lib/errors/ApiError";
import { UserService } from "../controllers/user/services/UserService";
import { Request, Response, NextFunction } from "express";
import { Middleware } from "../core/Middleware";
import { Logger } from "../core/Logger";
import { injectable } from "tsyringe";

@injectable()
export class VerifySignupMiddleware extends Middleware {
    private readonly userService: UserService;
    private readonly authService: AuthService;
    constructor(logger: Logger, userService: UserService, authService: AuthService) {
        super(logger);
        this.userService = userService;
        this.authService = authService;
    }

    public validateEmailFormat = (req: Request, res: Response, next: NextFunction): void => {
        if (!this.authService.validateEmailFormat(req.body.email)) {
            next(ApiError.badRequest("email does not meet the expectations", { email: req.body.email }));
            return;
        }

        next();
    };

    public validatePasswordFormat = (req: Request, res: Response, next: NextFunction): void => {
        if (!this.authService.validatePasswordFormat(req.body.password)) {
            next(ApiError.badRequest("password too weak"));
            return;
        }

        next();
    };

    public checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const duplicateUsername = await this.userService.getDuplicateUsernameId(req.body.username);
        if (duplicateUsername) {
            next(ApiError.badRequest("username already in use", { username: req.body.username }));
            return;
        }

        const duplicateEmail = await this.userService.getDuplicateEmailId(req.body.email);
        if (duplicateEmail) {
            next(ApiError.badRequest("email already in use", { email: req.body.email }));
            return;
        }

        next();
    };

    public checkRolesExisted = (req: Request, res: Response, next: NextFunction): void => {
        const roleNames: UserRole[] = Constants.userRoles;
        if (req.body.roles?.length) {
            for (const role of req.body.roles) {
                if (!roleNames.includes(role)) {
                    next(ApiError.badRequest("invalid role", { role: role }));
                    return;
                }
            }
        }

        next();
    };
}