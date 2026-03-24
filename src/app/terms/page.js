'use client'

import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="px-6 md:px-16 py-24 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-playfair font-semibold mb-8">Terms of Service</h1>

      <p className="mb-4">
        Welcome to <strong>Comfort Serene Apartment</strong>. By using our website and services, you agree to these Terms of Service. Please read them carefully before making a booking.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Bookings and Payments</h2>
      <p className="mb-4">
        All bookings are subject to availability. Payments must be made in full at the time of booking unless otherwise specified. Prices are as displayed on the website and may change without notice.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Cancellations and Refunds</h2>
      <p className="mb-4">
        Cancellation policies depend on the type of booking. Refunds will be processed in accordance with our cancellation rules. Please check your booking confirmation for details.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Guest Responsibilities</h2>
      <p className="mb-4">
        Guests must provide accurate information when booking and respect apartment rules during their stay. Comfort Serene Apartment is not responsible for lost or stolen personal items.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
      <p className="mb-4">
        Comfort Serene Apartment is not liable for any direct or indirect damages arising from your use of our website or services, including booking errors or service interruptions.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p>
        For any questions about these Terms of Service, please reach out to us at{' '}
        <a href="mailto:info@comfortserene.com" className="text-[#C9A84C] underline">
          info@comfortserene.com
        </a>
      </p>
      <a href="/" className="text-[#C9A84C] hover:underline mt-8 inline-block">
        ← Back to Home
      </a>
    </div>
  )
}