import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card.jsx";
import { HeroSection } from "../Components/HeroSection.jsx";
import { HistorySection } from "../Components/HistorySection.jsx";
import { CallToActionSection } from "../Components/CallToActionSection.jsx";
import { MissionSection } from "../Components/MissionSection.jsx";
import milestone from "../Data/Milestones.json"
import { ApiBaseImg } from "../Configration.jsx";
const AbouteUs = () => {
  return (
    <div className="my-4 mt-5">
      <main className="min-h-screen">
        <HeroSection />
        <HistorySection />
        <MissionSection />
      </main>
        <section className=" py-5 glass my-5 rounded-lg shadow-sm">
          <div className="text-gray-700 mx-auto px-6">
            <div className="text-center">
              <h2 className="sm:text-xl text-sm font-bold py-5 text-balance">Academic Excellence</h2>
              <p className="sm:text-sm text-xs max-w-3xl mx-auto text-pretty leading-relaxed">
                Our commitment to excellence is reflected in our achievements, recognition, and the success of our graduates
                who are making a difference worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8">
              {milestone.achievements.map((achievement, index) => (
                <Card key={index} className="glass shadow-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video p-5 overflow-hidden">
                    <img
                       src={`${ApiBaseImg}${achievement.image}`} 
                      alt={achievement.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="sm:text-xl text-sm font-bold text-primary mb-2">{achievement.count}</div>
                    <h3 className="sm:text-xl text-sm font-semibold mb-3">{achievement.title}</h3>
                    <p className="sm:text-xl text-xs leading-relaxed">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      <CallToActionSection />
    </div>
  );
};
export default AbouteUs;