import "../App.css";
import Program from "../Components/home/Programs";
import milestone from "../Data/Milestones.json";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDepartments } from "../api/department_api";
import { Card, Card3D, FloatingCard3D } from "../Components/ui/Card";
import { Button, Button3D } from "../Components/ui/Button";
import "../styles/3d-effects.css";

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

// Why Choose Us data
const whyChooseUs = [
  {
    icon: "🎓",
    title: "World-Class Faculty",
    description: "Learn from distinguished professors and industry experts with decades of experience in their fields.",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: "🔬",
    title: "Cutting-Edge Research",
    description: "Access state-of-the-art laboratories and participate in groundbreaking research projects.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: "🌍",
    title: "Global Network",
    description: "Join our international community with partnerships across 50+ countries worldwide.",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: "💼",
    title: "Career Success",
    description: "95% employment rate within 6 months of graduation with top global companies.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: "🏛️",
    title: "Modern Campus",
    description: "Study in our modern, eco-friendly campus with world-class facilities and amenities.",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: "🤝",
    title: "Industry Partnerships",
    description: "Benefit from internship and job opportunities with 500+ partner companies.",
    gradient: "from-blue-500 to-purple-500"
  }
];

// Campus facilities data
const campusFacilities = [
  { name: "Research Centers", count: "25+", icon: "🔬" },
  { name: "Libraries", count: "12", icon: "📚" },
  { name: "Sports Complexes", count: "8", icon: "🏟️" },
  { name: "Dining Halls", count: "15", icon: "🍽️" },
  { name: "Student Housing", count: "20", icon: "🏠" },
  { name: "Computer Labs", count: "50+", icon: "💻" }
];

// News and events data
const newsEvents = [
  {
    type: "event",
    title: "Open House 2025",
    date: "March 15, 2025",
    description: "Explore our campus and meet faculty members during our annual open house event."
  },
  {
    type: "news",
    title: "New AI Research Center",
    date: "February 28, 2025",
    description: "NovaTech University launches state-of-the-art Artificial Intelligence research facility."
  },
  {
    type: "event",
    title: "International Conference",
    date: "April 5-7, 2025",
    description: "Join global leaders for our annual International Technology and Innovation Summit."
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Alumni, Class of 2020",
    company: "Google AI Research",
    quote: "NovaTech University provided me with the foundation to pursue my dreams in AI research. The faculty mentorship was exceptional.",
    avatar: "👩‍🔬"
  },
  {
    name: "James Rodriguez",
    role: "Current Student",
    company: "Computer Science Major",
    quote: "The hands-on learning approach and industry connections have prepared me for real-world challenges.",
    avatar: "👨‍💻"
  },
  {
    name: "Prof. Michael Anderson",
    role: "Department Head",
    company: "Engineering Faculty",
    quote: "Our commitment to excellence in education drives innovation and shapes future leaders.",
    avatar: "👨‍🏫"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_departments: 0,
    total_majors: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchDepartments();
        if (response.data) {
          const departments = response.data.data || response.data || [];
          // Calculate total majors from departments if available
          const totalMajors = departments.reduce((sum, dept) => sum + (dept.majors_count || dept.majors?.length || 0), 0);
          setStats({
            total_departments: departments.length,
            total_majors: totalMajors || departments.length * 4 // Fallback estimate
          });
        }
      } catch (error) {
        console.error("Error loading statistics:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden ">

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
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
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
              className="flex flex-col sm:flex-row justify-center sm:justify-start gap-6 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                variant="primary"
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 text-lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/aboutus')}
                className="px-12 py-5 text-lg"
              >
                Learn More
              </Button>
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
                <Card3D
                  key={index}
                  className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/40 px-4 sm:px-6 py-4 rounded-2xl border border-white/50 text-center shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <p className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {stat.label}
                  </span>
                </Card3D>
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
            <FloatingCard3D className="group relative backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 p-8 rounded-full border-2 border-white/60 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <img
                src={character}
                alt="University Character"
                className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-xl transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
            </FloatingCard3D>
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
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
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
              <Card3D
                className="group relative backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 p-6 rounded-full border-2 border-white/60 shadow-2xl"
                hover3D={true}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img
                  src={academic}
                  alt="Academic"
                  className="relative z-10 w-full h-auto rounded-full"
                  loading="lazy"
                />
              </Card3D>
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
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
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
              <Card3D
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
                className="group cursor-pointer h-full"
                hover3D={true}
              >
                <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/60 rounded-3xl shadow-xl overflow-hidden">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />

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
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
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
              </Card3D>
            ))}
          </div>
        </section>

        <div id="programs">
          <Program />
        </div>

        {/* Why Choose Us Section */}
        <section className="py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-white/50">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                  Why NovaTech University
                </span>
              </div>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
                Why Choose Us?
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 p-6 rounded-3xl border border-white/60 shadow-xl max-w-4xl mx-auto"
            >
              <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-light">
                At NovaTech University, we combine academic excellence with real-world experience,
                preparing students to lead and innovate in an ever-changing global landscape.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {whyChooseUs.map((item, index) => (
              <Card3D
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
                className="group cursor-pointer h-full"
                hover3D={true}
              >
                <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/60 rounded-3xl shadow-xl overflow-hidden p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />

                  <div className="w-16 h-16 backdrop-blur-xl bg-white/60 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white/80">
                    <span className="text-3xl">{item.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light">{item.description}</p>
                </div>
              </Card3D>
            ))}
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-3xl p-10 md:p-16 border-2 border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                  University at a Glance
                </h2>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto font-light">
                  Our numbers speak for themselves - decades of excellence in education and research
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[
                  { number: stats.total_departments > 0 ? `${stats.total_departments}+` : "50+", label: "Departments", icon: "🏛️" },
                  { number: stats.total_majors > 0 ? `${stats.total_majors}+` : "200+", label: "Programs", icon: "📚" },
                  { number: "500K+", label: "Alumni Worldwide", icon: "🌍" },
                  { number: "95%", label: "Employment Rate", icon: "💼" },
                  { number: "150+", label: "Research Centers", icon: "🔬" },
                  { number: "50+", label: "Global Partners", icon: "🤝" },
                  { number: "1000+", label: "Faculty Members", icon: "👨‍🏫" },
                  { number: "$500M+", label: "Research Funding", icon: "💰" }
                ].map((stat, index) => (
                  <Card3D
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 text-center border border-white/80 hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-lg"
                    hover3D={true}
                  >
                    <span className="text-3xl mb-2 block">{stat.icon}</span>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </p>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  </Card3D>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Campus Facilities Section */}
        <section className="py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
                World-Class Facilities
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 p-6 rounded-3xl border border-white/60 shadow-xl max-w-4xl mx-auto"
            >
              <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-light">
                Our modern campus features state-of-the-art facilities designed to support
                learning, research, and student life in a sustainable environment.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {campusFacilities.map((facility, index) => (
              <Card3D
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 rounded-2xl p-6 text-center border-2 border-white/60 shadow-xl transition-all duration-300 cursor-pointer"
                hover3D={true}
              >
                <span className="text-4xl mb-3 block">{facility.icon}</span>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{facility.count}</p>
                <p className="text-gray-700 text-sm font-medium">{facility.name}</p>
              </Card3D>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
                What Our Community Says
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card3D
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-3xl p-8 border-2 border-white/60 shadow-xl transition-all duration-500"
                hover3D={true}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/60 flex items-center justify-center text-3xl shadow-lg border-2 border-white/80">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{testimonial.company}</p>
                  </div>
                </div>

                <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </Card3D>
            ))}
          </div>
        </section>

        {/* News & Events Section */}
        <section className="py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
                News & Events
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsEvents.map((item, index) => (
              <Card3D
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-3xl overflow-hidden border-2 border-white/60 shadow-xl transition-all duration-500 group cursor-pointer h-full"
                hover3D={true}
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl border border-white/60 shadow-sm ${item.type === 'event' ? 'bg-blue-50/50 text-blue-700' : 'bg-indigo-50/50 text-indigo-700'}`}>
                      {item.type === 'event' ? 'Event' : 'News'}
                    </span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>

                  <motion.span
                    className="inline-flex items-center gap-2 mt-4 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent text-sm"
                    whileHover={{ x: 5 }}
                  >
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.span>
                </div>
              </Card3D>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-3xl p-10 md:p-16 border-2 border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.15)] text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />

            <div className="relative z-10">
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                  Ready to Begin Your Journey?
                </span>
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Join thousands of students who have transformed their lives through education at NovaTech University.
                Applications are now open for the upcoming academic year.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/registration">
                  <Button variant="default" className="px-12 py-5 text-lg w-full sm:w-auto">
                    Apply Now
                  </Button>
                </Link>

                <Link to="/aboutus">
                  <Button variant="outline" className="px-12 py-5 text-lg w-full sm:w-auto">
                    Learn More About Us
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 flex flex-wrap justify-center gap-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">March 1</p>
                  <p className="text-sm text-gray-600">Early Decision Deadline</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">May 15</p>
                  <p className="text-sm text-gray-600">Regular Decision Deadline</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Aug 20</p>
                  <p className="text-sm text-gray-600">Fall Semester Begins</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </section>
    </div >
  );
};

export default Home;