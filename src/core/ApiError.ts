import { HttpStatusCode } from "./types/HttpStatusCode";
import { HttpStatusName } from "./types/HttpStatusName";

export class ApiError extends Error {
  public code: number;
  public extra: unknown;

  constructor(message: string, code: HttpStatusCode, extraName: HttpStatusName, extra?: unknown) {
    super(message);
    this.code = code;
    this.name = `ApiError (${extraName})`;
    this.extra = extra;
  }

  // 400
  public static badRequest = (msg: string, extra?: unknown): ApiError => {
    return new ApiError(msg, HttpStatusCode.BadRequest, HttpStatusName.BadRequest, extra);
  };

  //401
  // similar to 403 Forbidden, but specifically for use when
  // authentication is required and has failed or has not yet been provided
  public static unauthorized = (msg: string, extra?: unknown): ApiError => {
    return new ApiError(msg, HttpStatusCode.Unauthorized, HttpStatusName.Unauthorized, extra);
  };

  // 403
  public static forbidden = (msg: string, extra?: unknown): ApiError => {
    return new ApiError(msg, HttpStatusCode.Forbidden, HttpStatusName.Forbidden, extra);
  };

  // 404
  public static notFound = (msg: string, extra?: unknown): ApiError => {
    return new ApiError(msg, HttpStatusCode.NotFound, HttpStatusName.NotFound, extra);
  };

  // 500
  public static internal = (msg: string, extra?: unknown): ApiError => {
    return new ApiError(msg, HttpStatusCode.Internal, HttpStatusName.Internal, extra);
  };
}
