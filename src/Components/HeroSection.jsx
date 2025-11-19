import React from "react";
import AboutUs from "../../public/Images/AboutUs.jpg";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-teal-500 w-full flex items-center justify-center py-9 shadow-sm rounded-lg">
      <div className=" z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="sm:text-2xl text-2xl md:text-5xl font-bold rounded-xl pb-3">Excellence University</h1>
        <p className="text-sm md:text-xl  text-pretty leading-relaxed rounded-lg">
          {
            "Empowering minds, shaping futures, and building tomorrow's leaders through innovative education and groundbreaking research since 1875."
          }
        </p>
      </div>
    </section>
  )
}
