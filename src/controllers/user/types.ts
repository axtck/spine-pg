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

export interface IInsertProfilePictureData {
    userId: Id;
    active: boolean;
    filename: string;
    extension: string;
    fileLocation: string;
    created: Date;
    modified: Date;
}