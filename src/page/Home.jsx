import LandImg from "../../public/Images/download1.png";
import "../App.css";
import Program from "../Components/Programs";
import ResearchSection from "../Components/ResearchSection ";
import CampusLife from "../Components/CampusLifeSection";
import milestone from "../Data/Milestones.json";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card";
import { ApiBaseImg } from "../Configration";

const Home = () => {
    return (
        <section className="w-full min-h-screen relative overflow-hidden ">
            <div className="w-full grid sm:grid-cols-2 sx:grid-cols-2 justify-center gap-6 px-4 md:px-16 py-8 my-6 glass rounded-lg">
                {/* Text Section */}
                <div className="flex space-y-4 flex-col md:items-start sm:pt-[20%] pt-3 md:text-left ">
                    <p className="font-bold sm:text-2xl md:text-4xl lg:text-7xl xl:text-8xl text-2xl text-gray-700">
                        Welcome <span className="text-orange-500"> To</span> <span className="text-orange-500">NovaTech </span> University
                    </p>
                    <p className="sm:text-2xl text-sm text-gray-600">
                        Embark on your journey to academic excellence and groundbreaking achievements today!
                    </p>
                    <p className="font-medium sm:text-xl sx:hidden text-gray-700">
                        Explore transformative programs, collaborate with visionary minds, and develop the skills to shape the future.
                        Your path to success begins here at <span className="text-orange-500">NovaTech University</span>.
                    </p>
                    <div className="flex space-x-4 pt-4 justify-start">
                        <button className=" bg-orange-500 py-4 px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 duration-200 text-white cursor-pointer">
                            Get Started
                        </button>
                        <button className=" text-gray-700 py-4 px-8 rounded font-semibold shadow border-2 glass hover:shadow-lg transition-all hover:scale-105 duration-200 cursor-pointer">
                            Learn More
                        </button>
                    </div>
                    <div className="flex gap-8 items-center justify-center mt-6">
                        <div className="text-center">
                            <p className="text-orange-600 sm:text-3xl text-xl font-bold">500K+</p>
                            <span className="text-gray-700 sm:text-xl text-sm">Students</span>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 sm:text-3xl text-xl font-bold">200+</p>
                            <span className="text-gray-700 sm:text-xl text-sm">Programs</span>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 sm:text-3xl text-xl font-bold">95%</p>
                            <span className="text-gray-700 sm:text-xl text-sm">Satisfaction Rate</span>
                        </div>
                    </div>

                </div>
                {/* Image Section */}
                <div className="flex justify-center items-center pt-[10%]">
                    <img src={LandImg} alt="University Campus" className=" h-auto rounded min-h-[300px] min-w-[300px]" />
                </div>
            </div>
            <Program />
              <section className="py-20 bg-muted">
                      <div className="container text-gray-700 mx-auto px-6">
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
                                   src={`${ApiBaseImg}${achievement.image}`} 
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
            <ResearchSection  />
            <CampusLife />
        </section>
    );
};
export default Home;