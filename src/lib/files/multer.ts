import { penv } from "./../../config/penv";
import multer, { Multer } from "multer";

// TODO: if wrong filetype => don't save to disk
// a multer upload for processing profile pictures
export const profilePicturesMulterUpload: Multer = multer({
    dest: penv.static.images.paths.profilePictures
});