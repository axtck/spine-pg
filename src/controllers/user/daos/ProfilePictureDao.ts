export interface IProfilePictureDao {
    id: number;
    user_id: number;
    active: boolean;
    filename: string;
    extension: string;
    file_location: string;
    created: Date;
    modified: Date;
}