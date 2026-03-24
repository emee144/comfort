import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

// GET all bookings
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("GET bookings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH - confirm or reject booking
export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, action } = await req.json();

    if (!bookingId || !["confirm", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const newStatus = action === "confirm" ? "confirmed" : "rejected";

    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: newStatus, 
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("PATCH booking error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}