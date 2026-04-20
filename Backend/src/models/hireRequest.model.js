import mongoose from "mongoose";

const hireRequestSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAgent",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  message: {
    type: String,
    trim: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export const HireRequest = mongoose.model("HireRequest", hireRequestSchema);
