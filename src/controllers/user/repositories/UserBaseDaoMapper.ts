import { IUserBase } from "./../models/UserBase";
import { IUserBaseDao } from "./../daos/UserBaseDao";

export class UserBaseDaoMapper {
    public static toModel = (userBaseDao: IUserBaseDao): IUserBase => {
        return {
            id: userBaseDao.id,
            username: userBaseDao.username,
            email: userBaseDao.email
        };
    };
}