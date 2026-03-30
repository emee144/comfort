import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    // Update password (your schema will hash it automatically)
    user.password = password;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );

  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}