import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:   { type: String, required: true },
    email:  { type: String, required: true },
    phone:  { type: String, required: true },
    roomType: {
      type: String,
      enum: ["2-bedroom-upstairs", "2-bedroom-downstairs", "selfcontain"],
      required: true,
    },
    units:         { type: Number, required: true, default: 1 },
    checkIn:       { type: Date,   required: true },
    checkOut:      { type: Date,   required: true },
    amount:        { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "expired", "revoked"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["awaiting_confirmation", "confirmed", "rejected", "expired", "revoked"],
      default: "awaiting_confirmation",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);