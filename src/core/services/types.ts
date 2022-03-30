export interface IResizeDimensions {
    width: number;
    heigth: number;
}

export enum ImageExtension {
    JPG = ".jpg",
    JPEG = ".jpeg",
    PNG = ".png"
}

export interface IFileParts {
    filenameWithExtension: string;
    filename: string;
    extension: ImageExtension;
}