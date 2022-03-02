import { penv } from "../config/penv";
import { Database } from "../core/Database";

export const upgrade = async (database: Database): Promise<void> => {
    await database.query(`ALTER DATABASE ${penv.db.pgDb} SET search_path TO ${penv.db.pgSchema}`);
};