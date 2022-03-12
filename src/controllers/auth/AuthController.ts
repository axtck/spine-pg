import { Logger } from "../../core/Logger";
import { VerifySignupMiddleware } from "../../middlewares/VerifySignupMiddleware";
import { UserService } from "../user/services/UserService";
import { NextFunction, Request, Response } from "express";
import { Controller } from "../../core/Controller";
import { IControllerRoute } from "../types";
import { HttpMethod, Nullable } from "../../types";
import { IUserCredentials } from "../user/types";
import { ApiError } from "../../lib/errors/ApiError";
import { penv } from "../../config/penv";
import { ILoginResponse } from "../types";
import { injectable } from "tsyringe";
import { AuthService } from "./AuthService";

@injectable()
export class AuthController extends Controller {
    public path = "/auth";
    private readonly authService: AuthService;
    private readonly userService: UserService;
    private readonly verifySignupMiddleware: VerifySignupMiddleware;

    constructor(logger: Logger,
        authService: AuthService,
        userService: UserService,
        verifySignupMiddleware: VerifySignupMiddleware) {
        super(logger);
        this.authService = authService;
        this.userService = userService;
        this.verifySignupMiddleware = verifySignupMiddleware;
    }

    public handleSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.userService.createUser(req.body.username, req.body.email, req.body.password);
            await this.userService.assignRoles(req.body.username, req.body.roles);

            this.sendCreated(res, "user succesfully created", { username: req.body.username });
        } catch (e) {
            if (e instanceof Error) {
                next(ApiError.internal(`signup failed: ${e.message}`));
                return;
            }
            next(ApiError.internal(`signup failed: ${e}`));
            return;
        }
    };

    public handleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user: Nullable<IUserCredentials> = await this.userService.getUserByUsername(req.body.username);
            if (!user) {
                next(ApiError.unauthorized("user not found", { username: req.body.username }));
                return;
            }

            const passwordIsValid: boolean = this.authService.validatePassword(req.body.password, user.password);
            if (!passwordIsValid) {
                next(ApiError.unauthorized("invalid password attempt", { username: req.body.username }));
                return;
            }

            const token: string = this.authService.signToken(user.id, penv.auth.jwtAuthkey);
            const userRoles: string[] = await this.userService.getUserRoleNames(user.id);

            const loginResponse: ILoginResponse = {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: userRoles,
                accessToken: token
            };

            this.sendOk(res, loginResponse, "user successfully logged in");
        } catch (e) {
            if (e instanceof Error) {
                next(ApiError.internal(`login failed: ${e.message}`));
                return;
            }
            next(ApiError.internal(`login failed: ${e}`));
            return;
        }
    };

    protected get routes(): IControllerRoute[] {
        const routes: IControllerRoute[] = [
            {
                path: "/signup",
                method: HttpMethod.Post,
                handler: this.handleSignup,
                localMiddleware: [
                    this.verifySignupMiddleware.validateEmailFormat, // 1: validate email format
                    this.verifySignupMiddleware.checkDuplicateUsernameOrEmail, // 2: check if already exists
                    this.verifySignupMiddleware.validatePasswordFormat, // 3: valiate password strength
                    this.verifySignupMiddleware.checkRolesExisted // 4: validate roles
                ]
            },
            {
                path: "/login",
                method: HttpMethod.Post,
                handler: this.handleLogin,
                localMiddleware: []
            }
        ];

        return routes;
    }
}