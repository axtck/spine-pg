export interface IUserBaseDao {
  id: number;
  username: string;
  email: string;
}

export interface IUserCredentialsDao extends IUserBaseDao {
  password: string;
}
