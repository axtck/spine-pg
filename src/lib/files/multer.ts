import { penv } from "./../../config/penv";
import multer, { Multer } from "multer";

// a multer upload for processing profile pictures
export const profilePicturesMulterUpload: Multer = multer({
    dest: penv.static.images.paths.profilePictures
});