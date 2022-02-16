import { Logger } from "./Logger";

export abstract class Middleware {
    protected readonly logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }
}