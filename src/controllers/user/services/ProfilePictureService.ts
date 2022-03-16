import { Id } from "./../../../types";
import { Logger } from "./../../../core/Logger";
import { ProfilePictureRepository } from "./../repositories/ProfilePictureRepository";
import { Service } from "../../../core/Service";
import { injectable } from "tsyringe";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

@injectable()
export class ProfilePictureService extends Service {
    private readonly profilePictureRepository: ProfilePictureRepository;

    constructor(logger: Logger, profilePictureRepository: ProfilePictureRepository) {
        super(logger);
        this.profilePictureRepository = profilePictureRepository;
    }

    public createProfilePicture = async (userId: Id, file: Express.Multer.File): Promise<void> => {
        // TODO: add more validation & clean up
        if (path.extname(file.originalname).toLowerCase() !== ".jpg") {
            throw new Error("bad file type");
        }

        const targetPath = `${file.path}-pp-${userId}.jpeg`;

        await this.resizeAndSaveProfilePicture(file.path, targetPath); // process
        await fs.unlink(file.path); // remove the old file from disk
        await this.profilePictureRepository.insertProfilePicture(userId, targetPath); // add db record
    };

    private resizeAndSaveProfilePicture = async (inputFilePath: string, outputFilePath: string): Promise<void> => {
        await sharp(inputFilePath)
            .resize(180, 180) // resize image to 180 x 180
            .jpeg({ quality: 90 }) // convert to jpeg
            .toFile(outputFilePath); // write to disk
    };
}
