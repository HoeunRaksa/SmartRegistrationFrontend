import LandImg from "../../public/Images/download1.png";
import "../App.css";
import Program from "../Components/Programs";
import CampusLife from "../Components/CampusLifeSection";
import milestone from "../Data/Milestones.json";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card";
import { ApiBaseImg } from "../Configration";

const Home = () => {
  return (
    <section className="w-full min-h-screen relative overflow-hidden ">
      <div className="w-full grid sm:grid-cols-2 sx:grid-cols-2 justify-between gap-6 px-4 md:px-16 my-6 sm:py-20 py-5 glass rounded-lg">
        <div className="flex space-y-4 flex-col md:items-start justify-center  pt-3 p-2 md:text-left ">
          <p className="font-bold sm:text-2xl md:text-2xl lg:text-3xl xl:text-6xl text-2xl text-gray-700">
            Welcome <span className="text-orange-500"> To</span> <span className="text-orange-500">NovaTech </span> University
          </p>
          <p className="lg:text-sm text-xs text-gray-600">
            Embark on your journey to academic excellence and groundbreaking achievements today!
          </p>
          <p className="font-medium lg:text-sm text-xs sx:hidden text-gray-700">
            Explore transformative programs, collaborate with visionary minds, and develop the skills to shape the future.
            Your path to success begins here at <span className="text-orange-500">NovaTech University</span>.
          </p>
          <div className="flex space-x-4 pt-4 justify-evenly">
            <button className=" bg-orange-500 sm:py-4 sm:px-8 py-2 px-4 sm:rounded-lg lg:text-sm text-xs rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 duration-200 text-white cursor-pointer">
              Get Started
            </button>
            <button className=" text-gray-700 sm:py-4 sm:px-8 py-2 px-4 sm:rounded-lg lg:text-sm text-xs rounded-lg shadow border-2 glass hover:shadow-lg transition-all hover:scale-105 duration-200 cursor-pointer">
              Learn More
            </button>
          </div>
          <div className="flex gap-8 items-center justify-center mt-6">
            <div className="text-center">
              <p className="text-orange-600 lg:text-sm text-xs font-bold">500K+</p>
              <span className="text-gray-700 sm:text-sm text-xs">Students</span>
            </div>
            <div className="text-center">
              <p className="text-gray-500 lg:text-sm text-xs font-bold">200+</p>
              <span className="text-gray-700 sm:text-sm text-xs">Programs</span>
            </div>
            <div className="text-center">
              <p className="text-gray-500 lg:text-sm text-xs font-bold">95%</p>
              <span className="text-gray-700 sm:text-sm text-xs">Satisfaction Rate</span>
            </div>
          </div>

        </div>
        {/* Image Section */}
        <div className="flex justify-center items-center w-full">
          <img src={LandImg} alt="University Campus" className="rounded-[20px] xl:w-2/4 w-2/3 p-2 sm:ml-auto min-w-70" />
        </div>
      </div>

      <section className="py-10 glass">
        <div className=" text-gray-700 mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className=" md:text-2xl text-sm font-bold mb-6">Academic Excellence</h2>
            <p className="lg:text-sm text-xs max-w-3xl mx-auto text-pretty leading-relaxed">
              Our commitment to excellence is reflected in our achievements, recognition, and the success of our graduates
              who are making a difference worldwide.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
            {milestone.achievements.map((achievement, index) => (
              <Card key={index} className="glass shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video rounded-[50px]">
                  <img
                    src={`${ApiBaseImg}${achievement.image}`}
                    alt={achievement.title}
                    className="w-full object-cover rounded-[30px] p-4"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="sm:text-2xl text-sm font-semibold mb-2">{achievement.count}</div>
                  <h3 className="sm:text-xl text-sm mb-3">{achievement.title}</h3>
                  <p className="lg:text-sm text-xs">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Program />
      <CampusLife />
    </section>
  );
};
export default Home;