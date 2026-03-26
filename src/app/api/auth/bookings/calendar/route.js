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

    const bookings = await Booking.find({
      status: { $in: ["confirmed", "awaiting_confirmation"] }
    }).select("checkIn checkOut roomType units");

    return NextResponse.json({ bookings });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}