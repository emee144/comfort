'use client'

import React from 'react';

export default function BookingPicture() {
  const twoBedroomImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572120360610-d971b9b7c6b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598928506316-8a3c1f5bb0c0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
  ];

  const selfContainImages = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1616628189656-f72a7b9df7ef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549187774-b4b0f2d68b3c?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="booking-pictures">
      <h1 className="booking-title">Our Apartments</h1>

      <div className="scrollers-container">
        <div className="scroller">
          <h2 className="scroller-title">2-Bedroom Apartment</h2>
          <div className="image-carousel">
            {twoBedroomImages.map((img, idx) => (
              <div key={idx} className="image-wrapper">
                <img src={img} alt={`2-bedroom ${idx + 1}`} className="carousel-image"/>
              </div>
            ))}
          </div>
        </div>

        <div className="scroller">
          <h2 className="scroller-title">Self-Contained Apartment</h2>
          <div className="image-carousel">
            {selfContainImages.map((img, idx) => (
              <div key={idx} className="image-wrapper">
                <img src={img} alt={`self contain ${idx + 1}`} className="carousel-image"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}