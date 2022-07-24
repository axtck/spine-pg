import { Id } from "../../../../core/types/core";

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
