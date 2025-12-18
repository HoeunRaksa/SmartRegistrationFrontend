import { Card, CardContent } from "../ui/Card";
import React from "react"
import milestone from "../../Data/Milestones.json"


export function MissionSection() {
  return (
    <section className="py-10 text-gray-700  rounded-lg front">
      <div className="mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-2xl text-gray-700 font-bold mb-6 text-balance header-text">Our Mission & Values</h2>
          <div className="max-w-4xl mx-auto">
            <p className="md:text-xl sm:text-sm text-xs mb-8 text-pretty leading-relaxed ">
              {
                "At Excellence University, our mission is to advance knowledge through innovative research, provide transformative educational experiences, and prepare students to become ethical leaders who will make a positive impact on the world."
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:p-20 p-6">
          {milestone.values.map((value, index) => (
            <Card key={index} className="glass hover:shadow-lg duration-300">
              <CardContent className="p-10 text-center">
                <div className="sm:text-5xl sm:mb-4 sm:mt-4 text-2xl mx-2">{value.icon}</div>
                <h3 className="sm:text-2xl text-gray-700 text-xl font-semibold mb-3 text-primary">{value.title}</h3>
                <p className="sm:text-xl text-xs leading-relaxed py-5">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
