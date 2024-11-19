// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import carRoutes from "./routes/cars.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Car Management API",
			version: "1.0.0",
			description: "API documentation for Car Management application",
		},
		servers: [
			{
				url: `http://localhost:${PORT}`,
			},
		],
	},
	apis: ["./server/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173", // Add your client URL
		credentials: true,
	})
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({ status: "OK" });
});

// API Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Add clerk middleware error handling
const clerkMiddleware = (req, res, next) => {
	ClerkExpressWithAuth()(req, res, (err) => {
		if (err) {
			console.error("Clerk authentication error:", err);
			return res.status(401).json({ message: "Authentication failed" });
		}
		next();
	});
};

// Protected Routes with Clerk SDK
app.use("/api/cars", clerkMiddleware, carRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
	console.error("Error:", err);

	if (err.name === "ValidationError") {
		return res.status(400).json({
			message: "Validation Error",
			errors: Object.values(err.errors).map((e) => e.message),
		});
	}

	if (err.name === "MongoError" || err.name === "MongoServerError") {
		return res.status(500).json({
			message: "Database Error",
			error:
				process.env.NODE_ENV === "development"
					? err.message
					: "Internal Server Error",
		});
	}

	// Default error response
	res.status(err.status || 500).json({
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Internal Server Error",
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
});

// Database connection with proper error handling
const connectDB = async () => {
	try {
		const mongoURI =
			process.env.MONGODB_URI || "mongodb://localhost:27017/car-management";
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

// Start server only after DB connection
connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
			console.log(
				`Swagger docs available at http://localhost:${PORT}/api/docs`
			);
		});
	})
	.catch((err) => {
		console.error("Failed to start server:", err);
		process.exit(1);
	});
