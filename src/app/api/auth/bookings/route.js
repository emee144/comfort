import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    let bookings;
    if (user.isAdmin === true || user.role === "admin") {
      bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    } else {
      bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    }
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("GET /api/auth/bookings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const { name, phone, roomType, checkIn, checkOut, guests, amount, transferReference } = body;

    if (!name || !phone || !roomType || !checkIn || !checkOut || !guests || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now          = new Date();
    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Strip time — compare dates only
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const checkInMidnight = new Date(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());

    if (checkInMidnight < todayMidnight) {
      return NextResponse.json({ error: "Check-in date cannot be in the past" }, { status: 400 });
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "Check-out date must be after check-in date" }, { status: 400 });
    }

    const booking = await Booking.create({
      userId:            user._id,
      name,
      phone,
      roomType,
      checkIn:           checkInDate,
      checkOut:          checkOutDate,
      guests,
      amount,
      transferReference: transferReference || "",
      paymentStatus:     "pending",
      status:            "awaiting_confirmation",
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("POST /api/auth/bookings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.isAdmin !== true && user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { bookingId, action } = await req.json();
    if (!bookingId || !["confirm", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const update =
      action === "confirm"
        ? { paymentStatus: "confirmed", status: "confirmed" }
        : { paymentStatus: "rejected", status: "rejected" };
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(bookingId, update, { new: true });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ booking });
  } catch (err) {
    console.error("PATCH /api/auth/bookings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}