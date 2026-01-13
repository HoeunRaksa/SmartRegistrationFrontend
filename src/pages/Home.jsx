import "../App.css";
import Program from "../Components/home/Programs";
import milestone from "../Data/Milestones.json";
import { motion } from "framer-motion";

// Direct imports for better performance
import academic from "@/assets/images/academic.png";
import character from "@/assets/images/character.png";
import doctor from "@/assets/images/doctor.png";
import data_analysits from "@/assets/images/data_analysits.png";
import best_university from "@/assets/images/best_university.png";

// Image mapping for achievements
const imageMap = {
  "doctor.png": doctor,
  "data_analysits.png": data_analysits,
  "best_university.png": best_university
};

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden ">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 opacity-30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gray-800">Welcome </span>
              <span className="text-gray-700">To </span>
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                NovaTech
              </span>
              <span className="text-gray-800"> University</span>
            </motion.h1>

            <motion.div
              className="backdrop-blur-2xl bg-white/50 p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                Embark on your journey to academic excellence and groundbreaking achievements today!
              </p>
            </motion.div>

            <motion.div
              className="backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/20 p-6 rounded-3xl border border-white/50 shadow-xl hidden sm:block hover:shadow-2xl transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-light leading-relaxed">
                At NovaTech University, we empower students through innovative programs, cutting-edge research,
                and hands-on learning experiences. Collaborate with visionary thinkers, explore transformative ideas, and develop the skills,
                knowledge, and leadership needed to shape the future in a rapidly evolving world.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button className="relative backdrop-blur-2xl bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white py-4 px-8 rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.5)] transition-all duration-500 hover:scale-105 border border-white/30 overflow-hidden group">
                <span className="relative z-10 font-semibold">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              <button className="relative backdrop-blur-2xl bg-white/60 text-gray-800 py-4 px-8 rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] transition-all duration-500 hover:scale-105 border border-white/60 overflow-hidden group">
                <span className="relative z-10 font-semibold">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </motion.div>

            <motion.div
              className="flex justify-center sm:justify-start gap-4 sm:gap-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {[
                { number: "500K+", label: "Students" },
                { number: "200+", label: "Programs" },
                { number: "95%", label: "Satisfaction" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/40 px-4 sm:px-6 py-4 rounded-2xl border border-white/50 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <p className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="group relative backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 p-6 rounded-full border-2 border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_rgba(139,92,246,0.4)] transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img
                src={character}
                alt="University Campus"
                className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg rounded-full transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Academic Section */}
        <section className="py-16 mt-10 max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row-reverse items-center justify-center gap-8 sm:gap-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            {/* Text */}
            <div className="text-center sm:text-left sm:w-1/2">
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  Academic Excellence
                </span>
              </motion.h2>

              <motion.div
                className="backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/40 p-6 sm:p-8 rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_rgba(139,92,246,0.3)] transition-all duration-500 hover:scale-[1.02]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-light">
                  Our commitment to academic excellence is demonstrated through
                  a strong culture of innovation, rigorous scholarship, and continuous
                  improvement. We take pride in our nationally and internationally recognized
                  achievements, outstanding faculty, and a curriculum designed to meet global
                  standards. Our graduates emerge as confident professionals and lifelong learners,
                  making meaningful contributions across industries, communities, and societies worldwide.
                </p>
              </motion.div>
            </div>

            {/* Image */}
            <div className="sm:w-1/2 max-w-xs sm:max-w-sm md:max-w-md transform scale-x-[-1]">
              <motion.div
                className="group relative backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 p-6 rounded-full border-2 border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_rgba(59,130,246,0.4)] transition-all duration-700 hover:scale-105"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img
                  src={academic}
                  alt="Academic"
                  className="relative z-10 w-full h-auto rounded-full"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Milestones */}
        <section className="py-16 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                Our Achievements
              </span>
            </motion.h2>

            <motion.div
              className="backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 p-6 rounded-3xl border border-white/60 shadow-xl max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-light px-4">
                Our commitment to academic excellence is demonstrated through
                a strong culture of innovation, rigorous scholarship, and continuous
                improvement. We take pride in our nationally and internationally recognized
                achievements, outstanding faculty, and a curriculum designed to meet global
                standards.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {milestone.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/60 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_rgba(139,92,246,0.4)] transition-all duration-500 overflow-hidden h-full">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none" />

                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden rounded-t-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10" />
                    <img
                      src={imageMap[achievement.image]}
                      alt={achievement.title}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 flex flex-col gap-3">
                    <div className="backdrop-blur-xl bg-white/50 p-3 rounded-2xl border border-white/60 inline-flex items-center justify-center w-fit shadow-lg">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {achievement.count}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                      {achievement.title}
                    </h3>

                    <div className="backdrop-blur-xl bg-white/40 p-4 rounded-2xl border border-white/50">
                      <p className="text-sm text-gray-700 font-light leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
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