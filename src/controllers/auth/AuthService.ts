import { Logger } from "./../../core/Logger";
import { Id, IUser, Nullable } from "../../types";
import { AuthRepository } from "./AuthRepository";
import { Service } from "../../core/Service";
import { injectable } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@injectable()
export class AuthService extends Service {
    private readonly authRepository: AuthRepository;

    constructor(logger: Logger, authRepository: AuthRepository) {
        super(logger);
        this.authRepository = authRepository;
    }

    public async createUser(username: string, email: string, password: string): Promise<void> {
        const hashedPassword: string = bcrypt.hashSync(password, 8); // hash the password using bcrypt
        await this.authRepository.createUser(username, email, hashedPassword);
    }

    public async assignRoles(username: string, roles: Nullable<string[]>): Promise<void> {
        // get created user
        const createdUserId: Nullable<{ id: Id; }> = await this.authRepository.getCreatedUserIdByUsername(username);
        if (!createdUserId) throw new Error(`finding created user '${username}' failed`);

        // assign roles
        if (roles) {
            for (const r of roles) {
                const role: Nullable<{ id: Id; }> = await this.authRepository.getRoleByName(r);
                if (!role) throw new Error("finding role failed");
                await this.authRepository.createUserRole(createdUserId.id, role.id);
            }
        } else {
            await this.authRepository.createUserRole(createdUserId.id, 1); // assign 'user' role 
        }
    }

    public async getUserByUsername(username: string): Promise<Nullable<IUser>> {
        const user: Nullable<IUser> = await this.authRepository.getUserByUsername(username);
        return user;
    }

    public validatePassword(passwordToValidate: string, passwordToCompareTo: string): boolean {
        // compare the input passwords with the existing password using bcrypt
        const passwordIsValid: boolean = bcrypt.compareSync(
            passwordToValidate,
            passwordToCompareTo
        );
        return passwordIsValid;
    }

    public signToken(userId: Id, jwtAuthKey: string | undefined): unknown {
        if (!jwtAuthKey) throw new Error("no JWT Authkey provided");
        // sign a token that expires in 1 day
        const oneDayInS = 60 * 60 * 24;
        const token = jwt.sign({ id: userId }, jwtAuthKey, {
            expiresIn: oneDayInS
        });
        return token;
    }

    public async getUserRoleNames(userId: Id): Promise<string[]> {
        const userRoles: Array<{ name: string; }> = await this.authRepository.getUserRoleNamesByUserId(userId);
        if (!userRoles || !userRoles.length) throw new Error(`no roles found for user with id '${userId}'`);
        const roleNames: string[] = userRoles.map(r => r.name);
        return roleNames;
    }

    public async getDuplicateUsernameId(username: string): Promise<Nullable<{ id: Id; }>> {
        const duplicateUserId: Nullable<{ id: Id; }> = await this.authRepository.getUserIdByUsername(username);
        return duplicateUserId;
    }

    public async getDuplicateEmailId(email: string): Promise<Nullable<{ id: Id; }>> {
        const duplicateUserId: Nullable<{ id: Id; }> = await this.authRepository.getIdByEmail(email);
        return duplicateUserId;
    }
}