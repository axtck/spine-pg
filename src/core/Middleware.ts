import { injectable } from "inversify";
import { Logger } from "./Logger";

@injectable()
export abstract class Middleware {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
}
