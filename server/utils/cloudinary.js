import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (base64Image) => {
	try {
		const result = await cloudinary.uploader.upload(base64Image, {
			resource_type: "auto",
			folder: "car-management",
		});
		return result.secure_url;
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		throw new Error("Failed to upload image");
	}
};
