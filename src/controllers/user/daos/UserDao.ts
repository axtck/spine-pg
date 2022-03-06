import { IUserBaseDao } from "./UserBaseDao";

export interface IUserDao extends IUserBaseDao {
    roles: string[];
} 