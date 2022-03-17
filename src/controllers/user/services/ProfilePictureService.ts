import { IResizeDimensions } from "./../../../core/services/types";
import { FileService } from "../../../core/services/FileService";
import { Id } from "./../../../types";
import { Logger } from "./../../../core/Logger";
import { ProfilePictureRepository } from "./../repositories/ProfilePictureRepository";
import { Service } from "../../../core/Service";
import { injectable } from "tsyringe";
import path from "path";

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
        if (!this.fileService.isImageExtension(imageExtension)) {
            throw new Error(`bad filetype: ${imageExtension}`);
        }

        // config 
        const targetPath: string = `${this.fileService.convertToPosixPath(file.path)}.jpeg`; // force posix path and add extension
        const resizeDimensions: IResizeDimensions = {
            width: 180,
            heigth: 180
        };

        // process file and add record to database
        await this.fileService.resizeAndOverwriteProfilePicture(file.path, targetPath, resizeDimensions);
        await this.profilePictureRepository.insertProfilePicture(userId, targetPath);
    };
}
