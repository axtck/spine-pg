import { IProfilePictureDao } from "./../daos/ProfilePictureDao";
import { Id, Nullable, QueryString } from "./../../../types";
import { IInsertProfilePictureData } from "../types";
import { Database } from "./../../../core/Database";
import { Logger } from "./../../../core/Logger";
import { Repository } from "../../../core/Repository";
import { injectable } from "tsyringe";

@injectable()
export class ProfilePictureRepository extends Repository {
    constructor(logger: Logger, database: Database) {
        super(logger, database);
    }
    public insertProfilePicture = async (insertData: IInsertProfilePictureData): Promise<void> => {
        const insertQuery: QueryString = `
            INSERT INTO profile_pictures
            ("user_id", "active", "filename", "extension", "file_location", "created", "modified")
            VALUES($1, $2, $3, $4, $5, $6, $7);
        `;

        const parameters: unknown[] = [
            insertData.userId, // $1: user_id
            insertData.active, // $2: active
            insertData.filename, // $3: filename
            insertData.extension, // $4: extension
            insertData.fileLocation, // $5: file_location
            insertData.created, // $6: created
            insertData.modified // $7: modified
        ];
        await this.database.query(insertQuery, parameters);
    };

    public setActive = async (pictureId: Id, userId: Id): Promise<void> => {
        // set other profile pictures inactive
        const deactivateOthersQuery: QueryString = `
            UPDATE profile_pictures
            SET "active" = FALSE, "modified" = $1
            WHERE user_id = $2 AND "active" = TRUE
        `;

        await this.database.query(deactivateOthersQuery, [new Date(), userId]);

        // activate specific profile picture
        const updateQuery: QueryString = `
            UPDATE profile_pictures 
            SET "active" = TRUE, "modified" = $1
            WHERE "id" = $2
        `;

        await this.database.query(updateQuery, [new Date(), pictureId]);
    };

    public getOneByFileName = async (filename: string): Promise<Nullable<{ id: Id; }>> => {
        const getQuery: QueryString = `
            SELECT id FROM profile_pictures
            WHERE filename = $1
        `;

        const picture: Nullable<{ id: Id; }> = await this.database.queryOne(getQuery, [filename]);
        return picture;
    };

    public getByUserId = async (userId: Id): Promise<IProfilePictureDao[]> => {
        const getQuery: QueryString = `
            SELECT id, user_id, active, filename, extension, file_location, created, modified 
            FROM profile_pictures
            WHERE user_id = $1
        `;

        const picture: IProfilePictureDao[] = await this.database.query(getQuery, [userId]);
        return picture;
    };
}