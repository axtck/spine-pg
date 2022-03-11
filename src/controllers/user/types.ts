import { Id } from "./../../types";

export interface IUserCredentials {
    id: Id;
    username: string;
    email: string;
    password: string;
}

export enum UserRole {
    User = "user",
    Admin = "admin",
    Moderator = "moderator"
}

export interface IRole {
    id: Id;
    name: UserRole;
}