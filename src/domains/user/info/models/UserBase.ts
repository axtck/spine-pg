import { Id } from "../../../../core/types/core";

export interface IUserBase {
  id: Id;
  username: string;
  email: string;
}

export interface IUserCredentials extends IUserBase {
  password: string;
}
