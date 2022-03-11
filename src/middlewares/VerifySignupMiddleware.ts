import { lazyHandleException } from "../lib/functions/exceptionHandling";
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
    constructor(logger: Logger, userService: UserService) {
        super(logger);
        this.userService = userService;
    }

    public checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const duplicateUsername = await this.userService.getDuplicateUsernameId(req.body.username);
            if (duplicateUsername) {
                next(ApiError.badRequest(`username '${req.body.username}' already in use`));
                return;
            }

            const duplicateEmail = await this.userService.getDuplicateEmailId(req.body.email);
            if (duplicateEmail) {
                next(ApiError.badRequest(`email '${req.body.email}' already in use`));
                return;
            }

            next();
        } catch (e) {
            lazyHandleException(e, "verifying signup failed", this.logger);
        }
    };

    public checkRolesExisted = (req: Request, res: Response, next: NextFunction): void => {
        const roleNames: UserRole[] = Constants.userRoles;
        if (req.body.roles?.length) {
            for (const role of req.body.roles) {
                if (!roleNames.includes(role)) {
                    next(ApiError.badRequest(`invalid role '${role}'`));
                    return;
                }
            }
        }

        next();
    };
}