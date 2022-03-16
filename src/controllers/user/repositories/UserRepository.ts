import { Database } from "../../../core/Database";
import { IUserCredentials } from "../types";
import { QueryString } from "../../../types";
import { Id, Nullable } from "../../../types";
import { Repository } from "../../../core/Repository";
import { injectable } from "tsyringe";
import { Logger } from "../../../core/Logger";
import { IUserBaseDao } from "../daos/UserBaseDao";

@injectable()
export class UserRepository extends Repository {
    constructor(logger: Logger, database: Database) {
        super(logger, database);
    }

    public insertUser = async (username: string, email: string, password: string): Promise<void> => {
        const insertUserQuery: QueryString = `
            INSERT INTO users 
            (username, email, password)
            VALUES ($1, $2, $3)  
        `;
        await this.database.query(insertUserQuery, [username, email, password]);
    };

    public insertUserRole = async (userId: Id, roleId: Id): Promise<void> => {
        const insertUserRoleQuery: QueryString = `
            INSERT INTO user_roles 
            (user_id, role_id)
            VALUES ($1, $2)
        `;
        await this.database.query(insertUserRoleQuery, [userId, roleId]);
    };

    public selectCreatedUserIdByUsername = async (username: string): Promise<Nullable<{ id: Id; }>> => {
        const selectUserIdQuery: QueryString = "SELECT id FROM users WHERE username = $1";
        const foundUser: Nullable<{ id: Id; }> = await this.database.queryOne(selectUserIdQuery, [username]);
        return foundUser;
    };

    public selectRoleByName = async (role: string): Promise<Nullable<{ id: Id; }>> => {
        const selectRoleIdQuery: QueryString = "SELECT id FROM roles WHERE name = $1";
        const foundRole: Nullable<{ id: Id; }> = await this.database.queryOne(selectRoleIdQuery, [role]);
        return foundRole;
    };

    public selectUserByUsername = async (username: string): Promise<Nullable<IUserCredentials>> => {
        const selectUserQuery: QueryString = "SELECT * FROM users WHERE username = $1";
        const user: Nullable<IUserCredentials> = await this.database.queryOne(selectUserQuery, [username]);
        return user;
    };

    public selectBaseById = async (id: Id): Promise<Nullable<IUserBaseDao>> => {
        const selectBaseByIdQuery: QueryString = `
            SELECT
                id,
                username,
                email,
                password
            FROM users 
            WHERE id = $1
        `;

        const userBase: Nullable<IUserBaseDao> = await this.database.queryOne(selectBaseByIdQuery, [id]);
        return userBase;
    };

    public selectUserRoleNamesByUserId = async (userId: Id): Promise<Array<{ name: string; }>> => {
        const selectUserRolesQuery: QueryString = `
            SELECT r.name 
            FROM user_roles ur
            INNER JOIN roles r ON r.id = ur.role_id
            WHERE ur.user_id = $1 
        `;
        const userRoles: Array<{ name: string; }> = await this.database.query(selectUserRolesQuery, [userId]);
        return userRoles;
    };

    public selectUserIdByUsername = async (username: string): Promise<Nullable<{ id: Id; }>> => {
        const selectDuplicateQuery: QueryString = "SELECT id FROM users WHERE username = $1";
        const duplicateUserId: Nullable<{ id: Id; }> = await this.database.queryOne(selectDuplicateQuery, [username]);
        return duplicateUserId;
    };

    public selectIdByEmail = async (email: string): Promise<Nullable<{ id: Id; }>> => {
        const selectDuplicateQuery: QueryString = "SELECT id FROM users WHERE email = $1";
        const duplicateUserId: Nullable<{ id: Id; }> = await this.database.queryOne(selectDuplicateQuery, [email]);
        return duplicateUserId;
    };
}