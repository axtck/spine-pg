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

    public async createUser(username: string, email: string, password: string): Promise<void> {
        const createUserQuery: QueryString = `
            INSERT INTO users 
            (username, email, password)
            VALUES ($1, $2, $3)  
        `;
        await this.database.query(createUserQuery, [username, email, password]);
    }

    public async createUserRole(userId: Id, roleId: Id): Promise<void> {
        const createUserRoleQuery: QueryString = `
            INSERT INTO user_roles 
            (user_id, role_id)
            VALUES ($1, $2)
        `;
        await this.database.query(createUserRoleQuery, [userId, roleId]);
    }

    public async getCreatedUserIdByUsername(username: string): Promise<Nullable<{ id: Id; }>> {
        const getUserIdQuery: QueryString = "SELECT id FROM users WHERE username = $1";
        const foundUser: Nullable<{ id: Id; }> = await this.database.queryOne(getUserIdQuery, [username]);
        return foundUser;
    }

    public async getRoleByName(role: string): Promise<Nullable<{ id: Id; }>> {
        const getRoleIdQuery: QueryString = "SELECT id FROM roles WHERE name = $1";
        const foundRole: Nullable<{ id: Id; }> = await this.database.queryOne(getRoleIdQuery, [role]);
        return foundRole;
    }

    public async getUserByUsername(username: string): Promise<Nullable<IUserCredentials>> {
        const getUserQuery: QueryString = "SELECT * FROM users WHERE username = $1";
        const user: Nullable<IUserCredentials> = await this.database.queryOne(getUserQuery, [username]);
        return user;
    }

    public async getBaseById(id: Id): Promise<Nullable<IUserBaseDao>> {
        const getBaseByIdQuery: QueryString = `
            SELECT
                id,
                username,
                email,
                password
            FROM users 
            WHERE id = $1
        `;

        const userBase: Nullable<IUserBaseDao> = await this.database.queryOne(getBaseByIdQuery, [id]);
        return userBase;
    }

    public async getUserRoleNamesByUserId(userId: Id): Promise<Array<{ name: string; }>> {
        const getUserRolesQuery: QueryString = `
            SELECT r.name 
            FROM user_roles ur
            INNER JOIN roles r ON r.id = ur.role_id
            WHERE ur.user_id = $1 
        `;
        const userRoles: Array<{ name: string; }> = await this.database.query(getUserRolesQuery, [userId]);
        return userRoles;
    }

    public async getUserIdByUsername(username: string): Promise<Nullable<{ id: Id; }>> {
        const getDuplicateQuery: QueryString = "SELECT id FROM users WHERE username = $1";
        const duplicateUserId: Nullable<{ id: Id; }> = await this.database.queryOne(getDuplicateQuery, [username]);
        return duplicateUserId;
    }

    public async getIdByEmail(email: string): Promise<Nullable<{ id: Id; }>> {
        const getDuplicateQuery: QueryString = "SELECT id FROM users WHERE email = $1";
        const duplicateUserId: Nullable<{ id: Id; }> = await this.database.queryOne(getDuplicateQuery, [email]);
        return duplicateUserId;
    }
}