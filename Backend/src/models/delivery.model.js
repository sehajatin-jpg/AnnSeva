// models/delivery.model.js
import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    foodDonation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodDonation",
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: function () {
        return this.phase === "Collection";
      },
    },
    phase: {
      type: String,
      enum: ["Collection", "Distribution", "Waste"], // 🆕
      required: true,
    },
    pickup: String,
    destination: String,

    // KEY: status machine
    status: {
      type: String,
      enum: [
        "Assigned", // created by NGO, waiting for agent decision
        "Rejected", // agent declined (NGO must reassign or cancel)
        "Accepted", // agent accepted but not started
        "In-Transit", // agent started the trip
        "Delivered", // success
        "Cancelled", // cancelled by NGO/admin
      ],
      default: "Assigned",
    },

    // Optional metadata
    rejectionReason: { type: String },

    // Timestamps for transitions
    acceptedAt: Date,
    rejectedAt: Date,
    startedAt: Date,
    deliveredAt: Date,

    // Only meaningful once in-transit
    estimatedTime: {
      type: Date,
      required: function () {
        return this.status === "In-Transit";
      },
    },
  },
  { timestamps: true },
);

export const Delivery = mongoose.model("Delivery", deliverySchema);
