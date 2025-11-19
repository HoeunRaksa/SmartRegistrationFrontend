import { Button } from "./ui/Button"
import React from "react"

export function CallToActionSection() {
  return (
    <section className="py-10 glass text-gray-700 text-primary-foreground">
      <div className=" flex flex-col gap-3 mx-auto text-center">
        <h2 className="text-lg md:text-2xl font-bold">Ready to Join Our Community?</h2>
        <p className="sm:text-lg text-xs leading-relaxed opacity-90">
          {
            "Discover the opportunities that await you at Excellence University. Whether you're a prospective student, researcher, or partner, we invite you to be part of our journey."
          }
        </p>

        <div>
          <Button className="px-6 py-2 sm:text-sm text-xs"
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
