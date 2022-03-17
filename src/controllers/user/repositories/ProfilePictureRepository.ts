import { IFileParts } from "./../../../core/services/types";
import { FileService } from "./../../../core/services/FileService";
import { Id, QueryString } from "./../../../types";
import { Database } from "./../../../core/Database";
import { Logger } from "./../../../core/Logger";
import { Repository } from "../../../core/Repository";
import { injectable } from "tsyringe";

@injectable()
export class ProfilePictureRepository extends Repository {
    private readonly fileService: FileService;
    constructor(logger: Logger, database: Database, fileService: FileService) {
        super(logger, database);
        this.fileService = fileService;
    }

    public insertProfilePicture = async (userId: Id, fileLocation: string): Promise<void> => {
        const insertQuery: QueryString = `
            INSERT INTO profile_pictures
            ("user_id", "active", "filename", "extension", "file_location", "created", "modified")
            VALUES($1, $2, $3, $4, $5, $6, $7);
        `;

        const now: Date = new Date();
        const fileParts: IFileParts = this.fileService.splitFileAndExtension(fileLocation);
        const parameters: unknown[] = [
            userId, // $1: user_id
            true, // $2: active
            fileParts.filename, // $3: filename
            fileParts.extension, // $4: extension
            fileLocation, // $5: file_location
            now, // $6: created
            now // $7: modified
        ];
        await this.database.query(insertQuery, parameters);
    };
}