import "../App.css";
import Program from "../Components/home/Programs";
import milestone from "../Data/Milestones.json";
import { Card } from "../Components/ui/Card";
import character from "../../public/assets/images/character.png";
import { ApiBaseImg } from "../config/Configration";
import acadami from "../../public/assets/images/academic.png";
import { motion } from "framer-motion";
import { useState } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

const AchievementCard = ({ achievement, index }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div
      key={index}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      <Card className="relative rounded-3xl overflow-hidden ">
        {/* Image */}
        <motion.div
          className="aspect-video w-full overflow-hidden rounded-3xl"
          whileHover={{ scale: 1.05, rotateY: 5 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <img
            src={`${ApiBaseImg}${achievement.image}`}
            alt={achievement.title}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        </motion.div>

        {/* Overlay Content */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 p-6 bg-white  rounded-t-2xl flex flex-col gap-2 transition-all duration-500 ${
            showInfo ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <h3 className="text-lg font-bold text-gray-800">{achievement.title}</h3>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </motion.div>

        {/* Button to toggle overlay */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg  hover:bg-blue-600 transition-all"
        >
          {showInfo ? "Hide Info" : "View Info"}
        </button>
      </Card>
    </motion.div>
  );
};

const Home = () => {
  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="flex flex-col-reverse md:flex-row items-center justify- px-6 sm:px-12 lg:px-20 py-10 gap-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Text */}
        <div className="flex flex-col justify-center text-center md:text-left md:w-1/2 gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
            Welcome <span className="text-gray-700">To</span>{" "}
            <span className="text-orange-500">NovaTech</span> University
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Embark on your journey to academic excellence and groundbreaking achievements today!
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 opacity-90 hidden sm:block">
            Explore transformative programs, collaborate with visionary minds, and develop the skills to shape the future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mt-4">
            <button className="bg-gradient-to-br from-red-300 to-blue-400 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
              Get Started
            </button>
            <button className="bg-gradient-to-br from-pink-300 to-gray-300 text-gray-800 py-3 px-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105">
              Learn More
            </button>
          </div>
          <div className="flex justify-center sm:justify-start gap-6 mt-6 text-gray-700">
            <div className="text-center">
              <p className="font-semibold text-lg sm:text-sm">500K+</p>
              <span className="text-sm">Students</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg sm:text-sm">200+</p>
              <span className="text-sm">Programs</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg sm:text-sm">95%</p>
              <span className="text-sm">Satisfaction Rate</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <motion.div className="md:w-1/2 flex justify-center " initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
          <img src={character} alt="University Campus" className="w-full bg-green-300 rounded-full max-w-sm sm:max-w-md md:max-w-lg transition-transform duration-500 hover:scale-105" />
        </motion.div>
      </motion.div>

      {/* Academic Section */}
      <section className="py-16 px-6 sm:px-12 lg:px-20  rounded-3xl mt-10">
        <motion.div
          className="flex flex-col sm:flex-row-reverse items-center justify-center gap-8 sm:gap-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          {/* Text */}
          <div className="text-center sm:text-left sm:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Academic Excellence
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed opacity-90">
              Our commitment to excellence is reflected in our achievements, recognition, and the success of our graduates who are making a difference worldwide.
            </p>
          </div>

          {/* Image */}
          <div className="sm:w-1/2 max-w-xs sm:max-w-sm md:max-w-md transform scale-x-[-1]">
            <motion.img
              src={acadami}
              alt="Acadami"
              className="w-full h-auto bg-amber-200 rounded-full transition-transform duration-500 hover:scale-105"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>
      </section>

      {/* Milestones */}
      <section className="py-16 px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestone.achievements.map((achievement, index) => (
            <AchievementCard key={index} achievement={achievement} index={index} />
          ))}
        </div>
      </section>

      <Program />
    </section>
  );
};

export default Home;
