'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaEye, FaEyeSlash, FaEnvelope, FaLock
} from 'react-icons/fa'

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword]               = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading]                         = useState(false)
  const [error, setError]                             = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return setError('All fields are required')
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong')
        setLoading(false)
        return
      }

      router.push('/login?registered=true')

    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const len = formData.password.length
    if (len === 0) return { label: '', bars: 0 }
    if (len < 4)   return { label: 'Too weak', bars: 1 }
    if (len < 5)   return { label: 'Weak',     bars: 2 }
    if (len < 6)   return { label: 'Good',     bars: 3 }
    return               { label: 'Strong',    bars: 4 }
  }

  const strength = getPasswordStrength()

  const barColor = (i) => {
    if (i >= strength.bars) return 'bg-white/10'
    if (strength.bars === 1) return 'bg-red-500'
    if (strength.bars === 2) return 'bg-yellow-500'
    if (strength.bars === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const inputClass = "w-full bg-[#0a0a0a] border border-white/10 pl-11 pr-4 py-3 rounded-lg text-sm text-white outline-none focus:border-[#C9A84C]/50 focus:shadow-[0_0_0_1px_rgba(201,168,76,0.15)] transition-all"
  const inputPwdClass = "w-full bg-[#0a0a0a] border border-white/10 pl-11 pr-12 py-3 rounded-lg text-sm text-white outline-none focus:border-[#C9A84C]/50 focus:shadow-[0_0_0_1px_rgba(201,168,76,0.15)] transition-all"
  const labelClass = "block text-[10px] tracking-[0.25em] uppercase text-white/70 mb-1 font-medium"
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-white/30"

  return (
    <div className="bg-[#0a0a0a] flex min-h-screen">

 {/* ══ LEFT PANEL ══ */}
<div
  className="hidden lg:flex lg:w-1/2 h-screen flex-shrink-0 overflow-hidden relative"
  style={{
    backgroundImage: `url('https://res.cloudinary.com/dwhga1raw/image/upload/v1774100982/SWZ_6383_medvry.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  {/* Overlays */}
  <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0a]/20 to-[#0a0a0a]/60" />
  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/20 to-transparent" />

  {/* Logo */}
  <div className="absolute top-10 left-10 z-20">
    <Link href="/" className="font-playfair text-xl text-white tracking-wide">
      Comfort <span className="text-[#C9A84C]">Service</span>
    </Link>
  </div>

  {/* Bottom content */}
  <div className="absolute bottom-12 left-10 right-10 z-20">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-px bg-[#C9A84C]" />
      <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A84C] font-semibold">
        Ibadan&apos;s Finest Shortlet
      </span>
    </div>
    <h2 className="font-playfair text-4xl text-white leading-snug mb-3">
      Your perfect stay<br />
      awaits in <em className="text-[#C9A84C]">Ibadan</em>
    </h2>
    <p className="text-white/40 text-xs mb-8 leading-relaxed">
      3 Bedrooms · Pool · 24/7 Power · Secure Living
    </p>
    <div className="flex gap-10 border-t border-white/10 pt-8">
      {[
        { n: '3',    l: 'Bedrooms' },
        { n: '8+',   l: 'Amenities' },
        { n: '24/7', l: 'Support' },
      ].map(s => (
        <div key={s.l}>
          <div className="text-[#C9A84C] text-3xl font-semibold font-playfair">{s.n}</div>
          <div className="text-white/35 text-[10px] tracking-wider mt-1 uppercase">{s.l}</div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-16 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-[#0f0f0f]/60 border border-white/5 p-10 md:p-12 rounded-2xl backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

            {/* mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="font-playfair text-xl text-white tracking-wide">
                Comfort <span className="text-[#C9A84C]">Service</span>
              </Link>
            </div>

            {/* heading */}
            <div className="mb-10 text-center">
              <h1 className="font-playfair text-4xl text-white mb-2">
                Create Account
              </h1>
              <p className="text-white/35 text-sm">
                Start your booking journey
              </p>
            </div>

            {/* error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-3.5 rounded-lg mb-6 flex items-center gap-2">
                <span className="text-base flex-shrink-0">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* EMAIL */}
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <FaEnvelope className={iconClass} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <FaLock className={iconClass} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    
                    className={inputPwdClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/50 transition p-1">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* strength meter */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex gap-1.5 mb-1.5">
                      {[0,1,2,3].map(i => (
                        <div key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${barColor(i)}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/30 tracking-wide">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <FaLock className={iconClass} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={inputPwdClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/50 transition p-1">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* match indicator */}
                {formData.confirmPassword && (
                  <p className={`text-[10px] mt-2 tracking-wide flex items-center gap-1.5
                    ${formData.password === formData.confirmPassword
                      ? 'text-green-400' : 'text-red-400'}`}>
                    {formData.password === formData.confirmPassword
                      ? <><span>✓</span> Passwords match</>
                      : <><span>✗</span> Passwords do not match</>}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-2 mt-4 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Sign Up'}
                </button>
              </div>

            </form>

            {/* divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[10px] text-white/15 tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* login link */}
            <p className="text-center text-sm text-white/60">
              Already have an account?{' '}
              <Link href="/login"
                className="text-[#C9A84C] hover:text-[#d4b35a] transition-colors font-medium">
                Sign In
              </Link>
            </p>

            {/* back to home */}
            <div className="text-center mt-6">
              <Link href="/"
                className="text-[10px] text-white/70 hover:text-white/40 tracking-widest uppercase transition-colors">
                ← Back to Home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}