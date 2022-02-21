import { Pool } from "pg";
import { penv } from "../../config/penv";

export const createPoolConnection = (): Pool => {
    // pool
    const pool: Pool = new Pool({
        host: penv.db.pgHost,
        port: penv.db.pgPort,
        user: penv.db.pgUser,
        password: penv.db.pgPw,
        database: penv.db.pgDb
    });
    return pool;
};

export const createPoolConnectionWithoutDatabase = (): Pool => {
    // pool without db
    const pool: Pool = new Pool({
        host: penv.db.pgHost,
        port: penv.db.pgPort,
        user: penv.db.pgUser,
        password: penv.db.pgPw
    });
    return pool;
};