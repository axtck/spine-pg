import { Environment, UserRole } from "./types";
// constants
export class Constants {
    static readonly logLevels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    };

    static readonly logColors = {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
        debug: "cyan"
    };

    static readonly userRoles: UserRole[] = [
        UserRole.User, UserRole.Admin, UserRole.Moderator
    ];

    static readonly environments: Environment[] = [
        Environment.Development, Environment.Test, Environment.Staging, Environment.Production
    ];
}