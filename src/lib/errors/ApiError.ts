export class ApiError extends Error {
    private _code: number;
    private _message: string;

    constructor(code: number, message: string, extraName: string) {
        super();
        this.name = `ApiError (${extraName})`;
        this._code = code;
        this._message = message;
    }

    public get code(): number {
        return this._code;
    }

    public get message(): string {
        return this._message;
    }

    static badRequest(msg: string): ApiError {
        return new ApiError(400, msg, "Bad Request");
    }

    // similar to 403 Forbidden, but specifically for use when 
    // authentication is required and has failed or has not yet been provided
    static unauthorized(msg: string): ApiError {
        return new ApiError(401, msg, "Unauthorized");
    }

    static forbidden(msg: string): ApiError {
        return new ApiError(403, msg, "Forbidden");
    }

    static internal(msg: string): ApiError {
        return new ApiError(500, msg, "Internal");
    }
}