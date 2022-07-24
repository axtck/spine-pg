import { Container } from "inversify";
import { AuthService } from "./domains/auth/AuthService";
import { ProfilePictureRepository } from "./domains/user/profile/repositories/ProfilePictureRepository";
import { UserRepository } from "./domains/user/info/repositories/UserRepository";
import { ProfilePictureService } from "./domains/user/profile/services/ProfilePictureService";
import { UserService } from "./domains/user/info/services/UserService";
import { Database } from "./core/Database";
import { Logger } from "./core/Logger";
import { FileService } from "./domains/files/services/FileService";
import { AuthJwtMiddleware } from "./middlewares/AuthJwtMiddleware";
import { VerifySignupMiddleware } from "./middlewares/VerifySignupMiddleware";

const container = new Container();
// core
container.bind(Logger).to(Logger);
container.bind(Database).to(Database);

// services
container.bind(UserService).to(UserService);
container.bind(AuthService).to(AuthService);
container.bind(ProfilePictureService).to(ProfilePictureService);
container.bind(FileService).to(FileService);

// repositories
container.bind(UserRepository).to(UserRepository);
container.bind(ProfilePictureRepository).to(ProfilePictureRepository);

// middlewares
container.bind(VerifySignupMiddleware).to(VerifySignupMiddleware);
container.bind(AuthJwtMiddleware).to(AuthJwtMiddleware);

export { container };
