import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		carType: {
			type: String,
			required: true,
			enum: [
				"Sedan",
				"SUV",
				"Sports",
				"Luxury",
				"Electric",
				"Hybrid",
				"Truck",
				"Van",
			],
		},
		company: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		userId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Text search indexes
carSchema.index({
	title: "text",
	description: "text",
	tags: "text",
});

export default mongoose.model("Car", carSchema);
