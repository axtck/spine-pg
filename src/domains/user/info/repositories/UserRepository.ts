import { Database } from "../../../../core/Database";
import { QueryString } from "../../../../core/types/core";
import { Id, Nullable } from "../../../../core/types/core";
import { Repository } from "../../../../core/Repository";
import { injectable } from "inversify";
import { Logger } from "../../../../core/Logger";
import { IUserBaseDao, IUserCredentialsDao } from "./UserDaos";
import { UserDaosMapper } from "./UserDaosMapper";
import { IUserBase, IUserCredentials } from "../models/UserBase";

@injectable()
export class UserRepository extends Repository {
  constructor(logger: Logger, database: Database) {
    super(logger, database);
  }

  public insertUser = async (username: string, email: string, password: string): Promise<void> => {
    const insertUserQuery: QueryString = `
      INSERT INTO users 
      (username, email, password)
      VALUES ($1, $2, $3)  
    `;
    await this.database.query(insertUserQuery, [username, email, password]);
  };

  public selectCredentialsByUsername = async (username: string): Promise<Nullable<IUserCredentials>> => {
    const selectUserQuery: QueryString = "SELECT id, username, email, password FROM users WHERE username = $1";
    const userCredentialsDao: Nullable<IUserCredentialsDao> = await this.database.queryOneOrDefault(selectUserQuery, [
      username
    ]);
    if (!userCredentialsDao) return null;
    const userCredentials: IUserCredentials = UserDaosMapper.toUserCredentials(userCredentialsDao);
    return userCredentials;
  };

  public selectBaseById = async (id: Id): Promise<Nullable<IUserBase>> => {
    const selectBaseByIdQuery: QueryString = "SELECT id, username, email FROM users WHERE id = $1";
    const userBaseDao: Nullable<IUserBaseDao> = await this.database.queryOneOrDefault(selectBaseByIdQuery, [id]);
    if (!userBaseDao) return null;
    const userBase: IUserBase = UserDaosMapper.toUserBase(userBaseDao);
    return userBase;
  };

  public selectUserIdByUsername = async (username: string): Promise<Nullable<{ id: Id }>> => {
    const selectDuplicateQuery: QueryString = "SELECT id FROM users WHERE username = $1";
    const duplicateUserId: Nullable<{ id: Id }> = await this.database.queryOneOrDefault(selectDuplicateQuery, [
      username
    ]);
    return duplicateUserId;
  };

  public selectIdByEmail = async (email: string): Promise<Nullable<{ id: Id }>> => {
    const selectDuplicateQuery: QueryString = "SELECT id FROM users WHERE email = $1";
    const duplicateUserId: Nullable<{ id: Id }> = await this.database.queryOneOrDefault(selectDuplicateQuery, [email]);
    return duplicateUserId;
  };
}
