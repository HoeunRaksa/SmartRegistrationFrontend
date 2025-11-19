import React from "react"
import { Card, CardContent } from "./ui/Card"
import milestone from "../Data/Milestones.json"

export function HistorySection() {
  return (
    <section className="py-10 my-5 glass shadow-sm rounded-lg">
      <div className="mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-xl sm:text-2xl text-gray-700 font-bold py-5 text-balance">
            {milestone.header.title}
          </h2>
          <p className="sm:text-sm text-xs text-muted-foreground text-gray-700 max-w-3xl mx-auto text-pretty leading-relaxed">
            {milestone.header.dedicated}
          </p>  
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestone.timeline.map((item, index) => (
            <Card
              key={index}
              className="bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6 text-start">
                <div className="flex items-center gap-3 p-3 w-full">
                <div className="sm:text-5xl sm:mb-4 sm:mt-4 text-2xl mx-2">{item.icon}</div>
                <div className="sm:text-xl text-sm font-bold ">{item.year}</div>
                </div>
                <h3 className="sm:text-sm text-xs font-bold text-gray-700 mb-3">{item.title}</h3>
                <p className="sm:text-sm text-xs text-gray-700 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
