'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  FaWhatsapp, FaCalendarAlt, FaPhone,
  FaCheckCircle, FaClock, FaTimesCircle,
  FaSignOutAlt, FaBed, FaBath, FaSwimmingPool, FaBolt
} from 'react-icons/fa'

export default function BookingPage() {
  const router = useRouter()

  const [user, setUser]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [bookings, setBookings]     = useState([])

  // booking form
  const [checkIn, setCheckIn]       = useState('')
  const [checkOut, setCheckOut]     = useState('')
  const [phone, setPhone]           = useState('')
  const [nights, setNights]         = useState(0)
  const [totalPrice, setTotalPrice] = useState(null)
  const [formError, setFormError]   = useState('')
  const [submitting, setSubmitting] = useState(false)

  // success state
  const [successBooking, setSuccessBooking] = useState(null)

  /* ── check auth ── */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          router.push('/login')
          return
        }
        const data = await res.json()
        setUser(data.user)
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  /* ── fetch user bookings ── */
  useEffect(() => {
    if (!user) return
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/auth/bookings')
        if (res.ok) {
          const data = await res.json()
          setBookings(data.bookings || [])
        }
      } catch {
        console.error('Failed to fetch bookings')
      }
    }
    fetchBookings()
  }, [user])

  /* ── price calculator ── */
  useEffect(() => {
    if (checkIn && checkOut) {
      const n = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      if (n > 0) { setNights(n); setTotalPrice(n * 100000) }
      else        { setNights(0); setTotalPrice(null) }
    }
  }, [checkIn, checkOut])

  /* ── logout ── */
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  /* ── handle payment ── */
  const handlePayment = async () => {
    setFormError('')

    if (!checkIn || !checkOut) return setFormError('Please select check-in and check-out dates')
    if (!phone)                 return setFormError('Please enter your phone number')
    if (nights <= 0)            return setFormError('Check-out must be after check-in')

    // check if dates are already booked
    const isBooked = bookings.some(b => {
      if (b.status === 'cancelled') return false
      const bIn  = new Date(b.checkIn)
      const bOut = new Date(b.checkOut)
      const cIn  = new Date(checkIn)
      const cOut = new Date(checkOut)
      return cIn < bOut && cOut > bIn
    })

    if (isBooked) return setFormError('These dates are already booked. Please choose different dates.')

    setSubmitting(true)

    try {
      // initialize Paystack payment
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn, checkOut, phone, amount: totalPrice }),
      })

      const data = await res.json()

      if (!res.ok) {
        setFormError(data.message || 'Payment initialization failed')
        setSubmitting(false)
        return
      }

      // open Paystack popup
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: totalPrice * 100, // kobo
        currency: 'NGN',
        ref: data.reference,
        onClose: () => setSubmitting(false),
        callback: async (response) => {
          // verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: response.reference,
              checkIn,
              checkOut,
              phone,
              amount: totalPrice,
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyRes.ok) {
            setSuccessBooking(verifyData.booking)
            setBookings(prev => [verifyData.booking, ...prev])
            setCheckIn('')
            setCheckOut('')
            setPhone('')
            setNights(0)
            setTotalPrice(null)
            // scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else {
            setFormError(verifyData.message || 'Payment verification failed')
          }

          setSubmitting(false)
        },
      })

      handler.openIframe()

    } catch {
      setFormError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const statusIcon = (status) => {
    if (status === 'confirmed') return <FaCheckCircle className="text-green-400" />
    if (status === 'pending')   return <FaClock className="text-yellow-400" />
    return                             <FaTimesCircle className="text-red-400" />
  }

  const statusColor = (status) => {
    if (status === 'confirmed') return 'text-green-400 bg-green-400/10 border-green-400/20'
    if (status === 'pending')   return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    return                             'text-red-400 bg-red-400/10 border-red-400/20'
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#C9A84C]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-white/40 text-xs tracking-widest uppercase">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Paystack script */}
      <script src="https://js.paystack.co/v1/inline.js" async />

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-16 py-4 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="font-playfair text-xl font-semibold tracking-wide">
          Comfort <span className="text-[#C9A84C]">Service</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 hidden md:block">{user?.email}</span>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30 px-4 py-2 rounded-lg">
            <FaSignOutAlt />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">

        {/* ══════════ SUCCESS BANNER ══════════ */}
        {successBooking && (
          <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-6 mb-10 flex items-start gap-4">
            <FaCheckCircle className="text-green-400 text-2xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-green-400 font-semibold mb-1">Booking Confirmed!</h3>
              <p className="text-white/50 text-sm">
                Your booking from <span className="text-white">{formatDate(successBooking.checkIn)}</span> to{' '}
                <span className="text-white">{formatDate(successBooking.checkOut)}</span> has been confirmed.
                A confirmation has been sent to <span className="text-white">{user?.email}</span>.
              </p>
              <button onClick={() => setSuccessBooking(null)}
                className="text-[10px] text-white/30 hover:text-white/50 mt-2 tracking-wider uppercase transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ══════════ LEFT — NEW BOOKING ══════════ */}
          <div>
            {/* apartment summary card */}
            <div className="relative h-52 rounded-xl overflow-hidden mb-8">
              <Image
                src="https://res.cloudinary.com/dwhga1raw/image/upload/v1774100984/SWZ_6387_vbfwa2.jpg"
                alt="Comfort Service Apartment"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <h2 className="font-playfair text-2xl font-normal mb-2">
                  Comfort Service Apartment
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-1.5"><FaBed className="text-[#C9A84C]" /> 3 Bedrooms</span>
                  <span className="flex items-center gap-1.5"><FaBath className="text-[#C9A84C]" /> 2 Bathrooms</span>
                  <span className="flex items-center gap-1.5"><FaSwimmingPool className="text-[#C9A84C]" /> Pool</span>
                  <span className="flex items-center gap-1.5"><FaBolt className="text-[#C9A84C]" /> Generator</span>
                </div>
              </div>
            </div>

            {/* booking form */}
            <div className="bg-[#0f0f0f] border border-white/8 rounded-xl p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent rounded-t-xl" />

              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-[#C9A84C]" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] font-semibold">
                  New Booking
                </span>
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <span>⚠</span> {formError}
                </div>
              )}

              <div className="space-y-5">

                {/* dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2.5">
                      Check-In
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
                      <input
                        type="date"
                        value={checkIn}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => { setCheckIn(e.target.value); setFormError('') }}
                        className="w-full bg-[#0a0a0a] border border-white/10 pl-11 pr-4 py-4 text-sm text-white/70 outline-none focus:border-[#C9A84C]/50 transition-colors rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2.5">
                      Check-Out
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        onChange={e => { setCheckOut(e.target.value); setFormError('') }}
                        className="w-full bg-[#0a0a0a] border border-white/10 pl-11 pr-4 py-4 text-sm text-white/70 outline-none focus:border-[#C9A84C]/50 transition-colors rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* phone */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setFormError('') }}
                      placeholder="+234 800 000 0000"
                      className="w-full bg-[#0a0a0a] border border-white/10 pl-11 pr-4 py-4 text-sm text-white placeholder-white/15 outline-none focus:border-[#C9A84C]/50 transition-colors rounded-lg"
                    />
                  </div>
                </div>

                {/* price breakdown */}
                {nights > 0 && (
                  <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-5 space-y-3">
                    <div className="flex justify-between text-sm text-white/50">
                      <span>₦100,000 × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>₦{(100000 * nights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/50">
                      <span>Paystack fee</span>
                      <span>₦{Math.min(Math.round(totalPrice * 0.015) + 100, 2000).toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/8" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">Total</span>
                      <span className="font-playfair text-3xl font-semibold text-[#C9A84C]">
                        ₦{totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* submit */}
                <button
                  onClick={handlePayment}
                  disabled={submitting}
                  className="btn-gold w-full py-4 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Proceed to Payment →'}
                </button>

                <p className="text-center text-[10px] text-white/20 tracking-wider">
                  🔒 Secured by Paystack · SSL Encrypted
                </p>

              </div>
            </div>
          </div>

          {/* ══════════ RIGHT — MY BOOKINGS ══════════ */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-px bg-[#C9A84C]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] font-semibold">
                My Bookings
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-[#0f0f0f] border border-white/8 rounded-xl p-12 text-center">
                <FaCalendarAlt className="text-white/10 text-5xl mx-auto mb-4" />
                <p className="text-white/30 text-sm mb-2">No bookings yet</p>
                <p className="text-white/20 text-xs">Your bookings will appear here after payment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b, i) => (
                  <div key={i}
                    className="bg-[#0f0f0f] border border-white/8 rounded-xl p-6 hover:border-[#C9A84C]/20 transition-all">

                    {/* status badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${statusColor(b.status)}`}>
                        {statusIcon(b.status)}
                        <span className="capitalize font-medium">{b.status}</span>
                      </div>
                      <span className="text-[10px] text-white/20 tracking-wider">
                        #{b._id?.toString().slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* dates */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-1">Check-In</div>
                        <div className="text-sm font-medium text-white/80">{formatDate(b.checkIn)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-1">Check-Out</div>
                        <div className="text-sm font-medium text-white/80">{formatDate(b.checkOut)}</div>
                      </div>
                    </div>

                    {/* nights + amount */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-xs text-white/30">
                        {Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000)} night{Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000) > 1 ? 's' : ''}
                      </span>
                      <span className="font-playfair text-xl font-semibold text-[#C9A84C]">
                        ₦{b.amount?.toLocaleString()}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* need help */}
            <div className="mt-6 border border-white/8 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white/70 mb-1">Need help?</div>
                <div className="text-xs text-white/30">Contact us on WhatsApp</div>
              </div>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs px-4 py-2.5 rounded-lg hover:bg-[#25D366]/20 transition-colors">
                <FaWhatsapp />
                <span>Chat</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}