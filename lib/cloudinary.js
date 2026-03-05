import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export async function uploadImage(file) {

  const result = await cloudinary.uploader.upload(file, {
    folder: "nutrisync"
  });

  return result.secure_url;
}