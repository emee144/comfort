'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { 
  FaWifi, FaSnowflake, FaTv, FaUtensils, FaBolt, 
  FaParking, FaLock, FaSwimmingPool,
  FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt,
  FaFacebookF, FaInstagram, FaTwitter,
  FaSun
} from 'react-icons/fa'

export default function HomePage() {
  const [scrolled, setScrolled]     = useState(false)
  const [visible, setVisible]       = useState({})
  const [checkIn, setCheckIn]       = useState('')
  const [checkOut, setCheckOut]     = useState('')
  const [totalPrice, setTotalPrice] = useState(null)
  const [nights, setNights]         = useState(0)
  const sectionRefs                 = useRef({})
  

  /* ── navbar scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── section reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting)
          setVisible(v => ({ ...v, [e.target.dataset.section]: true }))
      }),
      { threshold: 0.12 }
    )
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* ── price calculator ── */
  useEffect(() => {
    if (checkIn && checkOut) {
      const n = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      if (n > 0) { setNights(n); setTotalPrice(n * 100000) }
      else        { setNights(0); setTotalPrice(null) }
    }
  }, [checkIn, checkOut])

  const ref = (key) => (el) => { sectionRefs.current[key] = el }
  const reveal = (key) => visible[key] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'

  const amenities = [
    { icon: <FaWifi />,          name: 'High-Speed WiFi' },
    { icon: <FaSnowflake />,     name: 'Air Conditioning' },
    { icon: <FaTv />,            name: 'Smart TV' },
    { icon: <FaUtensils />,      name: 'Full Kitchen' },
    { icon: <FaBolt />,          name: '24/7 Generator' },
    { icon: <FaParking />,       name: 'Free Parking' },
    { icon: <FaLock />,          name: '24/7 Security' },
    { icon: <FaSwimmingPool />,  name: 'Swimming Pool' },
    { icon: <FaSun />,           name: 'Solar' },
  ]

  const reviews = [
    { initial: 'A', name: 'Adebayo M.', date: 'February 2026', rating: 5,
      text: 'Absolutely stunning apartment! The AC was perfect, kitchen fully stocked. Best shortlet in Ibadan hands down. Will definitely be coming back.' },
    { initial: 'C', name: 'Chioma E.', date: 'January 2026', rating: 5,
      text: 'We stayed for 4 nights and it felt like home. The generator never failed once and the WiFi was blazing fast. Very clean and secure.' },
    { initial: 'T', name: 'Tunde F.', date: 'March 2026', rating: 5,
      text: 'Great value for money! The pool was a wonderful bonus. Host was very responsive on WhatsApp. Even better in person than the photos!' },
  ]

const galleryImages = [
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774100994/SWZ_6400_oxue9s.jpg', tall: true },
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774100108/SWZ_6241_a9gvkf.jpg', tall: false },
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774100108/SWZ_6292_i9tkq4.jpg', tall: false },
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774100105/SWZ_6237_owzc1h.jpg', tall: false },
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774100104/SWZ_6232_yd0qf4.jpg', tall: false },
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774100107/SWZ_6250_o1wjt5.jpg', tall: false },
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774100105/SWZ_6275_frtni7.jpg', tall: false },
  { src: 'https://res.cloudinary.com/dwhga1raw/image/upload/v1774128332/SWZ_6339_q1i5fp.jpg', tall: false },
]

  return (
    <div className="grain bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 flex justify-between items-center px-8 md:px-16 transition-all duration-500
        ${scrolled ? 'py-3 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'}`}>

        <a href="#" className="font-playfair text-xl font-semibold tracking-wide">
          Comfort <span className="text-[#C9A84C]">Serene Apartment</span>
        </a>

        <ul className="hidden md:flex gap-10 list-none">
          {['About','Gallery','Amenities','Booking','Location'].map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}
                className="text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-[#C9A84C] transition-colors duration-300">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <a href="/login" className="btn-gold text-[10px] px-2 py-2.5 ml-8">
          Book Now
        </a>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
  <Image
    src="https://res.cloudinary.com/dwhga1raw/image/upload/v1774100984/SWZ_6387_vbfwa2.jpg"
    alt="Comfort Serene Apartment"
    fill
    style={{ objectFit: 'cover' }}
    priority
    className="animate-zoomOut"
  />
</div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/30 to-[#0a0a0a]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="animate-fadeUp delay-100 flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] font-semibold">
              Ibadan&apos;s Finest Shortlet
            </span>
            <div className="w-8 h-px bg-[#C9A84C]" />
          </div>

          <h1 className="font-playfair animate-fadeUp delay-200 text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] mb-8 tracking-tight">
            Where Luxury<br />Meets <em className="text-[#C9A84C]">Comfort</em>
          </h1>

          <p className="animate-fadeUp delay-300 text-sm md:text-base text-white/60 tracking-[0.15em] mb-12 max-w-lg mx-auto leading-relaxed">
            A premium 2-bedroom retreat or self-catering apartment in the heart of Ibadan.<br />
            Book direct. Pay secure. Arrive happy.
          </p>

          <div className="animate-fadeUp delay-400 flex flex-wrap gap-4 justify-center">
            <a href="#booking" className="btn-gold">Reserve Your Stay</a>
            <a href="#gallery" className="btn-ghost">View Gallery</a>
          </div>
        </div>

        {/* stat strip */}
        <div className="absolute bottom-0 inset-x-0 flex justify-center">
          <div className="flex divide-x divide-white/10 bg-[#0a0a0a]/70 backdrop-blur-sm border-t border-white/10">
            {[
              { n: '3',   l: 'Bedrooms' },
              { n: '2+2', l: 'Baths & Toilets' },
              { n: '6',   l: 'Max Guests' },
              { n: '8+',  l: 'Amenities' },
            ].map(s => (
              <div key={s.l} className="px-8 md:px-12 py-4 text-center">
                <div className="font-playfair text-2xl font-semibold text-[#C9A84C]">{s.n}</div>
                <div className="text-[9px] tracking-[0.2em] uppercase text-white/40 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-float">
          <div className="w-px h-10 bg-gradient-to-b from-[#C9A84C] to-transparent" />
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section id="about" className="py-28 px-6 md:px-16 bg-[#0f0f0f]"
        data-section="about" ref={ref('about')}>
        <div className={`grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto transition-all duration-1000 ${reveal('about')}`}>

          <div>
            <div className="section-label">About The Apartment</div>
            <h2 className="font-playfair text-4xl md:text-5xl font-normal leading-tight mb-6">
              A Home Away<br />From <em className="text-[#C9A84C]">Home</em>
            </h2>
            <p className="text-white/50 leading-relaxed mb-4 text-sm">
              Welcome to Comfort Service Apartment — a premium shortlet experience in Ibadan.
              Thoughtfully designed with modern finishes and a warm, inviting atmosphere perfect for
              both business and leisure travellers.
            </p>
            <p className="text-white/50 leading-relaxed mb-10 text-sm">
              Our fully-furnished 2-bedroom, self-contained apartments provides everything you need for a comfortable,
              memorable stay — all at an unbeatable nightly rate.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { n: '2',    l: 'Bedrooms' },
                { n: '3+3',  l: 'Baths & Toilets' },
                { n: '8+',   l: 'Amenities' },
                { n: '24/7', l: 'Support' },
              ].map(s => (
                <div key={s.l} className="border-l-2 border-[#C9A84C] pl-5">
                  <div className="font-playfair text-3xl font-semibold text-white">{s.n}</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 w-full h-full border border-[#C9A84C]/30 rounded-lg" />
<div className="relative w-full h-[480px] overflow-hidden rounded-lg z-10">
  <Image
    src="https://res.cloudinary.com/dwhga1raw/image/upload/v1774100982/SWZ_6383_medvry.jpg"
    alt="Apartment Interior"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>
            <div className="absolute -bottom-5 -left-5 bg-[#C9A84C] p-6 z-20 rounded">
              <div className="font-playfair text-3xl font-bold text-[#0a0a0a]">₦100,000</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#0a0a0a]/70 mt-1">Per Night</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ GALLERY ══════════════ */}
     <section id="gallery" className="py-28 px-6 md:px-16 bg-[#0a0a0a]"
  data-section="gallery" ref={ref('gallery')}>
  <div className={`transition-all duration-1000 ${reveal('gallery')}`}>

    <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 max-w-6xl mx-auto">
      <div>
        <div className="section-label">Photo Gallery</div>
        <h2 className="font-playfair text-4xl md:text-5xl font-normal leading-tight">
          A Glimpse of Your<br /><em className="text-[#C9A84C]">Perfect Stay</em>
        </h2>
      </div>
      <a href="#booking" className="btn-gold mt-6 md:mt-0 self-start">
        Book Now
      </a>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-6xl mx-auto">
      {galleryImages.map((img, i) => (
        <div key={i}
          className={`relative overflow-hidden group cursor-pointer rounded-lg
            ${img.tall ? 'col-span-2 md:col-span-1 row-span-2 h-[460px]' : 'h-[220px]'}`}>
          <Image
            src={img.src}
            alt={`Apartment ${i + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/10 transition-all duration-500" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 border border-white/60 flex items-center justify-center text-white text-xl rounded">
              +
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ══════════════ AMENITIES ══════════════ */}
      <section id="amenities" className="py-28 px-6 md:px-16 bg-[#0f0f0f]"
        data-section="amenities" ref={ref('amenities')}>
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ${reveal('amenities')}`}>

          <div className="text-center mb-16">
            <div className="section-label justify-center">What&apos;s Included</div>
            <h2 className="font-playfair text-4xl md:text-5xl font-normal">
              Premium <em className="text-[#C9A84C]">Amenities</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((a) => (
              <div key={a.name}
                className="amenity-card bg-[#0a0a0a] p-10 text-center border border-white/5 hover:border-[#C9A84C]/30 transition-all duration-300 group cursor-default rounded-lg">
                <div className="text-3xl text-[#C9A84C] flex justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {a.icon}
                </div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                  {a.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ BOOKING ══════════════ */}
     <section 
  id="booking" 
  className="py-28 px-6 md:px-16 bg-[#0a0a0a]"
  data-section="booking" 
  ref={ref('booking')}
>
  <div className={`grid md:grid-cols-2 gap-20 max-w-6xl mx-auto transition-all duration-1000 ${reveal('booking')}`}>

    <div className="flex flex-col justify-center">
      <div className="section-label">Reservations</div>
      <h2 className="font-playfair text-4xl md:text-5xl font-normal leading-tight mb-6">
        Book Your<br /><em className="text-[#C9A84C]">Stay Today</em>
      </h2>
      <p className="text-white/50 text-sm leading-relaxed mb-10">
        Secure your stay at Comfort Serene Apartment in just a few clicks. 
        Fill in your details, choose your dates and pay via bank transfer.
      </p>

      <ul className="space-y-4 mb-12">
        {[
          'Instant confirmation of your booking',
          'Payment via secure bank transfer',
          'Free cancellation 48hrs before check-in',
          '24/7 WhatsApp support available',
          'Self check-in with digital key code',
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-white/50">
            <span className="text-[#C9A84C] mt-0.5 text-xs flex-shrink-0">✦</span>
            {item}
          </li>
        ))}
      </ul>

      <div className="border border-[#C9A84C]/20 p-6 bg-[#C9A84C]/5 rounded-lg">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Starting From</div>
        <div className="font-playfair text-5xl font-semibold">₦100,000</div>
        <div className="text-white/40 text-xs tracking-widest uppercase mt-1">Per Night</div>
      </div>
    </div>

    <div className="bg-[#0f0f0f] border border-white/8 p-10 relative rounded-lg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent rounded-t-lg" />
      
      <h3 className="font-playfair text-2xl font-normal mb-8 text-white/90">
        Reserve Your Dates
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
            Email Address
          </label>
          <input 
            type="email" 
            placeholder="your@email.com"
            className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C]/50 transition-colors rounded" 
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
            Phone Number
          </label>
          <input 
            type="tel" 
            placeholder="+234 800 000 0000"
            className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C]/50 transition-colors rounded" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
              Check-In
            </label>
            <input 
              type="date" 
              value={checkIn} 
              onChange={e => setCheckIn(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3.5 text-sm text-white/70 outline-none focus:border-[#C9A84C]/50 transition-colors rounded" 
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
              Check-Out
            </label>
            <input 
              type="date" 
              value={checkOut} 
              onChange={e => setCheckOut(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3.5 text-sm text-white/70 outline-none focus:border-[#C9A84C]/50 transition-colors rounded" 
            />
          </div>
        </div>

        <div className="border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-5 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Total Amount</div>
              {nights > 0 && (
                <div className="text-xs text-white/30 mt-0.5">
                  {nights} night{nights > 1 ? 's' : ''} × ₦100,000
                </div>
              )}
            </div>
            <div className="font-playfair text-3xl font-semibold text-[#C9A84C]">
              {totalPrice ? `₦${totalPrice.toLocaleString()}` : '₦100,000'}
            </div>
          </div>
        </div>

        <button className="btn-gold w-full text-center py-5">
          Proceed with Bank Transfer →
        </button>

        <p className="text-center text-[10px] text-white/25 tracking-wider">
          🔒 Secure Bank Transfer · Manual Confirmation
        </p>
      </div>
    </div>
  </div>
</section>
      {/* ══════════════ LOCATION ══════════════ */}
      <section id="location" className="py-28 px-6 md:px-16 bg-[#0f0f0f]"
        data-section="location" ref={ref('location')}>
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${reveal('location')}`}>

          <div className="text-center mb-14">
            <div className="section-label justify-center">Find Us</div>
            <h2 className="font-playfair text-4xl md:text-5xl font-normal">
              Our <em className="text-[#C9A84C]">Location</em>
            </h2>
          </div>

          <div className="overflow-hidden h-96 border border-white/10 rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45068989!2d3.7383!3d7.3775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10398d00acdb6f79%3A0xa1d97a16bc98da27!2sIbadan%2C%20Oyo%20State!5e0!3m2!1sen!2sng"
              className="w-full h-full border-0 grayscale"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: '📍', text: 'Ibadan, Oyo State' },
              { icon: '🚗', text: 'Easy Road Access' },
              { icon: '🏪', text: 'Close to Shops' },
              { icon: '🏥', text: 'Near Hospital' },
            ].map(t => (
              <div key={t.text}
                className="flex items-center gap-2 border border-white/10 px-6 py-3 text-xs text-white/50 hover:border-[#C9A84C]/40 hover:text-white/70 transition-all rounded">
                <span>{t.icon}</span> {t.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ REVIEWS ══════════════ */}
      <section id="reviews" className="py-28 px-6 md:px-16 bg-[#0a0a0a]"
        data-section="reviews" ref={ref('reviews')}>
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${reveal('reviews')}`}>

          <div className="text-center mb-16">
            <div className="section-label justify-center">Guest Reviews</div>
            <h2 className="font-playfair text-4xl md:text-5xl font-normal">
              What Our Guests <em className="text-[#C9A84C]">Say</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.name}
                className="border border-white/8 p-8 hover:border-[#C9A84C]/30 transition-all duration-300 rounded-lg">
                <div className="flex gap-0.5 mb-5">
                  {Array(r.rating).fill(0).map((_, i) => (
                    <span key={i} className="text-[#C9A84C] text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/50 text-sm leading-relaxed italic mb-8">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-white/8 pt-6">
                  <div className="w-10 h-10 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center font-playfair text-lg text-[#C9A84C] font-semibold rounded-full">
                    {r.initial}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/80">{r.name}</div>
                    <div className="text-[10px] text-white/30 tracking-wider">{r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/id/42/1400/600"
            alt="CTA Background"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />

        <div className="relative text-center max-w-2xl mx-auto">
          <div className="section-label justify-center mb-4">Limited Availability</div>
          <h2 className="font-playfair text-4xl md:text-6xl font-normal mb-6 leading-tight">
            Ready for an<br /><em className="text-[#C9A84C]">Unforgettable Stay?</em>
          </h2>
          <p className="text-white/50 text-sm mb-10 leading-relaxed">
            Book now and experience the finest shortlet apartment in Ibadan.<br />
            Secure your dates before they&apos;re gone!
          </p>
          <a href="#booking" className="btn-gold">
            Book Now — ₦100,000 / Night
          </a>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-[#050505] border-t border-white/5">

  {/* main footer */}
  <div className="px-6 md:px-16 pt-24 pb-16 max-w-6xl mx-auto grid md:grid-cols-4 gap-16">

    {/* brand */}
    <div className="md:col-span-2">
      <div className="font-playfair text-2xl font-semibold mb-6">
        Comfort <span className="text-[#C9A84C]">Serene Apartment</span>
      </div>
      <p className="text-xs text-white/30 leading-relaxed max-w-xs mb-8">
        Premium shortlet living in the heart of Ibadan. Your comfort is our priority
        from the moment you book to the moment you check out.
      </p>
      {/* socials */}
      <div className="flex gap-4">
        {[
          { icon: <FaFacebookF />, href: '#' },
          { icon: <FaInstagram />, href: '#' },
          { icon: <FaTwitter />,   href: '#' },
          { icon: <FaWhatsapp />,  href: 'https://wa.me/2349135415924' },
        ].map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sm text-white/30 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all">
            {s.icon}
          </a>
        ))}
      </div>
    </div>

    {/* quick links */}
    {/* quick links */}
<div className="mt-8">
  <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-10 font-semibold">
    Quick Links
  </h4>
  <ul className="space-y-6">
    {['About','Gallery','Amenities','Booking','Location','Reviews'].map(l => (
      <li key={l}>
        <a href={`#${l.toLowerCase()}`}
          className="text-xs text-white/30 hover:text-[#C9A84C] transition-colors tracking-wide flex items-center gap-2 group">
          <span className="w-3 h-px bg-[#C9A84C]/0 group-hover:bg-[#C9A84C] transition-all duration-300" />
          {l}
        </a>
      </li>
    ))}
  </ul>
</div>

{/* contact */}
<div className="mt-8">
  <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-10 font-semibold">
    Contact Us
  </h4>
  <div className="space-y-7">
    {[
      { icon: <FaPhone className="text-[#C9A84C]" />,        text: '+2349135415924' },
      { icon: <FaWhatsapp className="text-[#C9A84C]" />,     text: '+2349135415924' },
      { icon: <FaEnvelope className="text-[#C9A84C]" />,     text: 'info@comfortserene.com' },
      { icon: <FaMapMarkerAlt className="text-[#C9A84C]" />, text: 'Ibadan, Oyo State' },
    ].map((c, i) => (
      <div key={i} className="flex items-start gap-3 text-xs text-white/30 hover:text-white/50 transition-colors cursor-default">
        <span className="mt-0.5 flex-shrink-0 text-sm">{c.icon}</span>
        <span className="leading-relaxed">{c.text}</span>
      </div>
    ))}
  </div>
</div>
  </div>

  {/* divider */}
  <div className="max-w-6xl mx-auto px-6 md:px-16">
    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>

  {/* bottom bar */}
  <div className="px-6 md:px-16 py-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <span className="text-[10px] text-white/20 tracking-wider">
      © {new Date().getFullYear()} Comfort Service Apartment. All rights reserved.
    </span>
    <div className="flex items-center gap-8">
      {['Privacy Policy', 'Terms of Service'].map(l => (
        <a key={l} href="#"
          className="text-[10px] text-white/20 hover:text-[#C9A84C] tracking-wider transition-colors">
          {l}
        </a>
      ))}
    </div>
  </div>
</footer>

      {/* ══════════════ WHATSAPP FLOAT ══════════════ */}
      <a href="https://wa.me/2349135415924" target="_blank" rel="noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:scale-110 transition-transform z-50">
        <FaWhatsapp />
      </a>

    </div>
  )
}