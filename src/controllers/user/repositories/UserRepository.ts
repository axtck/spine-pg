import { Id, Nullable } from "./../../../types";
import { IUserBaseDao } from "./../daos/UserBaseDao";
import { QueryString } from "../../../types";
import { injectable } from "tsyringe";
import { Logger } from "../../../core/Logger";
import { Database } from "../../../core/Database";
import { Repository } from "../../../core/Repository";

@injectable()
export class UserRepository extends Repository {
    constructor(logger: Logger, database: Database) {
        super(logger, database);
    }

    public async getBaseById(id: Id): Promise<Nullable<IUserBaseDao>> {
        const getBaseByIdQuery: QueryString = `
            SELECT
                id,
                username,
                email,
                password
            FROM users 
            WHERE id = $1
        `;

        const userBase: Nullable<IUserBaseDao> = await this.database.queryOne(getBaseByIdQuery, [id]);
        return userBase;
    }
}