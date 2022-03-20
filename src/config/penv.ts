import dotenv from "dotenv";
import { Constants } from "./../Constants";
dotenv.config();

if (process.env.NODE_ENV && !Constants.environmentStringValues.includes(process.env.NODE_ENV)) {
    throw new Error(`environment '${process.env.NODE_ENV}' invalid, possible environments: undefined (development) - development - test - staging - production`);
}

if (!process.env.JWT_AUTHKEY) throw new Error("no JWT authkey provided");
if (!process.env.PROFILE_PICTURES_PATH) throw new Error("no static images path provided");

const environement: string = process.env.NODE_ENV || "development";
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
                profilePictures: process.env.PROFILE_PICTURES_PATH
            }
        }
    }
};
