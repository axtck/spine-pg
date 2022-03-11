import { Constants } from "./../../../Constants";
import { UserRole } from "./../types";
import { IUserDao } from "./../daos/UserDao";
import { IUser } from "../models/User";

export class UserDaoMapper {
    public static toModel(userDao: IUserDao): IUser {
        if (!this.isRoles(userDao.roles)) throw new Error(`invalid roles '${userDao.roles.join(", ")}' for user with id '${userDao.id}'`);

        return {
            id: userDao.id,
            username: userDao.username,
            email: userDao.email,
            roles: userDao.roles
        };
    }

    private static isRoles(roles: string[]): roles is UserRole[] {
        for (const role of roles) {
            if (!Constants.userRoles.includes(role as UserRole)) return false;
        }

        return true;
    }
}