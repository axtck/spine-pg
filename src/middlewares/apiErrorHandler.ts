import { Logger } from "./../core/Logger";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/errors/ApiError";

// has to have 4 parameter for Express to recognize error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const logger = new Logger();
    logger.error(err.message); // log the error

    if (err instanceof ApiError) {
        // send response when API Error
        res.status(err.code).json({
            message: err.message,
            code: err.code,
            name: err.name,
            stack: err.stack
        });
        return;
    }

    // send default response
    res.status(500).json({
        message: err.message,
        customMessage: "something went wrong",
        name: err.name,
        stack: err.stack
    });
};