import { Card, CardContent } from "../Components/ui/Card";
import React from "react"
import milestone from "../Data/Milestones.json"


export function MissionSection() {
  return (
    <section className="py-10 text-gray-700 glass rounded-lg shadow-sm">
      <div className="mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-balance">Our Mission & Values</h2>
          <div className="max-w-4xl mx-auto">
            <p className="sm:text-sm text-xs mb-8 text-pretty leading-relaxed">
              {
                "At Excellence University, our mission is to advance knowledge through innovative research, provide transformative educational experiences, and prepare students to become ethical leaders who will make a positive impact on the world."
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestone.values.map((value, index) => (
            <Card key={index} className="bg-white hover:shadow-lg shadow-sm duration-300">
              <CardContent className="p-6 text-center">
                <div className="sm:text-5xl sm:mb-4 sm:mt-4 text-2xl mx-2">{value.icon}</div>
                <h3 className="sm:text-xl text-sm font-semibold mb-3 text-primary">{value.title}</h3>
                <p className="sm:text-sm text-xs leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
