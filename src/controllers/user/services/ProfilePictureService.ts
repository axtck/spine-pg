import { ProfilePictureDaoMapper } from "./../repositories/ProfilePictureDaoMapper";
import { IProfilePicture } from "./../models/ProfilePicture";
import { IProfilePictureDao } from "./../daos/ProfilePictureDao";
import { IFileParts, ImageExtension, IResizeDimensions } from "./../../../core/services/types";
import { FileService } from "../../../core/services/FileService";
import { Id, Nullable } from "./../../../types";
import { Logger } from "./../../../core/Logger";
import { ProfilePictureRepository } from "./../repositories/ProfilePictureRepository";
import { Service } from "../../../core/Service";
import { injectable } from "tsyringe";
import { IInsertProfilePictureData } from "../types";
import path from "path";
import { isOfEnum } from "../../../lib/utils/verification";
import { Constants } from "../../../core/services/Constants";

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
        const insertedPicture: Nullable<{ id: Id; }> = await this.profilePictureRepository.getOneByFileName(fileParts.filename);
        if (!insertedPicture?.id) throw new Error("finding inserted image failed");
        await this.profilePictureRepository.setActive(insertedPicture.id, userId);
    };

    public getByUserId = async (userId: Id): Promise<IProfilePicture[]> => {
        const profilePictureDaos: IProfilePictureDao[] = await this.profilePictureRepository.getByUserId(userId);
        const profilePictures: IProfilePicture[] = profilePictureDaos.map((dao) => ProfilePictureDaoMapper.toModel(dao));

        return profilePictures;
    };

    public getOneById = async (id: Id): Promise<Nullable<IProfilePicture>> => {
        const profilePictureDao: Nullable<IProfilePictureDao> = await this.profilePictureRepository.getOneById(id);
        if (!profilePictureDao) return null;

        const profilePictures: IProfilePicture = ProfilePictureDaoMapper.toModel(profilePictureDao);
        return profilePictures;
    };

    public getActiveForUser = async (userId: Id): Promise<Nullable<IProfilePicture>> => {
        const profilePictureDao: Nullable<IProfilePictureDao> = await this.profilePictureRepository.getActiveForUser(userId);
        if (!profilePictureDao) return null;

        const profilePictures: IProfilePicture = ProfilePictureDaoMapper.toModel(profilePictureDao);
        return profilePictures;
    };
}
