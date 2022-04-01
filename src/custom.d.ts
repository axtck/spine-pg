declare namespace Express {
    // extend Request so id is accessible
    export interface Request {
        userId: number; // userId is set to number (not number | undefined) because after verifyToken() we know it is a number
    }
}