"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token");

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  // Guard: no token in URL
  useEffect(() => {
    if (!token) setError("Invalid or missing reset link.");
  }, [token]);

  const handleSubmit = async () => {
    setError("");
    if (!password || !confirm)  return setError("Please fill in both fields.");
    if (password.length < 6)    return setError("Password must be at least 6 characters.");
    if (password !== confirm)   return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
      setTimeout(() => router.push("/login"), 3000); // auto-redirect after 3s
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
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="font-playfair text-2xl font-semibold text-white">
            Reset <span className="text-[#C9A84C]">Password</span>
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase mt-2">
            Comfort Service Apartment
          </p>
        </div>

        {done ? (
          /* ── Success State ── */
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <p className="text-white text-sm font-medium">Password updated!</p>
            <p className="text-white/40 text-xs leading-relaxed">
              Your password has been reset successfully. Redirecting you to login…
            </p>
          </div>
        ) : (
          /* ── Form State ── */
          <div className="space-y-4">
            <p className="text-white/40 text-xs leading-relaxed text-center mb-6">
              Choose a strong new password for your account.
            </p>

            {/* New Password */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-white/40 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-white/40 mb-2">
                Confirm Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Repeat your password"
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
              disabled={loading || !token}
              className="w-full bg-[#C9A84C] hover:bg-[#b8943e] disabled:opacity-50 text-black text-[11px] tracking-widest uppercase font-bold py-3.5 rounded-xl transition-colors cursor-pointer mt-2">
              {loading ? "Updating…" : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}