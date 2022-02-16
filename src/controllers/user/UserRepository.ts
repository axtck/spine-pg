import { injectable } from "tsyringe";
import { Logger } from "../../core/Logger";
import { Database } from "../../core/Database";
import { Repository } from "../../core/Repository";

@injectable()
export class UserRepository extends Repository {
    constructor(logger: Logger, database: Database) {
        super(logger, database);
    }
}