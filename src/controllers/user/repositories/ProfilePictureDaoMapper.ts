import { IProfilePicture } from "./../models/ProfilePicture";
import { IProfilePictureDao } from "./../daos/ProfilePictureDao";

export class ProfilePictureDaoMapper {
    public static toModel = (profilePictureDao: IProfilePictureDao): IProfilePicture => {
        return {
            id: profilePictureDao.id,
            userId: profilePictureDao.user_id,
            active: profilePictureDao.active,
            filename: profilePictureDao.filename,
            extension: profilePictureDao.extension,
            fileLocation: profilePictureDao.file_location,
            created: profilePictureDao.created,
            modified: profilePictureDao.modified
        };
    };
}