import { Logger } from "../../core/Logger";
import { Id } from "../../types";
import { UserRepository } from "../user/repositories/UserRepository";
import { Service } from "../../core/Service";
import { injectable } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@injectable()
export class AuthService extends Service {
    private readonly userRepository: UserRepository;

    constructor(logger: Logger, userRepository: UserRepository) {
        super(logger);
        this.userRepository = userRepository;
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
        // sign a token that expires in 6hrs 
        const oneDayInS = 60 * 60 * 6;
        const token = jwt.sign({ id: userId }, jwtAuthKey, {
            expiresIn: oneDayInS
        });
        return token;
    }
}