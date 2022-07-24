import { Logger } from "../../../../core/Logger";
import { Id, Nullable } from "../../../../core/types/core";
import { UserRepository } from "../repositories/UserRepository";
import { Service } from "../../../../core/Service";
import { injectable } from "inversify";
import bcrypt from "bcryptjs";
import { IUserBase, IUserCredentials } from "../models/UserBase";

@injectable()
export class UserService extends Service {
  private readonly userRepository: UserRepository;

  constructor(logger: Logger, userRepository: UserRepository) {
    super(logger);
    this.userRepository = userRepository;
  }

  public createUser = async (username: string, email: string, password: string): Promise<void> => {
    const hashedPassword: string = bcrypt.hashSync(password, 8); // hash the password using bcrypt
    await this.userRepository.insertUser(username, email, hashedPassword);
  };

  public getBaseById = async (id: Id): Promise<Nullable<IUserBase>> => {
    const userBase: Nullable<IUserBase> = await this.userRepository.selectBaseById(id);
    return userBase;
  };

  public getCredentialsByUsername = async (username: string): Promise<Nullable<IUserCredentials>> => {
    const user: Nullable<IUserCredentials> = await this.userRepository.selectCredentialsByUsername(username);
    return user;
  };

  public isDuplicateUsername = async (username: string): Promise<boolean> => {
    const duplicateUserId: Nullable<{ id: Id }> = await this.userRepository.selectUserIdByUsername(username);
    return !!duplicateUserId;
  };

  public isDuplicateEmail = async (email: string): Promise<Nullable<boolean>> => {
    const duplicateUserId: Nullable<{ id: Id }> = await this.userRepository.selectIdByEmail(email);
    return !!duplicateUserId;
  };
}
