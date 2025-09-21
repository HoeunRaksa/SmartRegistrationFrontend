import React from "react"
import { Button } from "./ui/Button"
import BackGrpundImg from "../assets/Images/Background.png";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute border glass inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${BackGrpundImg}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Excellence University</h1>
        <p className="text-xl md:text-2xl mb-8 text-pretty leading-relaxed">
          {
            "Empowering minds, shaping futures, and building tomorrow's leaders through innovative education and groundbreaking research since 1875."
          }
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Discover Our Story
        </Button>
      </div>
    </section>
  )
}
