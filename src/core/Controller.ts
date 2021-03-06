import { Logger } from "./Logger";
import { Response, Router } from "express";
import { injectable } from "inversify";
import { IControllerRoute } from "./types/ControllerRoute";
import { HttpMethod } from "./types/HttpMethod";
import { HttpStatusCode } from "./types/HttpStatusCode";
import { HttpStatusName } from "./types/HttpStatusName";

@injectable()
export abstract class Controller {
  private readonly router: Router;
  public abstract path: string;
  protected abstract routes: IControllerRoute[];
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.router = Router();
    this.logger = logger;
  }

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      for (const middleware of route.localMiddleware) {
        this.router.use(route.path, middleware);
      }
      switch (route.method) {
        case HttpMethod.Get:
          this.router.get(route.path, route.handler);
          break;
        case HttpMethod.Post:
          this.router.post(route.path, route.handler);
          break;
        case HttpMethod.Put:
          this.router.put(route.path, route.handler);
          break;
        case HttpMethod.Delete:
          this.router.delete(route.path, route.handler);
          break;
        default:
          this.logger.error("not a valid method");
          break;
      }
    }
    return this.router;
  };

  protected sendOk = (res: Response, data?: unknown, message?: string): Response => {
    return res.status(HttpStatusCode.Ok).json({
      message: message || HttpStatusName.Ok,
      data: data
    });
  };

  protected sendCreated = (res: Response, message?: string, extra?: unknown): Response => {
    return res.status(HttpStatusCode.Created).json({
      message: message || HttpStatusName.Created,
      extra: extra
    });
  };
}
