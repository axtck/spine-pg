import { Id } from "./../../../types";

export interface IProfilePicture {
    id: Id;
    userId: Id;
    active: boolean;
    filename: string;
    extension: string;
    fileLocation: string;
    created: Date;
    modified: Date;
}