import { Nullable } from "./../../types";
import { Logger } from "../../core/Logger";
import { Id } from "../../types";
import { Service } from "../../core/Service";
import { injectable } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@injectable()
export class AuthService extends Service {
    constructor(logger: Logger) {
        super(logger);
    }

    public validatePassword = (passwordToValidate: string, passwordToCompareTo: string): boolean => {
        // compare the input passwords with the existing password using bcrypt
        const passwordIsValid: boolean = bcrypt.compareSync(
            passwordToValidate,
            passwordToCompareTo
        );
        return passwordIsValid;
    };

    public signToken = (userId: Id, jwtAuthKey: string | undefined): unknown => {
        if (!jwtAuthKey) throw new Error("no JWT Authkey provided");
        // sign a token that expires in 6hrs 
        const oneDayInS = 60 * 60 * 6;
        const token = jwt.sign({ id: userId }, jwtAuthKey, {
            expiresIn: oneDayInS
        });
        return token;
    };

    public validateEmailFormat = (email: string): boolean => {
        const emailRegex: RegExp = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        const valid: Nullable<RegExpMatchArray> = email.toLowerCase().match(emailRegex);
        if (!valid) return false;
        return true;
    };

    public validatePasswordFormat = (password: string): boolean => {
        const passwordRegex: RegExp = new RegExp(/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);
        const valid: Nullable<RegExpMatchArray> = password.match(passwordRegex);
        if (!valid) return false;
        return true;
    };
}