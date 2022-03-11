import { HttpStatusCode, HttpStatusName } from "./types";
export class ApiError extends Error {
    public code: number;
    public extra: unknown;

    constructor(message: string, code: HttpStatusCode, extraName: HttpStatusName, extra?: unknown) {
        super(message);
        this.code = code;
        this.name = `ApiError (${extraName})`;
        this.extra = extra;
    }

    public static badRequest = (msg: string, extra?: unknown): ApiError => {
        return new ApiError(msg, HttpStatusCode.BadRequest, HttpStatusName.BadRequest, extra);
    };

    // similar to 403 Forbidden, but specifically for use when 
    // authentication is required and has failed or has not yet been provided
    public static unauthorized = (msg: string, extra?: unknown): ApiError => {
        return new ApiError(msg, HttpStatusCode.Unauthorized, HttpStatusName.Unauthorized, extra);
    };

    public static forbidden = (msg: string, extra?: unknown): ApiError => {
        return new ApiError(msg, HttpStatusCode.Forbidden, HttpStatusName.Forbidden, extra);
    };

    public static internal = (msg: string, extra?: unknown): ApiError => {
        return new ApiError(msg, HttpStatusCode.Internal, HttpStatusName.Internal, extra);
    };
}