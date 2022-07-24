import { Id } from "../../../../core/types/core";

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

export interface IInsertProfilePictureData {
  userId: Id;
  active: boolean;
  filename: string;
  extension: string;
  fileLocation: string;
  created: Date;
  modified: Date;
}
