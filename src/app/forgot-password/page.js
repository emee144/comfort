"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);

  const handleSubmit = async () => {
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M3 20c0-4 4-7 9-7s9 3 9 7" />
            </svg>
          </div>
          <h1 className="font-playfair text-2xl font-semibold text-white">
            Forgot <span className="text-[#C9A84C]">Password</span>
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase mt-2">
            Comfort Service Apartment
          </p>
        </div>

        {sent ? (
          /* ── Success State ── */
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <p className="text-white text-sm font-medium">Check your inbox</p>
            <p className="text-white/40 text-xs leading-relaxed">
              If an account exists for <span className="text-white/70">{email}</span>, a password reset link has been sent.
            </p>
            <a href="/login"
              className="block mt-6 text-[#C9A84C] text-[10px] tracking-widest uppercase hover:underline">
              ← Back to Login
            </a>
          </div>
        ) : (
          /* ── Form State ── */
          <div className="space-y-4">
            <p className="text-white/40 text-xs leading-relaxed text-center mb-6">
              Enter the email address linked to your account and we'll send you a reset link.
            </p>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-white/40 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#C9A84C] hover:bg-[#b8943e] disabled:opacity-50 text-black text-[11px] tracking-widest uppercase font-bold py-3.5 rounded-xl transition-colors cursor-pointer mt-2">
              {loading ? "Sending…" : "Send Reset Link"}
            </button>

            <a href="/login"
              className="block text-center text-white/30 text-[10px] tracking-widest uppercase hover:text-white/60 transition-colors mt-2">
              ← Back to Login
            </a>
          </div>
        )}

      </div>
    </div>
  );
}