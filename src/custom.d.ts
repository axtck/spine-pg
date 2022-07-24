/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  // extend Request so id is accessible
  export interface Request {
    userId?: number;
  }
}
