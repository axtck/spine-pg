import { Id } from "../../core/types/core";

export interface ILoginResponse {
  id: Id;
  username: string;
  email: string;
  accessToken: string;
}
