import React from "react"
import { Card, CardContent } from "../ui/Card"
import milestone from "../../Data/Milestones.json"

export function HistorySection() {
  return (
    <section className="py-10 my-5  font text-gray-700  rounded-lg">
      <div className="mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="lg:text-3xl sm:text-2xl text-xl font-semibold text-whote font py-5 text-balance">
            {milestone.header.title}
          </h2>
          <p className="sm:text-xl text-lg text-gray-700 max-w-3xl mx-auto text-pretty leading-relaxed font-medium">
            {milestone.header.dedicated}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:p-20 p-2">
          {milestone.timeline.map((item, index) => (
            <Card
              key={index}
              className="glass hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6 text-start">
                <div className="flex items-center gap-3 p-3 w-full">
                  <div className="lg:text-4xl sm:text-2xl text-xl sm:mb-4 sm:mt-4 mx-2">{item.icon}</div>
                  <div className="md:text-2xl text-xl font text-gray-700 ">{item.year}</div>
                </div>
                <h3 className="sm:text-xl font mb-3 font-medium py-3">{item.title}</h3>
                <p className="sm:text-xl text-sm text-gray-700 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
