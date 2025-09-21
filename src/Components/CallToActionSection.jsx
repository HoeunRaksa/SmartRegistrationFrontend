import { Button } from "./ui/Button"
import React from "react"

export function CallToActionSection() {
  return (
    <section className="py-20 text-white text-primary-foreground">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Join Our Community?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-pretty leading-relaxed opacity-90">
          {
            "Discover the opportunities that await you at Excellence University. Whether you're a prospective student, researcher, or partner, we invite you to be part of our journey."
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            variant="secondary"
            className="btn btn-primary bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Explore Programs
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
          >
            Schedule a Visit
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </section>
  )
}
