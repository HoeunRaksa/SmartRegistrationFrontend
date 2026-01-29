import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchDepartments } from '../api/department_api';
import { Card3D, FloatingCard3D } from '../Components/ui/Card';
import { Button } from '../Components/ui/Button';
import "../styles/3d-effects.css";

// Leadership team data
const leadershipTeam = [
  {
    name: "Dr. Elizabeth Harrison",
    role: "President & Chancellor",
    description: "Leading NovaTech University with 25+ years of academic leadership experience in higher education.",
    avatar: "👩‍💼"
  },
  {
    name: "Prof. David Chen",
    role: "Provost & VP Academic Affairs",
    description: "Overseeing academic programs and ensuring excellence in teaching and research.",
    avatar: "👨‍🎓"
  },
  {
    name: "Dr. Maria Santos",
    role: "VP Research & Innovation",
    description: "Driving groundbreaking research initiatives and industry partnerships.",
    avatar: "👩‍🔬"
  },
  {
    name: "Mr. James Mitchell",
    role: "VP Administration & Finance",
    description: "Managing university operations and financial sustainability.",
    avatar: "👨‍💼"
  }
];

// Accreditation data
const accreditations = [
  { name: "Higher Learning Commission", abbr: "HLC", year: "Since 1952" },
  { name: "Association to Advance Collegiate Schools of Business", abbr: "AACSB", year: "Business" },
  { name: "Accreditation Board for Engineering and Technology", abbr: "ABET", year: "Engineering" },
  { name: "Commission on Collegiate Nursing Education", abbr: "CCNE", year: "Nursing" }
];

// Rankings data
const rankings = [
  { rank: "#45", category: "National Universities", source: "World University Rankings" },
  { rank: "#28", category: "Best Engineering Schools", source: "Engineering Weekly" },
  { rank: "#15", category: "Most Innovative Universities", source: "Innovation Index" },
  { rank: "#32", category: "Best Value Colleges", source: "Education Review" }
];

// Timeline data
const timeline = [
  { year: "1892", event: "University Founded", description: "NovaTech University was established with a mission to provide quality education." },
  { year: "1920", event: "First Graduate Programs", description: "Launched master's and doctoral programs in science and engineering." },
  { year: "1965", event: "Research Institute Opens", description: "Established our first dedicated research institute for advanced studies." },
  { year: "1990", event: "International Expansion", description: "Opened international campuses and established global partnerships." },
  { year: "2010", event: "Innovation Hub Launch", description: "Created a state-of-the-art innovation and entrepreneurship center." },
  { year: "2024", event: "AI Research Center", description: "Launched cutting-edge Artificial Intelligence research facility." }
];

// Research areas
const researchAreas = [
  { name: "Artificial Intelligence", icon: "🤖", projects: 45, funding: "$25M" },
  { name: "Biotechnology", icon: "🧬", projects: 38, funding: "$32M" },
  { name: "Sustainable Energy", icon: "🌱", projects: 52, funding: "$28M" },
  { name: "Space Science", icon: "🚀", projects: 22, funding: "$18M" },
  { name: "Medical Research", icon: "🏥", projects: 61, funding: "$45M" },
  { name: "Data Science", icon: "📊", projects: 33, funding: "$15M" }
];

const AboutUs = () => {
  const [stats, setStats] = useState({
    total_departments: 0,
    total_majors: 0
  });

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchDepartments();
        if (response.data) {
          const departments = response.data.data || response.data || [];
          const totalMajors = departments.reduce((sum, dept) => sum + (dept.majors_count || dept.majors?.length || 0), 0);
          setStats({
            total_departments: departments.length,
            total_majors: totalMajors || departments.length * 4
          });
        }
      } catch (error) {
        console.error("Error loading statistics:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50/30">

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 px-4 py-12 max-w-7xl mx-auto space-y-24">

        {/* Hero Section */}
        <section className="text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <div className="backdrop-blur-xl bg-white/50 px-6 py-2 rounded-full border border-white/60 shadow-lg">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                Est. 1892 • Excellence in Education
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-8 drop-shadow-sm tracking-tight leading-tight"
          >
            Empowering Future <br className="hidden md:block" /> Generations.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light mb-12"
          >
            We are dedicated to transforming minds, fostering innovation, and building a sustainable future through world-class education and research excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <FloatingCard3D className="mx-auto max-w-4xl">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 aspect-video group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                  alt="University Campus"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20 text-left">
                  <p className="text-white/80 font-medium text-lg mb-1">Our Campus</p>
                  <h3 className="text-3xl font-bold text-white">Where Ideas Come to Life</h3>
                </div>
              </div>
            </FloatingCard3D>
          </motion.div>
        </section>

        {/* Mission & Vision Section */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card3D className="h-full bg-white/70 backdrop-blur-2xl border-white/60" hover3D={true}>
            <div className="p-10 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-9xl">🎯</span>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner text-blue-600">
                🎯
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed flex-grow">
                To provide world-class education that nurtures critical thinking, fosters innovation, and prepares students to become leaders and change-makers in their communities and beyond. We are committed to inclusive excellence.
              </p>
            </div>
          </Card3D>

          <Card3D className="h-full bg-white/70 backdrop-blur-2xl border-white/60" hover3D={true}>
            <div className="p-10 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-9xl">👁️</span>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner text-purple-600">
                👁️
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed flex-grow">
                To be a globally recognized institution of higher learning, renowned for academic excellence and producing graduates who contribute meaningfully to solving the world's most pressing challenges through knowledge and character.
              </p>
            </div>
          </Card3D>
        </section>

        {/* Stats Section with Parallax Feel */}
        <section className="relative">
          <Card3D className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden border-none shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>

            <div className="relative z-10 p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Global Impact & Reach</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {[
                  { number: "130+", label: "Years History", icon: "🏛️" },
                  { number: stats.total_departments > 0 ? `${stats.total_departments}+` : "50+", label: "Departments", icon: "📚" },
                  { number: "50k+", label: "Alumni", icon: "🎓" },
                  { number: "$500M", label: "Research", icon: "🔬" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-4xl mb-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">{stat.icon}</div>
                    <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">{stat.number}</div>
                    <div className="text-blue-200 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card3D>
        </section>

        {/* Timeline Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">Our History</h2>
            <p className="text-xl text-gray-600 font-light">A legacy of innovation spanning three centuries.</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 via-purple-300 to-indigo-200 hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} w-full`}>
                    <Card3D className="bg-white/80 backdrop-blur-xl border-white/60 gen-z-card p-8 hover:border-purple-300/50 transition-colors">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 absolute top-4 right-8">{item.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">{item.event}</h3>
                      <p className="text-gray-600 relative z-10">{item.description}</p>
                    </Card3D>
                  </div>

                  <div className="w-12 h-12 bg-white rounded-full border-4 border-purple-100 shadow-xl flex items-center justify-center z-10 relative shrink-0">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  </div>

                  <div className="flex-1 w-full hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Cards */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">Leadership</h2>
            <p className="text-xl text-gray-600 font-light">Guiding us towards a brighter future.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((leader, index) => (
              <Card3D key={index} className="bg-white/60 backdrop-blur-lg border-white/50 text-center h-full" hover3D={true}>
                <div className="p-8 h-full flex flex-col items-center">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 p-1 shadow-lg">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl grayscale hover:grayscale-0 transition-all duration-300 cursor-default">
                      {leader.avatar}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-4">{leader.role}</div>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">{leader.description}</p>
                </div>
              </Card3D>
            ))}
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">Our Core Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "✨", title: "Excellence", txt: "Pursuing the highest standards in all endeavors." },
              { icon: "🤝", title: "Integrity", txt: "Upholding honesty and ethical conduct always." },
              { icon: "💡", title: "Innovation", txt: "Embracing creativity to drive progress." },
              { icon: "🌈", title: "Diversity", txt: "Celebrating differences and inclusivity." },
              { icon: "🧠", title: "Knowledge", txt: "Advancing understanding to benefit society." },
              { icon: "❤️", title: "Service", txt: "Commitment to serving our global community." }
            ].map((val, i) => (
              <Card3D key={i} className="bg-white/40 backdrop-blur-md border-white/40 hover:bg-white/60 transition-colors">
                <div className="p-8 flex items-start gap-4">
                  <span className="text-4xl bg-white/50 p-3 rounded-2xl shadow-sm">{val.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{val.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{val.txt}</p>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <Card3D className="bg-gradient-to-r from-blue-900 to-purple-900 text-white overflow-hidden shadow-2xl border-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="relative z-10 p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Join Our Community</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 font-light">
                Become part of a vibrant academic family dedicated to excellence, innovation, and making a positive impact on the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/registration">
                  <Button variant="default" className="px-10 py-4 text-lg bg-white text-purple-900 hover:bg-gray-100 border-none shadow-xl hover:shadow-2xl">
                    Apply Now
                  </Button>
                </Link>
                <Link to="/curriculum">
                  <Button variant="outline" className="px-10 py-4 text-lg border-white/30 text-white hover:bg-white/10">
                    View Programs
                  </Button>
                </Link>
              </div>
            </div>
          </Card3D>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;