'use client'

import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <section className="max-w-3xl mx-auto py-24 px-6">
      <h1 className="text-3xl font-semibold mb-8 text-white">Privacy Policy</h1>

      <p className="text-white/80 mb-4">
        At Comfort Serene Apartment, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Information We Collect</h2>
      <p className="text-white/80 mb-4">
        We may collect personal information such as your name, email address, phone number, and booking details when you contact us or book a property.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">How We Use Your Information</h2>
      <p className="text-white/80 mb-4">
        Your information helps us provide better service, process bookings, respond to inquiries, and send important updates related to your stay.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Data Protection</h2>
      <p className="text-white/80 mb-4">
        We take appropriate measures to protect your data from unauthorized access, disclosure, alteration, or destruction.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Sharing Your Information</h2>
      <p className="text-white/80 mb-4">
        We do not sell or rent your personal information. We may share data with service providers to facilitate bookings and communication.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Changes to This Policy</h2>
      <p className="text-white/80 mb-4">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.
      </p>

      <a href="/" className="text-[#C9A84C] hover:underline mt-8 inline-block">
        ← Back to Home
      </a>
    </section>
  );
}