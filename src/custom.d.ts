declare namespace Express {
    // extend Request so id is accessible
    export interface Request {
        id?: number;
    }
}