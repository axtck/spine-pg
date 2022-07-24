import { Logger } from "../core/Logger";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../core/ApiError";
import { container } from "../inversify.config";
import { HttpStatusCode } from "../core/types/HttpStatusCode";
import { Middleware } from "../core/Middleware";

export class ApiErrorHandler extends Middleware {
  // has to have 4 parameter for Express to recognize error
  public static handleError = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const logger = container.resolve(Logger);
    logger.error(err.message); // log the error

    if (err instanceof ApiError) {
      // send response when API Error
      res.status(err.code).json({
        message: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack,
        extra: err.extra
      });
      return;
    }

    // send default response
    res.status(HttpStatusCode.Internal).json({
      message: err.message,
      customMessage: "something went wrong",
      name: err.name,
      stack: err.stack
    });
  };
}
