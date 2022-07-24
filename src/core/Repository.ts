import { Logger } from "./Logger";
import { Database } from "./Database";
import { injectable } from "inversify";

@injectable()
export abstract class Repository {
  protected readonly logger: Logger;
  protected readonly database: Database;

  constructor(logger: Logger, database: Database) {
    this.logger = logger;
    this.database = database;
  }
}
