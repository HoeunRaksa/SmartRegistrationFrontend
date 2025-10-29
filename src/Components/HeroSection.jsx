import React from "react";
import AboutUs from "../../public/Images/AboutUs.jpg";

export function HeroSection() {
  return (
    <section className="relative w-full flex items-center justify-center -mt-5 shadow-sm">

        <img
          src={AboutUs}
          alt="University Campus Background"
          className="w-full sm:h-200 h-100 object-cover shadow-sm bg-no-repeat"
        />
      {/* Content */}
      <div className=" absolute z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 p-4 rounded-xl">Excellence University</h1>
        <p className="text-xl md:text-2xl mb-8 p-4 text-pretty leading-relaxed rounded-lg">
          {
            "Empowering minds, shaping futures, and building tomorrow's leaders through innovative education and groundbreaking research since 1875."
          }
        </p>
      </div>
    </section>
  )
}
