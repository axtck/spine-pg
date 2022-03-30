import dotenv from "dotenv";
import { isOfEnum } from "../lib/utils/verification";
import { Environment } from "../types";
import { Constants } from "./../Constants";
dotenv.config();

if (!isOfEnum(process.env.NODE_ENV, Constants.environmentEnumValues)) {
    throw new Error(`environment '${process.env.NODE_ENV}' invalid, possible environments: undefined (development) - development - test - staging - production`);
}

if (!process.env.JWT_AUTHKEY) throw new Error("no JWT authkey provided");
if (!process.env.PROFILE_PICTURES_PATH) throw new Error("no profile pictures path provided");

// TODO: has to be Environment enum
const environement: Environment = process.env.NODE_ENV || Environment.Development;
export const penv = {
    app: {
        port: Number(process.env.HOST_SERVER_PORT) || 3001,
        environment: environement
    },
    cors: {
        origin: process.env.CORS_ALLOW_ORIGIN
    },
    db: {
        pgHost: process.env.PG_HOST,
        pgPort: Number(process.env.PG_PORT) || undefined,
        pgDb: `${environement}db`,
        pgUser: process.env.PG_USER,
        pgPw: process.env.PG_PASSWORD,
        pgSchema: "spine" // static name for initializing (if change => also change in database/createInitialTables.sql)
    },
    auth: {
        jwtAuthkey: process.env.JWT_AUTHKEY
    },
    static: {
        images: {
            paths: {
                profilePictures: environement === Environment.Development ? "tmp/images" : process.env.PROFILE_PICTURES_PATH
            }
        }
    }
};
