import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let bookings;
    if (user.role === "admin") {
      bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    } else {
      bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("GET /bookings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, phone, roomType, checkIn, checkOut, guests, amount, transferReference } = body;

    if (!name || !phone || !roomType || !checkIn || !checkOut || !guests || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await Booking.create({
      userId:            user._id,
      name,
      phone,
      roomType,
      checkIn:           new Date(checkIn),
      checkOut:          new Date(checkOut),
      guests,
      amount,
      transferReference: transferReference || "",
      paymentStatus:     "pending",
      status:            "awaiting_confirmation",
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("POST /bookings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { bookingId, action } = body;

    if (!bookingId || !["confirm", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const update =
      action === "confirm"
        ? { paymentStatus: "confirmed", status: "confirmed" }
        : { paymentStatus: "rejected", status: "rejected" };

    const booking = await Booking.findByIdAndUpdate(bookingId, update, { new: true }).lean();
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("PATCH /bookings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}