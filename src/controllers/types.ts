import { Id } from "./../types";

export interface ILoginResponse {
    id: Id;
    username: string;
    email: string;
    roles: string[];
    accessToken: unknown;
}