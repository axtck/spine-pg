import { container } from "tsyringe";
import { HttpStatusCode } from "./../lib/errors/types";
import { Logger } from "./../core/Logger";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/errors/ApiError";

// has to have 4 parameter for Express to recognize error
// eslint-disable-next-line no-unused-vars
export const apiErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
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