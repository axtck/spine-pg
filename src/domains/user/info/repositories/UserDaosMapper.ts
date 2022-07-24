import { IUserBase, IUserCredentials } from "../models/UserBase";
import { IUserBaseDao, IUserCredentialsDao } from "./UserDaos";

export class UserDaosMapper {
  public static toUserBase = (userBaseDao: IUserBaseDao): IUserBase => {
    return {
      id: userBaseDao.id,
      username: userBaseDao.username,
      email: userBaseDao.email
    };
  };

  public static toUserCredentials = (userCredentialsDao: IUserCredentialsDao): IUserCredentials => {
    return {
      id: userCredentialsDao.id,
      username: userCredentialsDao.username,
      email: userCredentialsDao.email,
      password: userCredentialsDao.password
    };
  };
}
