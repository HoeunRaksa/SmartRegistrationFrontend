import LandImg from "../assets/Images/download1.png";
import "../App.css";
import { HistorySection } from "../Components/HistorySection";
import { MissionSection } from "../Components/MissionSection";
const Home = () => {
    return (
        <section className="w-full min-h-screen rounded relative overflow-hidden">
            <div className="w-full grid sm:grid-cols-2 sx:grid-cols-2 justify-center gap-6 px-4 md:px-16 py-8">
                {/* Text Section */}
                <div className="flex space-y-4 flex-col md:items-start sm:pt-[25%] pt-3 md:text-left ">
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
                        <button className=" bg-orange-500 py-4 px-8 rounded font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 duration-200 text-white cursor-pointer">
                            Get Started
                        </button>
                        <button className=" text-gray-700 py-4 px-8 rounded font-semibold shadow border-2 border-white bg-white hover:shadow-lg transition-all hover:scale-105 duration-200 cursor-pointer">
                            Learn More
                        </button>
                    </div>
                    <div className="flex gap-8 items-center justify-center mt-6">
                        <div className="text-center">
                            <p className="text-orange-600 text-3xl font-bold">500K+</p>
                            <span className="text-gray-700 text-xl">Students</span>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 text-3xl font-bold">200+</p>
                            <span className="text-gray-700 text-xl">Programs</span>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 text-3xl font-bold">95%</p>
                            <span className="text-gray-700 text-xl">Satisfaction Rate</span>
                        </div>
                    </div>

                </div>
                {/* Image Section */}
                <div className="flex justify-center items-center pt-[10%]">
                    <img src={LandImg} alt="University Campus" className=" h-auto rounded min-h-[300px] min-w-[300px]" />
                </div>
            </div>
              <div className="min-h-screen">
                    <HistorySection />
                    <MissionSection />
                  </div>
        </section>
    );
};
export default Home;