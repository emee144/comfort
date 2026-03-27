'use client'
import React from 'react';
export default function BookingPicture() {
  const twoBedroomImages = [
    "https://res.cloudinary.com/dwhga1raw/image/upload/v1774512207/SWZ_6294_jzc8dw.jpg",
    "https://res.cloudinary.com/dwhga1raw/image/upload/v1774128331/SWZ_6347_jopc1w.jpg",
    "https://res.cloudinary.com/dwhga1raw/image/upload/v1774100107/SWZ_6250_o1wjt5.jpg"
  ];

  const selfContainImages = [
    "https://res.cloudinary.com/dwhga1raw/image/upload/v1774514417/SWZ_6197_jq1pm5.jpg",
    "https://res.cloudinary.com/dwhga1raw/image/upload/v1774514416/SWZ_6184_r0izdv.jpg",
    "https://res.cloudinary.com/dwhga1raw/image/upload/v1774511168/SWZ_6071_jhrkig.jpg"
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