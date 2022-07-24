import { IUserCredentialsDao } from "../../../domains/user/info/repositories/UserDaos";

export const baseUsers: IUserCredentialsDao[] = [
  {
    id: 1,
    username: "user",
    email: "user@user.com",
    password: "user"
  }
];

export const dummyUser: IUserCredentialsDao = baseUsers[0];
