import { Logger } from "../core/Logger";
import { VerifySignupMiddleware } from "../middlewares/VerifySignupMiddleware";
import { UserService } from "../domains/user/info/services/UserService";
import { NextFunction, Request, Response } from "express";
import { Controller } from "../core/Controller";
import { Nullable } from "../core/types/core";
import { ApiError } from "../core/ApiError";
import { penv } from "../config/penv";
import { injectable } from "inversify";
import { AuthService } from "../domains/auth/AuthService";
import { IControllerRoute } from "../core/types/ControllerRoute";
import { HttpMethod } from "../core/types/HttpMethod";
import { ILoginResponse } from "./types/LoginResponse";
import { IUserCredentials } from "../domains/user/info/models/UserBase";

@injectable()
export class AuthController extends Controller {
  public path = "/auth";
  private readonly authService: AuthService;
  private readonly userService: UserService;
  private readonly verifySignupMiddleware: VerifySignupMiddleware;

  protected get routes(): IControllerRoute[] {
    const routes: IControllerRoute[] = [
      {
        path: "/signup",
        method: HttpMethod.Post,
        handler: this.handleSignup,
        localMiddleware: [
          this.verifySignupMiddleware.validateEmailFormat, // 1: validate email format
          this.verifySignupMiddleware.checkDuplicateUsernameOrEmail, // 2: check if already exists
          this.verifySignupMiddleware.validatePasswordFormat // 3: valiate password strength
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

  constructor(
    logger: Logger,
    authService: AuthService,
    userService: UserService,
    verifySignupMiddleware: VerifySignupMiddleware
  ) {
    super(logger);
    this.authService = authService;
    this.userService = userService;
    this.verifySignupMiddleware = verifySignupMiddleware;
  }

  public handleSignup = async (
    req: Request<unknown, unknown, { username?: string; email?: string; password?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.body.username || !req.body.email || !req.body.password) {
        return next(ApiError.badRequest("missing body parameters"));
      }
      await this.userService.createUser(req.body.username, req.body.email, req.body.password);
      this.sendCreated(res, "user succesfully created", { username: req.body.username });
    } catch (e) {
      if (e instanceof Error) return next(ApiError.internal(`signup failed: ${e.message}`));
      return next(ApiError.internal(`signup failed: ${e}`));
    }
  };

  public handleLogin = async (
    req: Request<unknown, unknown, { username?: string; password?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.body.username || !req.body.password) {
        return next(ApiError.badRequest("missing body parameters"));
      }
      const user: Nullable<IUserCredentials> = await this.userService.getCredentialsByUsername(req.body.username);
      if (!user) return next(ApiError.unauthorized("user not found", { username: req.body.username }));

      const passwordIsValid: boolean = this.authService.validatePassword(req.body.password, user.password);
      if (!passwordIsValid) {
        return next(ApiError.unauthorized("invalid password attempt", { username: req.body.username }));
      }

      const token: string = this.authService.signToken(user.id, penv.auth.jwtAuthkey);

      const loginResponse: ILoginResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token
      };

      this.sendOk(res, loginResponse, "user successfully logged in");
    } catch (e) {
      if (e instanceof Error) return next(ApiError.internal(`login failed: ${e.message}`));
      return next(ApiError.internal(`login failed: ${e}`));
    }
  };
}
