import { injectable } from "inversify";
import { Logger } from "./Logger";

@injectable()
export abstract class Service {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
}
