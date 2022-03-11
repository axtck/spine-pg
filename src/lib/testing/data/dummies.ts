import { IUserCredentials } from "../../../controllers/user/types";
import { IRole, UserRole } from "../../../controllers/user/types";

export const userRoles: IRole[] = [
    {
        id: 1,
        name: UserRole.User
    },
    {
        id: 2,
        name: UserRole.Admin
    },
    {
        id: 3,
        name: UserRole.Moderator
    }
];

export const dummyUserRole: IRole = userRoles[0];
export const dummyAdminRole: IRole = userRoles[1];
export const dummyModeratorRole: IRole = userRoles[2];

export const baseUsers: IUserCredentials[] = [
    {
        id: 1,
        username: UserRole.User,
        email: "user@user.com",
        password: "user"
    },
    {
        id: 2,
        username: UserRole.Admin,
        email: "admin@admin.com",
        password: "admin"
    },
    {
        id: 3,
        username: UserRole.Moderator,
        email: "moderator@moderator.com",
        password: "moderator"
    }
];

export const dummyUser: IUserCredentials = baseUsers[0];
export const dummyAdmin: IUserCredentials = baseUsers[1];
export const dummyModerator: IUserCredentials = baseUsers[2];