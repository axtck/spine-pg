import { IInsertProfilePictureData, IProfilePictureDao } from "./ProfilePictureDaos";
import { Id, Nullable, QueryString } from "../../../../core/types/core";
import { Database } from "../../../../core/Database";
import { Logger } from "../../../../core/Logger";
import { Repository } from "../../../../core/Repository";
import { injectable } from "inversify";
import { IProfilePicture } from "../models/ProfilePicture";
import { ProfilePictureDaosMapper } from "./ProfilePictureDaosMapper";

@injectable()
export class ProfilePictureRepository extends Repository {
  constructor(logger: Logger, database: Database) {
    super(logger, database);
  }
  public insertProfilePicture = async (insertData: IInsertProfilePictureData): Promise<void> => {
    const insertQuery: QueryString = `
      INSERT INTO profile_pictures
      ("user_id", "active", "filename", "extension", "file_location", "created", "modified")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
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

  public getOneByFileName = async (filename: string): Promise<Nullable<{ id: Id }>> => {
    const getQuery: QueryString = `
      SELECT id FROM profile_pictures
      WHERE filename = $1
    `;

    const picture: Nullable<{ id: Id }> = await this.database.queryOneOrDefault(getQuery, [filename]);
    return picture;
  };

  public getByUserId = async (userId: Id): Promise<IProfilePicture[]> => {
    const getQuery: QueryString = `
      SELECT id, user_id, active, filename, extension, file_location, created, modified 
      FROM profile_pictures
      WHERE user_id = $1
    `;

    const profilePictureDaos: IProfilePictureDao[] = await this.database.query(getQuery, [userId]);
    const profilePictures: IProfilePicture[] = profilePictureDaos.map(ProfilePictureDaosMapper.toModel);
    return profilePictures;
  };

  public getOneById = async (id: Id): Promise<Nullable<IProfilePicture>> => {
    const getQuery: QueryString = `
      SELECT id, user_id, active, filename, extension, file_location, created, modified
      FROM profile_pictures
      WHERE id = $1
    `;

    const profilePictureDao: Nullable<IProfilePictureDao> = await this.database.queryOneOrDefault(getQuery, [id]);
    if (!profilePictureDao) return null;
    const profilePicture: IProfilePicture = ProfilePictureDaosMapper.toModel(profilePictureDao);
    return profilePicture;
  };

  public getActiveForUser = async (userId: Id): Promise<Nullable<IProfilePicture>> => {
    const getQuery: QueryString = `
      SELECT id, user_id, active, filename, extension, file_location, created, modified
      FROM profile_pictures
      WHERE user_id = $1 and active = TRUE
    `;

    const profilePictureDao: Nullable<IProfilePictureDao> = await this.database.queryOneOrDefault(getQuery, [userId]);
    if (!profilePictureDao) return null;
    const profilePicture: IProfilePicture = ProfilePictureDaosMapper.toModel(profilePictureDao);
    return profilePicture;
  };
}
