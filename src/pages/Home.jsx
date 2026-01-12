import "../App.css";
import Program from "../Components/home/Programs";
import milestone from "../Data/Milestones.json";
import { ApiBaseImg } from "../config/Configration";
const acadami = "public/assets/images/academic.png";
import { motion } from "framer-motion";
const character ="public/assets/images/character.png";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

const Home = () => {
  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>

      <section className="relative z-10 min-h-screen sm:pt-20 px-4">
        {/* Hero Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center max-w-7xl mx-auto py-10 gap-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Text */}
          <div className="flex flex-col justify-center text-center md:text-left md:w-1/2 gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-gray-800">Welcome </span>
              <span className="text-gray-700">To </span>
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                NovaTech
              </span>
              <span className="text-gray-800"> University</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-light">
              Embark on your journey to academic excellence and groundbreaking achievements today!
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light hidden sm:block">
              Embark on your journey to academic excellence and groundbreaking achievements today.
              At NovaTech University, we empower students through innovative programs, cutting-edge research,
              and hands-on learning experiences. Collaborate with visionary thinkers, explore transformative ideas, and develop the skills,
              knowledge, and leadership needed to shape the future in a rapidly evolving world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mt-4">
              <button className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white py-3 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
                Get Started
              </button>
              <button className="backdrop-blur-xl bg-white/40 text-gray-800 py-3 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
                Learn More
              </button>
            </div>
            <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 mt-6 text-gray-700">
              <div className="backdrop-blur-xl bg-white/30 px-4 sm:px-6 py-3 rounded-2xl border border-white/20 text-center shadow-lg">
                <p className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500K+</p>
                <span className="text-xs sm:text-sm font-light">Students</span>
              </div>
              <div className="backdrop-blur-xl bg-white/30 px-4 sm:px-6 py-3 rounded-2xl border border-white/20 text-center shadow-lg">
                <p className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">200+</p>
                <span className="text-xs sm:text-sm font-light">Programs</span>
              </div>
              <div className="backdrop-blur-xl bg-white/30 px-4 sm:px-6 py-3 rounded-2xl border border-white/20 text-center shadow-lg">
                <p className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">95%</p>
                <span className="text-xs sm:text-sm font-light">Satisfaction Rate</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <motion.div 
            className="md:w-1/2 flex justify-center" 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="backdrop-blur-xl bg-white/30 p-4 rounded-full border border-white/20 shadow-2xl">
              <img 
                src={character} 
                alt="University Campus" 
                className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-full transition-transform duration-500 hover:scale-105" 
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Academic Section */}
        <section className="py-16 rounded-3xl mt-10 max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row-reverse items-center justify-center gap-8 sm:gap-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            {/* Text */}
            <div className="text-center sm:text-left sm:w-1/2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Academic Excellence
              </h2>
              <div className="backdrop-blur-xl bg-white/40 p-6 sm:p-8 rounded-3xl border border-white/20 shadow-xl">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                  Our commitment to academic excellence is demonstrated through
                  a strong culture of innovation, rigorous scholarship, and continuous
                  improvement. We take pride in our nationally and internationally recognized
                  achievements, outstanding faculty, and a curriculum designed to meet global
                  standards. Our graduates emerge as confident professionals and lifelong learners,
                  making meaningful contributions across industries, communities, and societies worldwide.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="sm:w-1/2 max-w-xs sm:max-w-sm md:max-w-md transform scale-x-[-1]">
              <motion.div
                className="backdrop-blur-xl bg-white/30 p-4 rounded-full border border-white/20 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={acadami}
                  alt="Academic"
                  className="w-full h-auto rounded-full transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Milestones */}
        <section className="py-16 max-w-7xl mx-auto rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Our Achievements
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-4xl mx-auto text-gray-700 leading-relaxed font-light px-4">
              Our commitment to academic excellence is demonstrated through
              a strong culture of innovation, rigorous scholarship, and continuous
              improvement. We take pride in our nationally and internationally recognized
              achievements, outstanding faculty, and a curriculum designed to meet global
              standards. Our graduates emerge as confident professionals and lifelong learners,
              making meaningful contributions across industries, communities, and societies worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {milestone.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`${ApiBaseImg}${achievement.image}`}
                      alt={achievement.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {achievement.count}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 uppercase">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Program />
      </section>
    </div>
  );
};

export default Home;