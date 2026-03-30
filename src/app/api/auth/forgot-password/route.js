import { NextResponse } from "next/server";
import crypto from "crypto";
import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalised)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: normalised });

    if (user) {
      const token     = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      // ── 4. Save token to user doc ──────────────────────────────────────────
      user.resetPasswordToken   = token;
      user.resetPasswordExpires = expiresAt;
      await user.save();

      // ── 5. Send email via Resend ───────────────────────────────────────────
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

      await resend.emails.send({
        from:    "Comfort Service Apartment <onboarding@resend.dev>",
        to:      user.email,
        subject: "Reset your password – Comfort Service Apartment",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #C9A84C;">Reset Your Password</h2>
            <p>Hi there,</p>
            <p>We received a request to reset your password. Click the button below to choose a new one:</p>
            <a href="${resetUrl}"
              style="display: inline-block; margin: 16px 0; padding: 12px 24px;
                     background: #C9A84C; color: #000; text-decoration: none;
                     border-radius: 8px; font-weight: bold;">
              Reset Password
            </a>
            <p style="color: #888; font-size: 13px;">This link expires in <strong>1 hour</strong>.</p>
            <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    }

    // ── 6. Always return 200 (don't reveal if email exists) ──────────────────
    return NextResponse.json(
      { message: "If an account exists for that email, a reset link has been sent." },
      { status: 200 }
    );

  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}