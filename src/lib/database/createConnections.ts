import { Client, Pool } from "pg";
import { penv } from "../../config/penv";

export const createNoDatabaseSelectedClient = (): Client => {
    // don't specify database
    const client: Client = new Client({
        host: penv.db.pgHost,
        port: penv.db.pgPort,
        user: penv.db.pgUser,
        password: penv.db.pgPw
    });
    return client;
};

export const createMultipleStatementsClient = (): Client => {
    // specify database and allow multiple statements for initialization
    const client: Client = new Client({
        host: penv.db.pgHost,
        port: penv.db.pgPort,
        user: penv.db.pgUser,
        password: penv.db.pgPw,
        database: penv.db.pgDb
    });
    return client;
};

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