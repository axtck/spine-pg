import { Logger } from "../../core/Logger";
export const lazyHandleException = (e: unknown, message: string, logger: Logger): void => {
    if (e instanceof Error) {
        logger.error(`${message}: ${e.message}`);
    } else {
        logger.error(`the thrown value was not an error, ${message}: ${e}`);
    }
};