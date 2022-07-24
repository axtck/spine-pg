import { IProfilePicture } from "../models/ProfilePicture";
import { IInsertProfilePictureData } from "../repositories/ProfilePictureDaos";
import { FileService } from "../../../files/services/FileService";
import { Id, Nullable } from "../../../../core/types/core";
import { Logger } from "../../../../core/Logger";
import { ProfilePictureRepository } from "../repositories/ProfilePictureRepository";
import { Service } from "../../../../core/Service";
import { injectable } from "inversify";
import path from "path";
import { isOfEnum } from "../../../../lib/utils/verification";
import { IFileParts } from "../../../../core/types/FileParts";
import { ImageExtension } from "../../../../core/types/ImageExtension";
import { IResizeDimensions } from "../../../../core/types/ResizeDimensions";
import { Constants } from "../../../../Constants";

@injectable()
export class ProfilePictureService extends Service {
  private readonly profilePictureRepository: ProfilePictureRepository;
  private readonly fileService: FileService;

  constructor(logger: Logger, profilePictureRepository: ProfilePictureRepository, fileService: FileService) {
    super(logger);
    this.profilePictureRepository = profilePictureRepository;
    this.fileService = fileService;
  }

  public createProfilePicture = async (userId: Id, file: Express.Multer.File): Promise<void> => {
    // validate file
    const imageExtension: string = path.extname(file.originalname).toLowerCase();
    if (!isOfEnum<ImageExtension>(imageExtension, Constants.imageExtensionEnumValues)) {
      throw new Error(`bad filetype: ${imageExtension}`);
    }

    // process file
    const targetPath: string = `${this.fileService.convertToPosixPath(file.path)}.jpeg`; // force posix path and add extension
    const resizeDimensions: IResizeDimensions = {
      width: 180,
      heigth: 180
    };
    await this.fileService.resizeAndOverwriteProfilePicture(file.path, targetPath, resizeDimensions);

    // add record to database
    const fileParts: IFileParts = this.fileService.splitFileAndExtension(targetPath);
    const insertData: IInsertProfilePictureData = {
      userId: userId,
      active: true,
      filename: fileParts.filename,
      extension: fileParts.extension,
      fileLocation: targetPath,
      created: new Date(),
      modified: new Date()
    };

    await this.profilePictureRepository.insertProfilePicture(insertData);
    const insertedPicture: Nullable<{ id: Id }> = await this.profilePictureRepository.getOneByFileName(
      fileParts.filename
    );
    if (!insertedPicture?.id) throw new Error("finding inserted image failed");
    await this.profilePictureRepository.setActive(insertedPicture.id, userId);
  };

  public getByUserId = async (userId: Id): Promise<IProfilePicture[]> => {
    const profilePictures: IProfilePicture[] = await this.profilePictureRepository.getByUserId(userId);
    return profilePictures;
  };

  public getOneById = async (id: Id): Promise<Nullable<IProfilePicture>> => {
    const profilePicture: Nullable<IProfilePicture> = await this.profilePictureRepository.getOneById(id);
    return profilePicture;
  };

  public getActiveForUser = async (userId: Id): Promise<Nullable<IProfilePicture>> => {
    const profilePicture: Nullable<IProfilePicture> = await this.profilePictureRepository.getActiveForUser(userId);
    return profilePicture;
  };
}
