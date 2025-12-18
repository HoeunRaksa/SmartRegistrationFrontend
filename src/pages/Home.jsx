import "../App.css";
import Program from "../Components/home/Programs";
import milestone from "../Data/Milestones.json";
import { Card, CardContent } from "../Components/ui/Card";
import character from "../assets/images/character.png";
import { ApiBaseImg } from "../config/Configration";
import acadami from "../assets/images/academic.png"
const Home = () => {
  return (
    <section className="min-h-screen">
      <div className=" grid sm:grid-cols-2 sx:grid-cols-2 justify-evenly p-[5%] grid-flow-row-reverse ">
        <div className="flex flex-col md:items-start justify-start items-start">
          <p className="font sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-4xl text-gray-700 py-10 font-bold sm:text-start text-center">
            Welcome <span className="text-gray-700"> To</span> <span className="text-orange-500">NovaTech </span> University
          </p>
          <p className="lg:text-xl font-medium   text-gray-700">
            Embark on your journey to academic excellence and groundbreaking achievements today!
          </p>
          <p className="font-medium lg:text-xl sx:hidden text-gray-700">
            Explore transformative programs, collaborate with visionary minds, and develop the skills to shape the future.
            Your path to success begins here at <span className="text-gray-700">NovaTech University</span>.
          </p>
          <div className="flex space-x-4 pt-4 justify-center">
            <button className=" bg-gradient-to-br from-red-300 to-blue-400 sm:py-4 py-2 sm:px-6 px-10 sm:rounded-lg lg:text-sm  rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 duration-200 text-white cursor-pointer">
              Get Started
            </button>
            <button className=" bg-gradient-to-br from-pink-300 to-gray-300 text-gray-800  sm:py-4 py-2 px-10 sm:px-6 sm:rounded-lg lg:text-sm  rounded-lg shadow hover:shadow-lg transition-all hover:scale-105 duration-200 cursor-pointer">
              Learn More
            </button>
          </div>
          <div className="flex gap-8 items-center justify-center mt-6">
            <div className="text-center">
              <p className="text-gray-700 lg:text-sm  font">500K+</p>
              <span className="text-gray-700 sm:text-sm ">Students</span>
            </div>
            <div className="text-center">
              <p className="text-gray-700 lg:text-sm  font">200+</p>
              <span className="text-gray-700 sm:text-sm ">Programs</span>
            </div>
            <div className="text-center">
              <p className="text-gray-700 lg:text-sm  font">95%</p>
              <span className="text-gray-700 sm:text-sm ">Satisfaction Rate</span>
            </div>
          </div>

        </div>
        {/* Image Section */}
        <div className="flex justify-center items-center">
          <img src={character} alt="University Campus" className="w-full" />
        </div>
      </div>

      <section className="py-10 rounded-3xl">
        <div className=" text-gray-700px-6">
          <div className="text-gray-700  px-6">
            <div className="flex sm:flex-row-reverse flex-col justify-center items-center">
              {/* Text */}
              <div className="text-center w-full">
                <h2 className="header-text">Academic Excellence</h2>
                <p className="sm:text-xl text-lg font-medium max-w-3xl mx-auto text-pretty leading-relaxed opacity-80">
                  Our commitment to excellence is reflected in our achievements, recognition, and the success of our graduates
                  who are making a difference worldwide.
                </p>
              </div>

              {/* Image */}
              <div className="transform scale-x-[-1] max-w-150 relative">
                <img src={acadami} alt="Acadami" className="w-full" />
              </div>
            </div>
          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-10 sm:p-20 p-2">
            {milestone.achievements.map((achievement, index) => (
              <Card key={index} className="overflow-hidden glass hover:shadow-lg transition-shadow duration-300 group relative">
                <div className="aspect-video">
                  <img
                    src={`${ApiBaseImg}${achievement.image}`}
                    alt={achievement.title}
                    className="max-w-100 w-100 object-cover"
                  />
                </div>
                <CardContent className="py-30 absolute sm:-bottom-54 -bottom-61 group-hover:-bottom-1 transition-all duration-500 glass flex flex-col justify-center">
                  <h3 className="sm:text-xl text-sm mb-3 font-semibold text-gray-700">{achievement.title}</h3>
                  <p className="lg:text-lg text-sm opacity-80">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>
      <Program />
    </section>
  );
};
export default Home;