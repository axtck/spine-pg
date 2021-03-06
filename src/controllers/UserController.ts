import { toNullableId } from "../lib/utils/verification";
import { IProfilePicture } from "../domains/user/profile/models/ProfilePicture";
import { profilePicturesMulterUpload } from "../lib/files/multer";
import { ProfilePictureService } from "../domains/user/profile/services/ProfilePictureService";
import { ApiError } from "../core/ApiError";
import { Id } from "../core/types/core";
import { Logger } from "../core/Logger";
import { AuthJwtMiddleware } from "../middlewares/AuthJwtMiddleware";
import { Request, Response, NextFunction } from "express";
import { Controller } from "../core/Controller";
import { Nullable } from "../core/types/core";
import { injectable } from "inversify";
import { IUserBase } from "../domains/user/info/models/UserBase";
import { UserService } from "../domains/user/info/services/UserService";
import { IControllerRoute } from "../core/types/ControllerRoute";
import { HttpMethod } from "../core/types/HttpMethod";

@injectable()
export class UserController extends Controller {
  public path = "/user";
  private readonly userService: UserService;
  private readonly profilePictureService: ProfilePictureService;
  private readonly authJwtMiddleware: AuthJwtMiddleware;

  protected get routes(): IControllerRoute[] {
    const routes: IControllerRoute[] = [
      {
        path: "/all",
        method: HttpMethod.Get,
        handler: this.handleAllContent,
        localMiddleware: []
      },
      {
        path: "/user",
        method: HttpMethod.Get,
        handler: this.handleUserContent,
        localMiddleware: [this.authJwtMiddleware.verifyToken]
      },
      {
        path: "/userbaseinfo",
        method: HttpMethod.Get,
        handler: this.handleGetUserInfo,
        localMiddleware: [this.authJwtMiddleware.verifyToken]
      },
      {
        path: "/profile-picture",
        method: HttpMethod.Post,
        handler: this.handleAddProfilePicture,
        localMiddleware: [this.authJwtMiddleware.verifyToken, profilePicturesMulterUpload.single("file")]
      },
      {
        path: "/profile-pictures",
        method: HttpMethod.Get,
        handler: this.handleGetProfilePictures,
        localMiddleware: [this.authJwtMiddleware.verifyToken]
      },
      {
        path: "/profile-picture/:id",
        method: HttpMethod.Get,
        handler: this.handleGetProfilePictureById,
        localMiddleware: [this.authJwtMiddleware.verifyToken]
      },
      {
        path: "/profile-picture/active",
        method: HttpMethod.Get,
        handler: this.handleGetActiveProfilePicture,
        localMiddleware: [this.authJwtMiddleware.verifyToken]
      }
    ];

    return routes;
  }

  constructor(
    logger: Logger,
    userService: UserService,
    authJwtMiddleware: AuthJwtMiddleware,
    profilePictureService: ProfilePictureService
  ) {
    super(logger);
    this.userService = userService;
    this.profilePictureService = profilePictureService;
    this.authJwtMiddleware = authJwtMiddleware;
  }

  public handleAllContent = async (req: Request, res: Response): Promise<void> => {
    this.sendOk(res, undefined, "all content");
  };

  public handleUserContent = async (req: Request, res: Response): Promise<void> => {
    this.sendOk(res, undefined, "user content");
  };

  public handleGetUserInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: Id | undefined = req.userId;
      if (!userId) return next(ApiError.badRequest("no user id in request"));
      const userInfo: Nullable<IUserBase> = await this.userService.getBaseById(userId);

      if (!userInfo) return next(ApiError.notFound("no user info found", { user: userId }));

      this.sendOk(res, userInfo, "user base info");
    } catch (e) {
      if (e instanceof Error) return next(ApiError.internal(`getting user info failed: ${e.message}`));
      return next(ApiError.internal(`getting user info failed: ${e}`));
    }
  };

  public handleAddProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: Id | undefined = req.userId;
      if (!userId) return next(ApiError.badRequest("no user id in request"));
      if (!req.file) return next(ApiError.badRequest("no file provided in request"));

      await this.profilePictureService.createProfilePicture(userId, req.file);
      this.sendCreated(res, "profile picture added", { userId: userId });
    } catch (e) {
      if (e instanceof Error) return next(ApiError.internal(`uploading profile picture failed: ${e.message}`));
      return next(ApiError.internal(`uploading profile picture failed: ${e}`));
    }
  };

  public handleGetProfilePictures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: Id | undefined = req.userId;
      if (!userId) return next(ApiError.badRequest("no user id in request"));
      const profilePictures: IProfilePicture[] = await this.profilePictureService.getByUserId(userId);
      this.sendOk(res, profilePictures);
    } catch (e) {
      if (e instanceof Error) return next(ApiError.internal(`getting profile pictures failed: ${e.message}`));
      return next(ApiError.internal(`getting profile pictures failed: ${e}`));
    }
  };

  public handleGetProfilePictureById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: Nullable<Id> = toNullableId(req.params.id);
      if (!id) return next(ApiError.badRequest("no id in request params"));

      const profilePicture: Nullable<IProfilePicture> = await this.profilePictureService.getOneById(id);
      if (!profilePicture) return next(ApiError.notFound("no profile picture found for id", { user: id }));

      this.sendOk(res, profilePicture);
    } catch (e) {
      if (e instanceof Error) return next(ApiError.internal(`getting profile picture by id failed: ${e.message}`));
      return next(ApiError.internal(`getting profile picture by id failed: ${e}`));
    }
  };

  public handleGetActiveProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: Id | undefined = req.userId;
      if (!userId) return next(ApiError.badRequest("no user id in request"));
      const profilePicture: Nullable<IProfilePicture> = await this.profilePictureService.getActiveForUser(userId);

      if (!profilePicture) return next(ApiError.notFound("no active profile picture found", { user: userId }));

      this.sendOk(res, profilePicture);
    } catch (e) {
      if (e instanceof Error) return next(ApiError.internal(`getting active profile picture failed: ${e.message}`));
      return next(ApiError.internal(`getting active profile picture failed: ${e}`));
    }
  };
}
