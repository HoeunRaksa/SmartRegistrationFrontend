import React from "react";
import AboutUs from "../../public/Images/AboutUs.jpg";

export function HeroSection() {
  return (
    <section className="relative h-screen rounded-lg flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute border rounded glass inset-0">
        <img
          src={AboutUs}
          alt="University Campus Background"
          className="w-full h-full object-cover p-4 bg-center bg-no-repeat"
        />
        {/* Dark overlay to make text more visible */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Excellence University</h1>
        <p className="text-xl md:text-2xl mb-8 text-pretty leading-relaxed">
          {
            "Empowering minds, shaping futures, and building tomorrow's leaders through innovative education and groundbreaking research since 1875."
          }
        </p>
      </div>
    </section>
  )
}
