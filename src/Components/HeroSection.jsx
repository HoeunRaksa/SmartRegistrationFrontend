import React from "react";
import AboutUs from "../../public/Images/AboutUs.jpg";

export function HeroSection() {
  return (
    <section className="relative glass w-full flex items-center justify-center py-9 shadow-sm rounded-3xl">
      <div className=" z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="sm:text-2xl text-2xl md:text-5xl font-bold rounded-xl pb-3">Excellence <span className=" text-orange-600">University</span></h1>
        <p className=" md:text-xl sm:text-sm text-xs text-pretty leading-relaxed rounded-lg">
          {
            "Empowering minds, shaping futures, and building tomorrow's leaders through innovative education and groundbreaking research since 1875."
          }
        </p>
      </div>
    </section>
  )
}
