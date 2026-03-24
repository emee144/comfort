'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa'

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.')
    }
  }, [searchParams])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      return setError('All fields are required')
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid email or password')
        setLoading(false)
        return
      }

     router.push('/booking')

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      {/* ══ LEFT — image panel ══ */}
<div className="hidden lg:flex lg:w-1/2 relative h-screen overflow-hidden">
  {/* Image */}
  <Image
    src="https://res.cloudinary.com/dwhga1raw/image/upload/v1774100984/SWZ_6387_vbfwa2.jpg"
    alt="Comfort Service Apartment"
    fill
    style={{ objectFit: 'cover', objectPosition: 'center' }}
    unoptimized
    priority
  />

  {/* Overlays */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/20 to-[#0a0a0a]/60" />
  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />

  {/* logo */}
  <div className="absolute top-10 left-10">
    <Link href="/" className="font-playfair text-xl font-semibold text-white tracking-wide">
      Comfort <span className="text-[#C9A84C]">Service Apartment</span>
    </Link>
  </div>

  <div className="absolute bottom-12 left-10 right-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-[#C9A84C]" />
      <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] font-semibold">
        Welcome Back
      </span>
    </div>
    <h2 className="font-playfair text-3xl font-normal text-white leading-snug">
      Your comfort<br />is waiting in <em className="text-[#C9A84C]">Ibadan</em>
    </h2>
    <p className="text-white/40 text-xs mt-3 leading-relaxed tracking-wide">
      3 Bedrooms · 2 Bathrooms · Swimming Pool · 24/7 Generator
    </p>

    <div className="flex gap-8 mt-8">
      {[
        { n: '3',    l: 'Bedrooms' },
        { n: '8+',   l: 'Amenities' },
        { n: '24/7', l: 'Support' },
      ].map(s => (
        <div key={s.l}>
          <div className="font-playfair text-2xl font-semibold text-[#C9A84C]">{s.n}</div>
          <div className="text-[9px] tracking-[0.2em] uppercase text-white/40 mt-0.5">{s.l}</div>
        </div>
      ))}
    </div>
  </div>
</div>

     
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 overflow-y-auto">

        {/* mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="font-playfair text-xl font-semibold text-white tracking-wide">
            Comfort <span className="text-[#C9A84C]">Service Apartment</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">


          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#C9A84C]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] font-semibold">
                Welcome Back
              </span>
            </div>
            <h1 className="font-playfair text-4xl font-normal text-white mb-2">
              Sign In
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              Sign in to manage your bookings at Comfort Service Apartment
            </p>
          </div>

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-4 py-3 rounded mb-6 tracking-wide">
              ✓ {success}
            </div>
          )}

  
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded mb-6 tracking-wide">
              ⚠ {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-5">

            {/* email */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0f0f0f] border border-white/10 pl-11 pr-4 py-4 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C]/50 transition-colors rounded"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/70">
                  Password
                </label>
                <Link href="/forgot-password"
                  className="text-[10px] text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors tracking-wide">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-sm" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0f0f0f] border border-white/10 pl-11 pr-12 py-4 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C]/50 transition-colors rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>

          </form>

 
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/20 tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>


          <p className="text-center text-sm text-white/70">
            Don&apos;t have an account?{' '}
            <Link href="/signup"
              className="text-[#C9A84C] hover:text-[#d4b35a] transition-colors font-medium">
              Create Account
            </Link>
          </p>

          <div className="text-center mt-6">
            <Link href="/"
              className="text-[10px] text-white/70 hover:text-white/90 tracking-widest uppercase transition-colors">
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}