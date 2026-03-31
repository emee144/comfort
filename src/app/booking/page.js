"use client";

import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import dynamic from "next/dynamic";

const BookingPicture = dynamic(() => import("../components/BookingPicture"), {
  ssr: false,
  loading: () => null, 
});
const RATES = { "2-bedroom-upstairs": 120000, "2-bedroom-downstairs": 100000, selfcontain: 50000 };
const TOTAL_UNITS = { "2-bedroom-upstairs": 2, "2-bedroom-downstairs": 2, selfcontain: 1 };

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const nights = (checkIn, checkOut) =>
  checkIn && checkOut ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 0;

// Get total booked units per day for a room type
const getBookedUnitsPerDay = (bookings, roomType) => {
  const map = {};
  bookings
    .filter(b => b.roomType === roomType)
    .forEach(b => {
      let d = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      while (d < end) {
        const key = d.toDateString();
        map[key] = (map[key] || 0) + (b.units || 1);
        d.setDate(d.getDate() + 1);
      }
    });
  return map;
};

const isDateFullyBooked = (date, roomType, bookings, requestedUnits = 1) => {
  if (!roomType) return false;
  const map = getBookedUnitsPerDay(bookings, roomType);
  const key = date.toDateString();
  return (map[key] || 0) + requestedUnits > TOTAL_UNITS[roomType];
};

const isRangeAvailable = (start, end, roomType, bookings, requestedUnits = 1) => {
  if (!start || !end || !roomType) return true;
  let d = new Date(start);
  while (d < end) {
    if (isDateFullyBooked(d, roomType, bookings, requestedUnits)) return false;
    d.setDate(d.getDate() + 1);
  }
  return true;
};

const statusPill = (status) => {
  let bg = "", text = "";
  switch (status) {
    case "awaiting_confirmation": bg = "bg-yellow-500/20"; text = "Awaiting"; break;
    case "confirmed": bg = "bg-green-500/20"; text = "Confirmed"; break;
    case "rejected": bg = "bg-red-500/20"; text = "Rejected"; break;
    default: bg = "bg-gray-500/20"; text = status;
  }
  return (
    <span className={`${bg} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
      {text}
    </span>
  );
};

function Receipt({ booking, onClose }) {
  const ref = useRef();

  const handlePrint = () => {
    const content = ref.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Booking Receipt — Comfort Service Apartment</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lato:wght@300;400&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Lato', sans-serif; background: #fff; color: #111; padding: 60px; }
            .receipt { max-width: 680px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #C9A84C; padding-bottom: 24px; margin-bottom: 32px; }
            .brand { font-family: 'Playfair Display', serif; font-size: 26px; }
            .gold { color: #C9A84C; }
            .subtitle { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #666; margin-top: 6px; }
            .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; padding: 4px 14px; border-radius: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 12px; }
            .section-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 12px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
            .row:last-child { border: none; }
            .label { color: #666; }
            .total-box { background: #fffbf0; border: 1px solid #e8d5a0; border-radius: 8px; padding: 16px; margin-top: 16px; }
            .footer { text-align: center; font-size: 11px; color: #aaa; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-8 text-white" ref={ref}>
          <div className="receipt">
            <div className="text-center border-b border-[#C9A84C]/40 pb-6 mb-8">
              <div className="font-playfair text-2xl font-semibold">
                Comfort <span style={{ color: "#C9A84C" }}>Service Apartment</span>
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 mt-2">Official Booking Receipt</div>
              <div className="mt-3">
                <span className="text-[10px] tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Payment Confirmed ✓
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-3">Guest Information</div>
              {[["Name", booking.name], ["Phone", booking.phone]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-white/5 text-sm">
                  <span className="text-white/50">{l}</span>
                  <span className="font-medium text-white">{v}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-3">Stay Details</div>
              {[
                ["Room Type", ROOM_LABELS[booking.roomType]],
                ["Units", booking.units],
                ["Check-in", fmt(booking.checkIn)],
                ["Check-out", fmt(booking.checkOut)],
                ["Duration", `${nights(booking.checkIn, booking.checkOut)} night(s)`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-white/5 text-sm">
                  <span className="text-white/50">{l}</span>
                  <span className="font-medium text-white">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Total Amount Paid</span>
                <span className="text-[#C9A84C] text-xl font-semibold">₦{Number(booking.amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-white/20 mt-6 border-t border-white/5 pt-4">
              Receipt generated on {new Date().toLocaleString()} · Comfort Service Apartment
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button onClick={handlePrint}
            className="flex-1 bg-[#C9A84C] hover:bg-[#b8943e] text-black text-[11px] tracking-widest uppercase font-semibold py-3 rounded-xl transition-colors">
            Print Receipt
          </button>
          <button onClick={onClose}
            className="px-6 border border-white/10 hover:border-white/20 text-white/60 text-[11px] tracking-widest uppercase rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const ROOM_LABELS = {
  "2-bedroom-upstairs": "2 Bedroom Upstairs",
  "2-bedroom-downstairs": "2 Bedroom Downstairs",
  selfcontain: "Self Contain",
};

function BookingForm({ onBooked }) {
  const today = new Date();
  const [step, setStep] = useState(1);
  const [publicBookings, setPublicBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [form, setForm] = useState({
    name: "", phone: "", roomType: "", units: 1, checkIn: null, checkOut: null,
  });
  const [error, setError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");

  // Fetch availability on mount
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/auth/bookings/calendar");
      const data = await res.json();
      setPublicBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  fetchBookings();
}, []);

useEffect(() => {
  const fetchUserBookings = async () => {
    try {
      const res = await fetch("/api/auth/bookings", { credentials: "include" });
      const data = await res.json();
      setUserBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch user bookings", err);
    }
  };

  fetchUserBookings();
}, []);

  const setField = (k) => (e) => {
  const value = e.target ? e.target.value : e;
  setForm(p => ({ ...p, [k]: k === "units" ? Number(value) : value }));
};

  const n = nights(form.checkIn, form.checkOut);
  const rate = RATES[form.roomType] || 0;
  const amount = n * rate * (Number(form.units) || 1);

  const checkAvailability = () => {
    if (!form.checkIn || !form.checkOut || !form.roomType) return true;
    if (!isRangeAvailable(form.checkIn, form.checkOut, form.roomType, publicBookings, Number(form.units))) {
      setAvailabilityError("Selected dates are not available for the units requested.");
      return false;
    }
    setAvailabilityError("");
    return true;
  };

  const handleNextToPayment = () => {
    if (!form.name || !form.phone || !form.roomType || !form.units || !form.checkIn || !form.checkOut) {
      return setError("Please fill all fields.");
    }
    if (!checkAvailability()) return;
    setError("");
    setStep(2);
  };

  const handleNextToConfirm = () => {
    setError("");
    setStep(3);
  };

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 || data.error?.toLowerCase().includes("units") || data.error?.toLowerCase().includes("available")) {
          setStep(1);
          setAvailabilityError(data.error);
        } else {
          setError(data.error || "Booking failed");
        }
        return;
      }
      onBooked?.();
      setForm({ name: "", phone: "", roomType: "", units: 1, checkIn: null, checkOut: null });
      setStep(1);
    } catch (e) {
      setError(e.message);
    }
  };

  // Get fully blocked dates for check-in picker
  const getBlockedCheckInDates = () => {
    if (!form.roomType) return [];
    const map = getBookedUnitsPerDay(publicBookings, form.roomType);
    return Object.entries(map)
      .filter(([, count]) => count + Number(form.units) > TOTAL_UNITS[form.roomType])
      .map(([dateStr]) => new Date(dateStr));
  };

  // Get unavailable checkout dates given a selected check-in
  const getBlockedCheckOutDates = () => {
    if (!form.checkIn || !form.roomType) return [];
    const unavailable = [];
    const maxCheck = new Date(form.checkIn);
    maxCheck.setMonth(maxCheck.getMonth() + 12);
    for (let d = new Date(form.checkIn); d <= maxCheck; d.setDate(d.getDate() + 1)) {
      if (!isRangeAvailable(form.checkIn, d, form.roomType, publicBookings, Number(form.units))) {
        unavailable.push(new Date(d));
      }
    }
    return unavailable;
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all
            ${step === s
              ? "bg-[#C9A84C] border-[#C9A84C] text-black"
              : step > s
              ? "bg-[#C9A84C]/20 border-[#C9A84C]/40 text-[#C9A84C]"
              : "bg-white/5 border-white/10 text-white/30"}`}>
            {step > s ? "✓" : s}
          </div>
          <span className={`text-[10px] tracking-widest uppercase hidden md:inline
            ${step === s ? "text-[#C9A84C]" : step > s ? "text-[#C9A84C]/60" : "text-white/20"}`}>
            {s === 1 ? "Booking Details" : s === 2 ? "Payment" : "Confirm"}
          </span>
          {s < 3 && <div className={`w-8 h-px mx-1 ${step > s ? "bg-[#C9A84C]/40" : "bg-white/10"}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-4 md:p-8 max-w-4xl mx-auto space-y-5">
      <h2 className="font-playfair text-xl font-semibold text-white mb-2">
        New <span className="text-[#C9A84C]">Booking</span>
      </h2>

      <StepIndicator />

      {/* ── STEP 1: Booking Details ── */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] text-white/50 mb-1">Full Name</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={form.name} onChange={setField("name")} />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 mb-1">Phone Number</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                 value={form.phone} onChange={setField("phone")} />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 mb-1">Room Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={form.roomType} onChange={setField("roomType")}>
                <option value="">Select a room</option>
<option value="2-bedroom-upstairs">2 Bedroom Upstairs — ₦120,000/night</option>
<option value="2-bedroom-downstairs">2 Bedroom Downstairs — ₦100,000/night</option>
<option value="selfcontain">Self Contain — ₦50,000/night</option>
              </select>
            </div>
            {form.roomType && (
              <div>
                <label className="block text-[10px] text-white/50 mb-1">Units</label>
                <input type="number" min={1} max={TOTAL_UNITS[form.roomType]} value={form.units}
                  onChange={setField("units")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
              </div>
            )}
            <div>
              <label className="block text-[10px] text-white/50 mb-1">Check-in</label>
              <DatePicker
                selected={form.checkIn}
                onChange={(d) => setForm(p => ({ ...p, checkIn: d, checkOut: null }))}
                minDate={today}
                placeholderText="Select check-in"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                excludeDates={getBlockedCheckInDates()}
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 mb-1">Check-out</label>
              <DatePicker
                selected={form.checkOut}
                onChange={(d) => setForm(p => ({ ...p, checkOut: d }))}
                minDate={form.checkIn ? new Date(new Date(form.checkIn).getTime() + 86400000) : today}
                placeholderText="Select check-out"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                excludeDates={getBlockedCheckOutDates()}
              />
            </div>
          </div>

          {availabilityError && <p className="text-red-400 text-xs">{availabilityError}</p>}
          {error && <p className="text-red-400 text-xs">{error}</p>}

          {amount > 0 && !availabilityError && (
            <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-4 flex justify-between items-center">
              <span className="text-white/40 text-[10px]">Total Amount</span>
              <span className="text-[#C9A84C] font-semibold">₦{amount.toLocaleString()}</span>
            </div>
          )}

          {/* Unavailable dates summary */}
          {form.roomType && (() => {
            const blocked = getBlockedCheckInDates();
            if (!blocked.length) return null;
            return (
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4">
                <p className="text-red-400 text-[10px] uppercase mb-2">Unavailable Dates</p>
                <div className="flex flex-wrap gap-1">
                  {blocked.map((date, i) => (
                    <span key={i} className="text-red-500 text-[11px] bg-red-100/10 border border-red-500/20 rounded-lg px-2 py-1">
                      {fmt(date)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          <button onClick={handleNextToPayment}
            className="w-full bg-[#C9A84C] hover:bg-[#b8943e] text-black text-[11px] font-bold py-4 rounded-xl mt-2">
            Continue to Payment →
          </button>
        </>
      )}

      {/* ── STEP 2: Payment Info ── */}
      {step === 2 && (
        <>
          <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-5 space-y-3 mb-2">
            <p className="text-[10px] tracking-widest uppercase text-[#C9A84C] mb-3">Transfer Details</p>
            {[
              ["Bank", "GT Bank"],
              ["Account Name", "Haastrup Oludotun Bolatito"],
              ["Account Number", "0448971134"],
              ["Amount to Pay", `₦${amount.toLocaleString()}`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm border-b border-white/5 pb-2">
                <span className="text-white/40">{l}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-xs leading-relaxed">
            Please transfer the exact amount above to the account details provided, then click the button below once your transfer is complete.
          </p>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex flex-col md:flex-row gap-3">
            <button onClick={() => { setStep(1); setError(""); }}
              className="flex-1 border border-white/10 hover:border-white/20 text-white/60 text-[11px] tracking-widest uppercase py-4 rounded-xl transition-colors">
              ← Back
            </button>
            <button onClick={handleNextToConfirm}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-4 rounded-xl tracking-widest uppercase transition-colors cursor-pointer">
              ✓ I Have Made the Transfer
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3: Confirm & Submit ── */}
      {step === 3 && (
        <>
          <div className="space-y-3">
            <p className="text-[10px] tracking-widest uppercase text-white/30 mb-3">Booking Summary</p>
            {[
              ["Name", form.name],
              ["Phone", form.phone],
              ["Room Type", ROOM_LABELS[form.roomType]],
              ["Units", form.units],
              ["Check-in", fmt(form.checkIn)],
              ["Check-out", fmt(form.checkOut)],
              ["Duration", `${n} night(s)`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm border-b border-white/5 pb-2">
                <span className="text-white/40">{l}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <span className="text-white/40 text-sm">Total Amount</span>
              <span className="text-[#C9A84C] text-lg font-semibold">₦{amount.toLocaleString()}</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => { setStep(2); setError(""); }}
              className="flex-1 border border-white/10 hover:border-white/20 text-white/60 text-[11px] tracking-widest uppercase py-4 rounded-xl transition-colors cursor-pointer">
              ← Back
            </button>
            <button onClick={handleSubmit}
              className="flex-1 bg-[#C9A84C] hover:bg-[#b8943e] text-black text-[11px] font-bold py-4 rounded-xl cursor-pointer">
              Confirm Booking ✓
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [receipt, setReceipt] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/bookings", {
        credentials: "include",
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
const fetchUser = async () => {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    if (res.status === 401) {
      // wait 500ms and retry once before giving up
      await new Promise(r => setTimeout(r, 500));
      const retry = await fetch("/api/auth/me", { credentials: "include" });
      if (retry.status === 401) {
        window.location.href = "/login";
        return;
      }
      const retryData = await retry.json();
      if (retryData.user) setUser(retryData.user);
      return;
    }

    const data = await res.json();
    if (data.user) setUser(data.user);
  } catch (e) {
    console.error(e);
  }
};
  useEffect(() => { fetchBookings(); fetchUser(); }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/5 px-4 md:px-16 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-lg font-semibold text-white">
            Welcome, <span className="text-[#C9A84C]">
  {user?.email ? user.email : "..."}
</span>
          </h1>
          <p className="text-white/40 text-[11px] tracking-wide mt-0.5">Manage your bookings and reservations</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["bookings", "new"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg transition-colors cursor-pointer
                ${activeTab === t
                  ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30"
                  : "text-white/50 hover:text-white border border-transparent hover:border-white/10"}`}>
              {t === "new" ? "+ New Booking" : "My Bookings"}
            </button>
          ))}

          <div className="h-5 w-px bg-white/10 mx-1" />

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 hover:border-white/40 disabled:opacity-50 transition-all duration-200 font-medium cursor-pointer">
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
      </div>

      <div className="px-4 md:px-16 py-8 md:py-10 max-w-5xl mx-auto">
       {activeTab === "new" && (
  <div className="space-y-8">
    {/* Apartment pictures */}
    <BookingPicture />

    {/* Booking form */}
    <BookingForm
      onBooked={() => {
        fetchBookings();
        setActiveTab("bookings");
      }}
    />
  </div> 
)}

        {activeTab === "bookings" && (
          <div>
            {loading ? (
              <div className="text-center py-20 text-white/30 text-sm tracking-widest uppercase">Loading…</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🏠</div>
                <p className="text-white/40 text-sm">No bookings yet.</p>
                <button onClick={() => setActiveTab("new")}
                  className="mt-4 text-[#C9A84C] text-[10px] tracking-widest uppercase hover:underline">
                  Make your first booking →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-white">{b.name}</span>
                        {statusPill(b.status)}
                      </div>
                      <div className="text-white/40 text-xs">
                        {ROOM_LABELS[b.roomType]} · {fmt(b.checkIn)} → {fmt(b.checkOut)} · {nights(b.checkIn, b.checkOut)} night(s) · {b.units} unit{b.units > 1 ? "s" : ""}
                      </div>
                      <div className="text-[#C9A84C] text-sm font-semibold">₦{Number(b.amount).toLocaleString()}</div>
                    </div>

                    <div className="flex gap-2 items-center">
                      {b.status === "confirmed" && (
                        <button onClick={() => setReceipt(b)}
                          className="bg-[#C9A84C] hover:bg-[#b8943e] text-black text-[10px] tracking-widest uppercase font-bold px-5 py-2.5 rounded-xl transition-colors">
                          Print Receipt
                        </button>
                      )}
                      {b.status === "awaiting_confirmation" && (
                        <span className="text-[10px] text-white/30 italic">Awaiting admin confirmation…</span>
                      )}
                      {b.status === "rejected" && (
                        <span className="text-[10px] text-red-400/60 italic">Contact support for assistance.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <BookingPicture />
          </div>
        )}
      </div>

      {receipt && <Receipt booking={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}