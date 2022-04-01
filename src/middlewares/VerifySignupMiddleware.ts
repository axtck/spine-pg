import { AuthService } from "./../controllers/auth/AuthService";
import { Constants } from "./../Constants";
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
            return next(ApiError.badRequest("email does not meet the expectations", { email: req.body.email }));
        }

        next();
    };

    public validatePasswordFormat = (req: Request, res: Response, next: NextFunction): void => {
        if (!this.authService.validatePasswordFormat(req.body.password)) {
            return next(ApiError.badRequest("password not strong enough"));
        }

        next();
    };

    public checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const duplicateUsername = await this.userService.getDuplicateUsernameId(req.body.username);
        if (duplicateUsername) {
            return next(ApiError.badRequest("username already in use", { username: req.body.username }));
        }

        const duplicateEmail = await this.userService.getDuplicateEmailId(req.body.email);
        if (duplicateEmail) {
            return next(ApiError.badRequest("email already in use", { email: req.body.email }));
        }

        next();
    };

    public checkRolesExisted = (req: Request, res: Response, next: NextFunction): void => {
        const roleNames: string[] = Constants.userRoleEnumValues;
        if (req.body.roles?.length) {
            for (const role of req.body.roles) {
                if (!roleNames.includes(role)) {
                    return next(ApiError.badRequest("invalid role", { role: role }));
                }
            }
        }

        next();
    };
}