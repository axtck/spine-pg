import { Id } from "./../../types";
import { Database } from "./../../core/Database";

export interface IMigrationFile {
    upgrade: (database: Database) => Promise<void>;
}

export interface IMigrationFileInfo {
    id: Id;
    name: string;
}

export enum CreationStatus {
    Created, Exists, Failed
}