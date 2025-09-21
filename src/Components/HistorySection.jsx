import React from "react"
import { Card, CardContent } from "./ui/Card"
import milestone from "../Data/Milestones.json"

export function HistorySection() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-white font-bold mb-6 text-balance">
            {milestone.header.title}
          </h2>
          <p className="text-xl text-muted-foreground text-white max-w-3xl mx-auto text-pretty leading-relaxed">
            {milestone.header.dedicated}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestone.timeline.map((item, index) => (
            <Card
              key={index}
              className="bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-2xl font-bold text-primary mb-2">{item.year}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
