import { Button } from "./ui/Button"
import React from "react"

export function CallToActionSection() {
  return (
    <section className="py-20 text-gray-700 text-primary-foreground">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Join Our Community?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-pretty leading-relaxed opacity-90">
          {
            "Discover the opportunities that await you at Excellence University. Whether you're a prospective student, researcher, or partner, we invite you to be part of our journey."
          }
        </p>

        <div>
          <Button
            onClick={() => {
              window.location.href = "/registration";
            }}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </section>
  )
}
