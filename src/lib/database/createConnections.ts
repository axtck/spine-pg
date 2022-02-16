import mysql, { Connection, Pool } from "mysql2/promise";
import { penv } from "../../config/penv";

export const createNoDatabaseSelectedConnection = async (): Promise<Connection> => {
    // don't specify database
    const connection: Connection = await mysql.createConnection({
        host: penv.db.mysqlHost,
        port: penv.db.mysqlPort,
        user: penv.db.mysqlUser,
        password: penv.db.mysqlPw
    });
    return connection;
};

export const createMultipleStatementsConnection = async (): Promise<Connection> => {
    // specify database and allow multiple statements for initialization
    const connection: Connection = await mysql.createConnection({
        host: penv.db.mysqlHost,
        port: penv.db.mysqlPort,
        user: penv.db.mysqlUser,
        password: penv.db.mysqlPw,
        database: penv.db.mysqlDb,
        multipleStatements: true
    });
    return connection;
};

export const createPoolConnection = (): Pool => {
    // pool
    const pool: Pool = mysql.createPool({
        host: penv.db.mysqlHost,
        port: penv.db.mysqlPort,
        user: penv.db.mysqlUser,
        password: penv.db.mysqlPw,
        database: penv.db.mysqlDb
    });
    return pool;
};