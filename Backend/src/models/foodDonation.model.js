import mongoose from "mongoose";

const foodDonationSchema = new mongoose.Schema(
  {
    foodType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be atleast 1"],
    },
    status: {
      type: String,
      enum: [
        "Awaiting Collection",
        "Collected by NGO",

        "Quality Check Pending", // 🆕
        "Approved for Distribution", // 🆕
        "Rejected - Waste", // 🆕

        "Out for Distribution", // 🆕
        "Distributed to Needy",

        "Sent to Biodegradable System", // 🆕
      ],
      default: "Awaiting Collection",
    },
    pickupAddress: {
      type: String,
    },
    destinationAddress: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    collectionAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
      required: function () {
        return (
          this.status === "Collected by NGO" ||
          this.status === "Distributed to Needy"
        );
      },
    },
    distributionAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
      required: function () {
        return this.status === "Distributed to Needy";
      },
    },
    qualityStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    qualityCheckedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
    },

    qualityCheckedAt: Date,

    wasteDestination: {
      type: String, // e.g. "Compost Plant - Delhi"
    },

    wasteAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
    },
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
      },
    ],
  },
  { timestamps: true },
);

export const FoodDonation = mongoose.model("FoodDonation", foodDonationSchema);
