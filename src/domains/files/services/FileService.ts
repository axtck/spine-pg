import { Logger } from "../../../core/Logger";
import { Service } from "../../../core/Service";
import { injectable } from "inversify";
import { isOfEnum } from "../../../lib/utils/verification";
import fs from "fs/promises";
import sharp from "sharp";
import path from "path";
import { IFileParts } from "../../../core/types/FileParts";
import { ImageExtension } from "../../../core/types/ImageExtension";
import { IResizeDimensions } from "../../../core/types/ResizeDimensions";
import { Constants } from "../../../Constants";

@injectable()
export class FileService extends Service {
  constructor(logger: Logger) {
    super(logger);
  }

  public resizeAndOverwriteProfilePicture = async (
    inputFilePath: string,
    outputFilePath: string,
    dimensions: IResizeDimensions
  ): Promise<void> => {
    await sharp(inputFilePath)
      .resize(dimensions.width, dimensions.heigth) // resize image to width x height
      .jpeg({ quality: 90 }) // convert to jpeg
      .toFile(outputFilePath); // write to disk

    await fs.unlink(inputFilePath); // remove the old file from disk
  };

  public convertToPosixPath = (filePath: string): string => {
    const posixPath: string = filePath.split(path.sep).join(path.posix.sep); // split on seperator and join with /
    return posixPath;
  };

  public splitFileAndExtension = (filePath: string): IFileParts => {
    const file: string = this.getFileFromPosixPath(filePath); // full file name
    const parts: string[] = file.split("."); // split in 2
    const extension: string = `.${parts[1]}`; // add . to extension

    if (!isOfEnum<ImageExtension>(extension, Constants.imageExtensionEnumValues)) {
      throw new Error(`splitting file and extesion failed, invalid extension: ${parts[1]}`);
    }

    return {
      filenameWithExtension: file,
      filename: parts[0],
      extension: extension
    };
  };

  private getFileFromPosixPath = (filePath: string): string => {
    const splitted: string[] = filePath.split(path.posix.sep); // split on seperator
    const file: string = splitted[splitted.length - 1]; // grab last element
    return file;
  };
}
