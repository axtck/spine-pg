import { Constants } from "./../Constants";
require("dotenv").config();
import { Environment } from "./../types";

if (process.env.NODE_ENV && !Constants.environments.includes(process.env.NODE_ENV as Environment)) {
    throw new Error(`environment '${process.env.NODE_ENV}' invalid, possible environments: undefined (development) - development - test - staging - production`);
}

if (!process.env.JWT_AUTHKEY) throw new Error("no JWT authkey provided");

const environement: string = process.env.NODE_ENV || "development";
export const penv = {
    app: {
        port: Number(process.env.HOST_SERVER_PORT) || 3001,
        environment: environement
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
    }
};
