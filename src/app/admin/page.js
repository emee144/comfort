"use client";
import { useState, useEffect } from "react";

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const nights = (ci, co) => {
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));
};

const STATUS_MAP = {
  awaiting_confirmation: { label: "Awaiting",     cls: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
  confirmed:             { label: "Confirmed ✓",  cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  rejected:              { label: "Rejected",      cls: "bg-red-500/15 text-red-400 border border-red-500/30" },
};

const Pill = ({ status }) => {
  const s = STATUS_MAP[status] || { label: status, cls: "bg-white/10 text-white/40" };
  return (
    <span className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
};

function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [show, setShow]         = useState(false);

  const handleSubmit = async () => {
    if (!password) return setError("Please enter the admin password.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Wrong password");
      onUnlock();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="font-playfair text-2xl font-semibold text-white">
            Admin <span className="text-[#C9A84C]">Access</span>
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase mt-2">
            Comfort Service Apartment
          </p>
        </div>

        <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-7 space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/40 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter admin password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
              <button
                onClick={() => setShow((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {show ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#C9A84C] hover:bg-[#b8943e] disabled:opacity-50 text-black text-[11px] tracking-widest uppercase font-bold py-3.5 rounded-xl transition-colors cursor-pointer">
            {loading ? "Verifying…" : "Enter Admin Panel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ booking, action, onConfirm, onCancel, loading }) {
  const isConfirm = action === "confirm";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-md p-8">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-5
          ${isConfirm ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
          {isConfirm ? "✓" : "✕"}
        </div>
        <h3 className="font-playfair text-lg font-semibold text-white text-center mb-2">
          {isConfirm ? "Confirm Payment" : "Reject Booking"}
        </h3>
        <p className="text-white/60 text-sm text-center leading-relaxed mb-6">
          {isConfirm
            ? `Confirm payment for ${booking.name}? They will be able to print their receipt.`
            : `Reject the booking for ${booking.name}? This will free up the dates.`}
        </p>
        <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-6 space-y-2 text-sm">
          {[
            ["Guest",  booking.name],
            ["Room",   booking.roomType === "2-bedroom" ? "2 Bedroom" : "Self Contain"],
            ["Dates",  `${fmt(booking.checkIn)} → ${fmt(booking.checkOut)}`],
            ["Amount", `₦${Number(booking.amount).toLocaleString()}`],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className="text-white/50">{l}</span>
              <span className={`font-semibold ${l === "Amount" ? "text-[#C9A84C]" : "text-white"}`}>{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 border border-white/10 hover:border-white/20 text-white text-[11px] tracking-widest uppercase py-3 rounded-xl transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`flex-1 text-[11px] tracking-widest uppercase font-bold py-3 rounded-xl transition-colors disabled:opacity-50
              ${isConfirm
                ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                : "bg-red-500/80 hover:bg-red-500 text-white"}`}>
            {loading ? "Processing…" : isConfirm ? "Yes, Confirm" : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const n = nights(booking.checkIn, booking.checkOut);

  return (
    <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl overflow-hidden">
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-playfair font-semibold text-sm shrink-0">
            {booking.name?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">{booking.name}</span>
              <Pill status={booking.status} />
            </div>
            <div className="text-white/50 text-xs">
              {booking.roomType === "2-bedroom" ? "2 Bedroom" : "Self Contain"} · {fmt(booking.checkIn)} → {fmt(booking.checkOut)} · {n} night(s)
            </div>
            <div className="text-[#C9A84C] text-sm font-semibold">
              ₦{Number(booking.amount).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {booking.status === "awaiting_confirmation" && (
            <>
              <button onClick={() => onAction(booking, "confirm")}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-xl transition-colors">
                Confirm
              </button>
              <button onClick={() => onAction(booking, "reject")}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-xl transition-colors">
                Reject
              </button>
            </>
          )}
          {booking.status === "confirmed" && (
            <button onClick={() => onAction(booking, "reject")}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-xl transition-colors">
              Revoke
            </button>
          )}
          {booking.status === "rejected" && (
            <button onClick={() => onAction(booking, "confirm")}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-xl transition-colors">
              Restore
            </button>
          )}
          <button onClick={() => setExpanded((p) => !p)}
            className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {expanded ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/5 px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Phone",     booking.phone],
            ["Email",     booking.email || "—"],
            ["Units",     booking.units ?? "—"],
            ["Submitted", fmt(booking.createdAt)],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">{l}</div>
              <div className="text-white text-sm font-medium">{v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsBar({ bookings }) {
  const total     = bookings.length;
  const awaiting  = bookings.filter((b) => b.status === "awaiting_confirmation").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const revenue   = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + Number(b.amount), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: "Total Bookings", value: total,                          color: "text-white" },
        { label: "Awaiting",       value: awaiting,                       color: "text-amber-400" },
        { label: "Confirmed",      value: confirmed,                      color: "text-emerald-400" },
        { label: "Revenue",        value: `₦${revenue.toLocaleString()}`, color: "text-[#C9A84C]" },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-5">
          <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">{label}</div>
          <div className={`text-2xl font-playfair font-semibold ${color}`}>{value}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked]     = useState(false);
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [modal, setModal]           = useState(null);
  const [acting, setActing]         = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin/bookings");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("Non-JSON response:", res.status);
        setBookings([]);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        console.error("API error:", data.error);
        setBookings([]);
        return;
      }
      setBookings(data.bookings || []);
    } catch (e) {
      console.error("fetchBookings error:", e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unlocked) fetchBookings();
  }, [unlocked]);

  const handleConfirmAction = async () => {
    setActing(true);
    try {
      const res = await fetch("/api/auth/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: modal.booking._id,
          action:    modal.action,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await fetchBookings();
      showToast(
        modal.action === "confirm"
          ? `Payment confirmed for ${modal.booking.name}`
          : `Booking rejected for ${modal.booking.name}`,
        modal.action === "confirm" ? "success" : "error"
      );
      setModal(null);
    } catch (e) {
      showToast("Something went wrong. Try again.", "error");
    } finally {
      setActing(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (e) {
      setLoggingOut(false);
    }
  };

  const filtered = bookings
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) =>
      !search ||
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search)
    );

  const FILTERS = [
    { key: "all",                   label: "All" },
    { key: "awaiting_confirmation", label: "Awaiting" },
    { key: "confirmed",             label: "Confirmed" },
    { key: "rejected",              label: "Rejected" },
  ];

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {toast && (
        <div className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl border
          ${toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {toast.msg}
        </div>
      )}

      <div className="border-b border-white/5 px-8 md:px-16 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-lg font-semibold text-white">
            Admin <span className="text-[#C9A84C]">Panel</span>
          </h1>
          <p className="text-white/50 text-[11px] tracking-wide mt-0.5">
            Comfort Service Apartment · Booking Management
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 hover:border-white/40 disabled:opacity-50 transition-all font-medium cursor-pointer">
          {loggingOut ? (
            <>
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
              <span>Signing out…</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>

      <div className="px-8 md:px-16 py-10 max-w-5xl mx-auto">

        {!loading && <StatsBar bookings={bookings} />}

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-[#0f0f0f] border border-white/8 rounded-xl p-1">
            {FILTERS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg transition-colors
                  ${filter === key
                    ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30"
                    : "text-white/60 hover:text-white"}`}>
                {label}
                <span className="ml-1.5 text-[9px] opacity-60">
                  {key === "all"
                    ? bookings.length
                    : bookings.filter((b) => b.status === key).length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone…"
              className="w-full bg-[#0f0f0f] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            />
          </div>

          <button onClick={fetchBookings}
            className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-xl transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24 text-white/30 text-sm tracking-widest uppercase">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-white/50 text-sm">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .slice()
              .sort((a, b) => {
                const order = { awaiting_confirmation: 0, confirmed: 1, rejected: 2 };
                return (order[a.status] ?? 3) - (order[b.status] ?? 3);
              })
              .map((b) => (
                <BookingCard key={b._id} booking={b} onAction={(booking, action) => setModal({ booking, action })} />
              ))}
          </div>
        )}
      </div>

      {modal && (
        <ConfirmModal
          booking={modal.booking}
          action={modal.action}
          loading={acting}
          onConfirm={handleConfirmAction}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}