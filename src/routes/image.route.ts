import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as Controller from "@controllers";

export const imageRoute = Router();
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (_, file) => {
    return {
      folder: "joyhubserver",
      format: "jpeg",
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

imageRoute.post(
  "/upload",
  uploadMiddleware.single("image"),
  Controller.ImageController.getInstance().uploadImage
);
