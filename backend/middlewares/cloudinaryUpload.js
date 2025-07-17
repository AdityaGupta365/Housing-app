import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "housing-app", // optional folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const upload = multer({ storage });
