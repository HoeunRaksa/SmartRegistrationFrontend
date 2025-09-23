import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card";
import { HeroSection } from "../Components/HeroSection";
import { HistorySection } from "../Components/HistorySection";
import { CallToActionSection } from "../Components/CallToActionSection";
import { Footer } from "../Components/Footer";
import { MissionSection } from "../Components/MissionSection";
import milestone from "../Data/Milestones.json"

const AbouteUs = () => {
  return (
    <div>
      <main className="min-h-screen">
        <HeroSection />
        <HistorySection />
        <MissionSection />
      </main>

        <section className="py-20 bg-muted">
          <div className="container text-white mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Academic Excellence</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                Our commitment to excellence is reflected in our achievements, recognition, and the success of our graduates
                who are making a difference worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {milestone.achievements.map((achievement, index) => (
                <Card key={index} className="bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video mt-4 overflow-hidden">
                    <img
                      src={achievement.image || "/placeholder.svg"}
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-primary mb-2">{achievement.count}</div>
                    <h3 className="text-xl font-semibold mb-3">{achievement.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default AbouteUs;