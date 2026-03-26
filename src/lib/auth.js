import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("access_token")?.value;

    if (!token) return null;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set");
      return null;
    }

    // Decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return null;
    }

    if (!decoded?.id) return null;

    await connectDB();

    const user = await User.findById(decoded.id).lean();
    if (!user) return null;

    return {
      ...user,
      isAdmin: user.isAdmin === true || user.role === "admin",
    };
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    return null;
  }
}