export type Id = number;
export type QueryString = string;
export type Nullable<T> = T | null;

export enum HttpMethod {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
}

export enum Environment {
    Development = "development",
    Test = "test",
    Staging = "staging",
    Production = "production"
}
