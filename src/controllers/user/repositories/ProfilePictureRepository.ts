import { Id, QueryString } from "./../../../types";
import { Database } from "./../../../core/Database";
import { Logger } from "./../../../core/Logger";
import { Repository } from "../../../core/Repository";
import { injectable } from "tsyringe";

@injectable()
export class ProfilePictureRepository extends Repository {
    constructor(logger: Logger, database: Database) {
        super(logger, database);
    }

    public insertProfilePicture = async (userId: Id, fileLocation: string): Promise<void> => {
        const insertQuery: QueryString = `
            INSERT INTO profile_pictures
            ("user_id", "active", "file_location", "created", "modified")
            VALUES($1, $2, $3, $4, $5);
        `;

        const now: Date = new Date();
        await this.database.query(insertQuery, [userId, true, fileLocation, now, now]);
    };
}