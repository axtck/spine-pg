import { Logger } from "./Logger";

export abstract class Service {
    protected readonly logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }
}