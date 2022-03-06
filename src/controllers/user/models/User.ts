import { UserRole } from "./../types";
import { IUserBase } from "./UserBase";

export interface IUser extends IUserBase {
    roles: UserRole[];
}