"use client";
import { useState, useEffect, useRef } from "react";

const RATES = { "2-bedroom": 100000, selfcontain: 70000 };

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const nights = (ci, co) => {
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));
};

const isDateRangeUnavailable = (checkIn, checkOut, roomType, bookedDates) => {
  if (!checkIn || !checkOut || !roomType) return false;
  const newStart = new Date(checkIn);
  const newEnd = new Date(checkOut);

  return bookedDates.some(({ checkIn: bIn, checkOut: bOut, roomType: bRoom }) => {
    if (bRoom !== roomType) return false;
    const bStart = new Date(bIn);
    const bEnd = new Date(bOut);
    return newStart < bEnd && newEnd > bStart;
  });
};

const getBookedDateRanges = (bookedDates, roomType) => {
  return bookedDates
    .filter((b) => b.roomType === roomType && b.status !== "rejected")
    .map((b) => ({ start: b.checkIn, end: b.checkOut }));
};

const statusPill = (status) => {
  const map = {
    awaiting_confirmation: { label: "Awaiting Confirmation", cls: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
    confirmed:             { label: "Confirmed ✓",           cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
    rejected:              { label: "Rejected",              cls: "bg-red-500/15 text-red-400 border border-red-500/30" },
  };
  const s = map[status] || { label: status, cls: "bg-white/10 text-white/50" };
  return (
    <span className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium ${s.cls}`}>
      {s.label}
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
              {[
                ["Name",  booking.name],
                ["Phone", booking.phone],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-white/5 text-sm">
                  <span className="text-white/50">{l}</span>
                  <span className="font-medium text-white">{v}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-3">Stay Details</div>
              {[
                ["Room Type", booking.roomType === "2-bedroom" ? "2 Bedroom" : "Self Contain"],
                ["Check-in",  fmt(booking.checkIn)],
                ["Check-out", fmt(booking.checkOut)],
                ["Guests",    booking.guests],
                ["Duration",  `${nights(booking.checkIn, booking.checkOut)} night(s)`],
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
              {booking.transferReference && (
                <div className="mt-2 text-[11px] text-white/30">
                  Transfer Ref: <span className="text-white/50 font-medium">{booking.transferReference}</span>
                </div>
              )}
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

function BookingForm({ onBooked, allBookings }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", phone: "", roomType: "", checkIn: "", checkOut: "", guests: 1, transferReference: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setAvailabilityError("");
  };

  const n = nights(form.checkIn, form.checkOut);
  const rate = RATES[form.roomType] || 0;
  const amount = n * rate;

  const today = new Date().toISOString().split("T")[0];

  const checkAvailability = () => {
    if (!form.checkIn || !form.checkOut || !form.roomType) return true;
    const conflicts = isDateRangeUnavailable(form.checkIn, form.checkOut, form.roomType, allBookings);
    if (conflicts) {
      const room = form.roomType === "2-bedroom" ? "2 Bedroom" : "Self Contain";
      setAvailabilityError(
        `The ${room} is already booked for some or all of the selected dates. Please choose different dates.`
      );
      return false;
    }
    setAvailabilityError("");
    return true;
  };

  const submitBooking = async () => {
    if (!checkAvailability()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStep(3);
      onBooked?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 transition-colors";
  const labelCls = "block text-[10px] tracking-[0.15em] uppercase text-white/50 mb-2";

  const bookedRangesForRoom = form.roomType
    ? getBookedDateRanges(allBookings, form.roomType)
    : [];

  return (
    <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-8">
      <h2 className="font-playfair text-xl font-semibold text-white mb-1">
        New <span className="text-[#C9A84C]">Booking</span>
      </h2>
      <p className="text-white/40 text-xs tracking-wide mb-8">Complete the form below to reserve your stay</p>

      <div className="flex items-center gap-3 mb-8">
        {["Your Details", "Bank Transfer", "Submitted"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
              ${step > i + 1 ? "bg-[#C9A84C] text-black" : step === i + 1 ? "bg-[#C9A84C]/20 border border-[#C9A84C] text-[#C9A84C]" : "bg-white/5 border border-white/10 text-white/20"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] tracking-wide uppercase ${step === i + 1 ? "text-white/80" : "text-white/20"}`}>{s}</span>
            {i < 2 && <div className={`h-px w-8 ${step > i + 1 ? "bg-[#C9A84C]/40" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Full Name</label>
              <input className={inputCls} placeholder="John Doe" value={form.name} onChange={set("name")} />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input className={inputCls} placeholder="+234 800 000 0000" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className={labelCls}>Room Type</label>
              <select className={inputCls} value={form.roomType} onChange={set("roomType")}>
                <option value="" disabled>Select a room</option>
                <option value="2-bedroom">2 Bedroom — ₦{RATES["2-bedroom"].toLocaleString()}/night</option>
                <option value="selfcontain">Self Contain — ₦{RATES["selfcontain"].toLocaleString()}/night</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>No. of Guests</label>
              <input className={inputCls} type="number" min={1} max={10} value={form.guests} onChange={set("guests")} />
            </div>
            <div>
              <label className={labelCls}>Check-in Date</label>
              <input className={inputCls} type="date" min={today} value={form.checkIn}
                onChange={(e) => { setForm((p) => ({ ...p, checkIn: e.target.value, checkOut: "" })); setAvailabilityError(""); }} />
            </div>
            <div>
              <label className={labelCls}>Check-out Date</label>
              <input className={inputCls} type="date" min={form.checkIn || today} value={form.checkOut}
                onChange={(e) => { set("checkOut")(e); setAvailabilityError(""); }} />
            </div>
          </div>

          {form.roomType && bookedRangesForRoom.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              <div className="text-[9px] tracking-[0.2em] uppercase text-amber-400/70 mb-2">
                Already Booked Dates for {form.roomType === "2-bedroom" ? "2 Bedroom" : "Self Contain"}
              </div>
              <div className="flex flex-wrap gap-2">
                {bookedRangesForRoom.map((r, i) => (
                  <span key={i} className="text-[11px] text-amber-300/70 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1">
                    {fmt(r.start)} → {fmt(r.end)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {availabilityError && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 flex items-start gap-3">
              <span className="text-red-400 text-lg mt-0.5">⚠</span>
              <p className="text-red-300 text-xs leading-relaxed">{availabilityError}</p>
            </div>
          )}

          {amount > 0 && !availabilityError && (
            <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-4 flex justify-between items-center">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">Total Amount</div>
                <div className="text-[#C9A84C] text-lg font-semibold mt-1">₦{amount.toLocaleString()}</div>
              </div>
              <div className="text-right text-xs text-white/40">
                {n} night(s) × ₦{rate.toLocaleString()}
              </div>
            </div>
          )}

          <button
            onClick={() => {
  if (!form.name || !form.phone || !form.roomType || !form.checkIn || !form.checkOut)
    return setError("Please fill all fields.");
  if (new Date(form.checkIn) < new Date(today))
    return setError("Check-in date cannot be in the past.");
  if (amount <= 0) return setError("Select valid check-in and check-out dates.");
  if (!checkAvailability()) return;
  setError("");
  setStep(2);
}}
            className="w-full bg-[#C9A84C] hover:bg-[#b8943e] text-black text-[11px] tracking-widest uppercase font-bold py-4 rounded-xl transition-colors mt-2">
            Continue to Payment →
          </button>
          {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/30 rounded-2xl p-6">
            <div className="text-[9px] tracking-[0.25em] uppercase text-[#C9A84C]/60 mb-4">Transfer Details</div>
            <div className="space-y-3">
              {[
                ["Bank",           "First Bank"],
                ["Account Name",   "Comfort Service Apartment"],
                ["Account Number", "5326761655"],
                ["Amount",         `₦${amount.toLocaleString()}`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-white/50">{l}</span>
                  <span className={`font-semibold ${l === "Amount" ? "text-[#C9A84C]" : "text-white"}`}>{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 pt-4 border-t border-white/5 text-[11px] text-white/40 leading-relaxed">
              Transfer the exact amount above, then click{" "}
              <span className="text-white/60">"I Have Made Transfer"</span>.
            </p>
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="px-6 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-[11px] tracking-widest uppercase rounded-xl py-4 transition-colors">
              ← Back
            </button>
            <button onClick={submitBooking} disabled={loading}
              className="flex-1 bg-[#C9A84C] hover:bg-[#b8943e] disabled:opacity-50 text-black text-[11px] tracking-widest uppercase font-bold py-4 rounded-xl transition-colors">
              {loading ? "Submitting…" : "I Have Made Transfer ✓"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-5">
            ⏳
          </div>
          <h3 className="font-playfair text-lg font-semibold text-white mb-2">Booking Submitted!</h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
            Your booking is awaiting payment confirmation. You'll be able to print your receipt once the admin confirms your transfer.
          </p>
          <button onClick={() => setStep(1)}
            className="mt-6 border border-white/10 hover:border-[#C9A84C]/30 text-white/50 hover:text-white/80 text-[10px] tracking-widest uppercase px-6 py-3 rounded-xl transition-colors">
            Make Another Booking
          </button>
        </div>
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

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

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

  const activeBookings = bookings.filter((b) => b.status !== "rejected");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/5 px-8 md:px-16 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-lg font-semibold text-white">
            My <span className="text-[#C9A84C]">Dashboard</span>
          </h1>
          <p className="text-white/40 text-[11px] tracking-wide mt-0.5">Manage your bookings and reservations</p>
        </div>

        <div className="flex items-center gap-3">
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

      <div className="px-8 md:px-16 py-10 max-w-5xl mx-auto">
        {activeTab === "new" && (
          <BookingForm
            allBookings={activeBookings}
            onBooked={() => { fetchBookings(); setActiveTab("bookings"); }}
          />
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
                        {b.roomType === "2-bedroom" ? "2 Bedroom" : "Self Contain"} · {fmt(b.checkIn)} → {fmt(b.checkOut)} · {nights(b.checkIn, b.checkOut)} night(s) · {b.guests} guest(s)
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
          </div>
        )}
      </div>

      {receipt && <Receipt booking={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}