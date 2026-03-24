import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:              { type: String, required: true },
    phone:             { type: String, required: true },
    roomType:          { type: String, enum: ["2-bedroom", "selfcontain"], required: true },
    checkIn:           { type: Date,   required: true },
    checkOut:          { type: Date,   required: true },
    guests:            { type: Number, required: true, default: 1 },
    amount:            { type: Number, required: true },
    transferReference: { type: String, default: "" },
    paymentStatus:     { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
    status:            { type: String, enum: ["awaiting_confirmation", "confirmed", "rejected"], default: "awaiting_confirmation" },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);