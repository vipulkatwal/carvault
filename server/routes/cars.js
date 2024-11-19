import express from "express";
import asyncHandler from "express-async-handler";
import Car from "../models/Car.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

// Middleware to extract user ID from Authorization header
const getUserId = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: "No authorization header" });
	}

	// For demo user
	if (authHeader === "Bearer demo-token") {
		req.userId = "demo-user";
		return next();
	}

	// For actual Clerk users
	req.userId = authHeader.split(" ")[1];
	next();
};

router.use(getUserId);

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const cars = await Car.find({ userId: req.userId });
		res.json(cars);
	})
);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const car = await Car.findOne({ _id: req.params.id, userId: req.userId });
		if (!car) {
			return res.status(404).json({ message: "Car not found" });
		}
		res.json(car);
	})
);

router.post(
	"/",
	asyncHandler(async (req, res) => {
		try {
			const { images, ...carData } = req.body;

			// Upload images to Cloudinary
			const uploadedImages = await Promise.all(
				images.map((image) => uploadToCloudinary(image))
			);

			const car = await Car.create({
				...carData,
				images: uploadedImages,
				userId: req.userId,
			});

			res.status(201).json(car);
		} catch (error) {
			console.error("Error creating car:", error);
			res
				.status(500)
				.json({ message: "Failed to create car", error: error.message });
		}
	})
);

router.put(
	"/:id",
	asyncHandler(async (req, res) => {
		const car = await Car.findOne({ _id: req.params.id, userId: req.userId });
		if (!car) {
			return res.status(404).json({ message: "Car not found" });
		}

		const { images, ...updateData } = req.body;

		if (images) {
			const uploadedImages = await Promise.all(
				images.map((image) => {
					if (image.startsWith("data:")) {
						return uploadToCloudinary(image);
					}
					return image;
				})
			);
			updateData.images = uploadedImages;
		}

		const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		res.json(updatedCar);
	})
);

router.delete(
	"/:id",
	asyncHandler(async (req, res) => {
		const car = await Car.findOneAndDelete({
			_id: req.params.id,
			userId: req.userId,
		});
		if (!car) {
			return res.status(404).json({ message: "Car not found" });
		}
		res.json({ message: "Car deleted successfully" });
	})
);

router.get(
	"/search",
	asyncHandler(async (req, res) => {
		const { q } = req.query;
		const cars = await Car.find({
			userId: req.userId,
			$text: { $search: q },
		});
		res.json(cars);
	})
);

export default router;
