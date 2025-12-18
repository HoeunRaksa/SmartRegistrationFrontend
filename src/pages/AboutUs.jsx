import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card.jsx";
import { HistorySection } from "../Components/about/HistorySection.jsx";
import { MissionSection } from "../Components/about/MissionSection.jsx";
import milestone from "../Data/Milestones.json"
import { ApiBaseImg } from "../config/Configration.jsx";
const AbouteUs = () => {
  return (
    <div className="my-4 mt-5">
      <main className="min-h-screen">
        <HistorySection />
        <MissionSection />
      </main>
      <section className="py-5 my-5 rounded-lg font  text-gray-700">
        <div className="text-gray-700 mx-auto px-6">
          <div className="text-center">
            <h2 className="sm:text-2xl text-xl font-bold py-5 header-text">Academic Excellence</h2>
            <p className="sm:text-xl text-sm  font-medium max-w-3xl mx-auto py-2">
              Our commitment to excellence is reflected in our achievements, recognition, and the success of our graduates
              who are making a difference worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8 sm:p-20 p-2">
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
                  <div className="sm:text-xl text-gray-700 text-sm font-bold ">{achievement.count}</div>
                  <h3 className="text-lg text-gray-700 font-semibold py-3">{achievement.title}</h3>
                  <p className="text-sm  leading-relaxed">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default AbouteUs;