import { UserRole } from "./controllers/user/types";
import { Environment } from "./types";
export class Constants {
    public static readonly logLevels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    };

    public static readonly logColors = {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
        debug: "cyan"
    };

    public static readonly userRoles: UserRole[] = Object.values(UserRole);
    public static readonly environments: Environment[] = Object.values(Environment);
}