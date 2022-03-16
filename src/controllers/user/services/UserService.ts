import { Logger } from "../../../core/Logger";
import { IUserCredentials } from "../types";
import { Id, Nullable } from "../../../types";
import { UserRepository } from "../repositories/UserRepository";
import { Service } from "../../../core/Service";
import { injectable } from "tsyringe";
import bcrypt from "bcryptjs";
import { IUserBaseDao } from "../daos/UserBaseDao";
import { IUserBase } from "../models/UserBase";
import { UserBaseDaoMapper } from "../repositories/UserBaseDaoMapper";

@injectable()
export class UserService extends Service {
    private readonly userRepository: UserRepository;

    constructor(logger: Logger, userRepository: UserRepository) {
        super(logger);
        this.userRepository = userRepository;
    }

    public createUser = async (username: string, email: string, password: string): Promise<void> => {
        const hashedPassword: string = bcrypt.hashSync(password, 8); // hash the password using bcrypt
        await this.userRepository.insertUser(username, email, hashedPassword);
    };

    public getBaseById = async (id: Id): Promise<Nullable<IUserBase>> => {
        const userBaseDao: Nullable<IUserBaseDao> = await this.userRepository.selectBaseById(id);
        if (!userBaseDao) return null;

        const userBase: IUserBase = UserBaseDaoMapper.toModel(userBaseDao);
        return userBase;
    };

    public assignRoles = async (username: string, roles: Nullable<string[]>): Promise<void> => {
        // get created user
        const createdUserId: Nullable<{ id: Id; }> = await this.userRepository.selectCreatedUserIdByUsername(username);
        if (!createdUserId) throw new Error(`finding created user '${username}' failed`);

        // assign roles
        if (roles) {
            for (const r of roles) {
                const role: Nullable<{ id: Id; }> = await this.userRepository.selectRoleByName(r);
                if (!role) throw new Error("finding role failed");
                await this.userRepository.insertUserRole(createdUserId.id, role.id);
            }
        } else {
            await this.userRepository.insertUserRole(createdUserId.id, 1); // assign 'user' role 
        }
    };

    public getUserByUsername = async (username: string): Promise<Nullable<IUserCredentials>> => {
        const user: Nullable<IUserCredentials> = await this.userRepository.selectUserByUsername(username);
        return user;
    };

    public getUserRoleNames = async (userId: Id): Promise<string[]> => {
        const userRoles: Array<{ name: string; }> = await this.userRepository.selectUserRoleNamesByUserId(userId);
        if (!userRoles || !userRoles.length) throw new Error(`no roles found for user with id '${userId}'`);
        const roleNames: string[] = userRoles.map(r => r.name);
        return roleNames;
    };

    public getDuplicateUsernameId = async (username: string): Promise<Nullable<{ id: Id; }>> => {
        const duplicateUserId: Nullable<{ id: Id; }> = await this.userRepository.selectUserIdByUsername(username);
        return duplicateUserId;
    };

    public getDuplicateEmailId = async (email: string): Promise<Nullable<{ id: Id; }>> => {
        const duplicateUserId: Nullable<{ id: Id; }> = await this.userRepository.selectIdByEmail(email);
        return duplicateUserId;
    };
}