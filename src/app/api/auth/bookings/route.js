import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

const BOOKING_HOLD_MINUTES = 15;

// ================= GET =================
export async function GET(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    await Booking.updateMany(
      {
        paymentStatus: "pending",
        createdAt: { $lt: new Date(now - BOOKING_HOLD_MINUTES * 60 * 1000) },
      },
      {
        status: "expired",
        paymentStatus: "expired",
      }
    );

    const bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ bookings });

  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ================= POST =================
export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, phone, roomType, units, checkIn, checkOut, amount } = body;

    if (!name || !phone || !roomType || !checkIn || !checkOut || !amount || !units) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const checkInMidnight = new Date(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());

    if (checkInMidnight < today) {
      return NextResponse.json({ error: "Check-in cannot be in the past" }, { status: 400 });
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }

    const bookedBookings = await Booking.find({
      roomType,
      status: { $in: ["confirmed", "awaiting_confirmation"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).lean();

    const dayUnits = {};
    for (let d = new Date(checkInDate); d < checkOutDate; d.setDate(d.getDate() + 1)) {
      dayUnits[d.toDateString()] = 0;
    }

    bookedBookings.forEach(b => {
      for (let d = new Date(b.checkIn); d < b.checkOut; d.setDate(d.getDate() + 1)) {
        const key = d.toDateString();
        if (dayUnits[key] !== undefined) {
          dayUnits[key] += b.units || 1;
        }
      }
    });

    const TOTAL_UNITS = { "2-bedroom": 4, selfcontain: 1 };

    for (const dateStr in dayUnits) {
      if ((dayUnits[dateStr] + units) > TOTAL_UNITS[roomType]) {
        return NextResponse.json({
          error: `Not enough ${roomType === "2-bedroom" ? "2 Bedroom" : "Self Contain"} units available for ${dateStr}`
        }, { status: 409 });
      }
    }

    const booking = await Booking.create({
      userId: user._id,
      name,
      phone,
      email: user.email || "",
      roomType,
      units,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      amount,
      paymentStatus: "pending",
      status: "awaiting_confirmation",
    });

    return NextResponse.json({ booking }, { status: 201 });

  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}