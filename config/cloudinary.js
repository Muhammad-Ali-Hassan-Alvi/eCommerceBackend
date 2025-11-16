import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce/store/products",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 600, height: 600, crop: "limit" }],
  },
});

const upload = multer({ storage });
export { cloudinary, upload };
