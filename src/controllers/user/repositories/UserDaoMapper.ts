import { Constants } from "./../../../Constants";
import { UserRole } from "./../types";
import { IUserDao } from "./../daos/UserDao";
import { IUser } from "../models/User";
import { isOfEnumArray } from "../../../lib/utils/verification";

export class UserDaoMapper {
    public static toModel = (userDao: IUserDao): IUser => {
        if (!isOfEnumArray<UserRole>(userDao.roles, Constants.userRoleEnumValues)) {
            throw new Error(`invalid roles '${userDao.roles.join(", ")}' for user with id '${userDao.id}'`);
        }

        return {
            id: userDao.id,
            username: userDao.username,
            email: userDao.email,
            roles: userDao.roles
        };
    };
}