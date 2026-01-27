import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchDepartments } from '../api/department_api';

const Card = ({ children, className = "" }) => (
  <div className={`backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-2xl ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  }),
};

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

const AbouteUs = () => {
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
    <div className="min-h-screen  relative overflow-hidden">

      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 mt-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-6">
            About Our University
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            Empowering minds, transforming futures, and building a better world through education, innovation, and research excellence.
          </p>
        </motion.section>

        {/* Mission & Vision Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="h-full"
              >
                <Card className="h-full transition-transform duration-300">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 backdrop-blur-xl bg-white/60 rounded-full flex items-center justify-center mb-6 shadow-xl border-2 border-white/80"
                    >
                      <span className="text-4xl text-blue-600">🎯</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
                      Our Mission
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg font-light">
                      To provide world-class education that nurtures critical thinking, fosters innovation, and prepares students to become leaders and change-makers in their communities and beyond.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="h-full"
              >
                <Card className="h-full transition-transform duration-300">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 backdrop-blur-xl bg-white/60 rounded-full flex items-center justify-center mb-6 shadow-xl border-2 border-white/80"
                    >
                      <span className="text-4xl text-indigo-600">👁️</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
                      Our Vision
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg font-light">
                      To be a globally recognized institution of higher learning, renowned for academic excellence and producing graduates who contribute meaningfully to solving the world's most pressing challenges.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* History Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
              Our History
            </h2>
            <p className="text-lg text-gray-600 font-light">
              A legacy of excellence spanning decades
            </p>
          </div>

          <Card className="hover:scale-[1.01] transition-transform duration-300">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed font-light">
                <p>
                  Founded with a vision to transform education and create opportunities for all, our university has grown from humble beginnings into a leading institution of higher learning. Our journey began with a small group of dedicated educators who believed in the power of knowledge to change lives.
                </p>
                <p>
                  Over the years, we have expanded our academic programs, built state-of-the-art facilities, and attracted distinguished faculty members from around the world. Our commitment to research excellence has led to groundbreaking discoveries and innovations.
                </p>
                <p>
                  Today, we stand proud as a vibrant academic community where students from diverse backgrounds come together to learn, grow, and prepare for successful careers. Our alumni network spans the globe.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Core Values Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 font-light">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎓", title: "Excellence", description: "We strive for the highest standards in all our academic and research endeavors.", gradient: "from-blue-500 to-cyan-500" },
              { icon: "🤝", title: "Integrity", description: "We uphold honesty, ethics, and transparency in all our actions and decisions.", gradient: "from-purple-500 to-blue-500" },
              { icon: "🌟", title: "Innovation", description: "We encourage creative thinking and embrace new ideas that drive progress.", gradient: "from-yellow-500 to-orange-500" },
              { icon: "🌍", title: "Diversity", description: "We celebrate differences and create an inclusive environment for all.", gradient: "from-green-500 to-teal-500" },
              { icon: "💡", title: "Knowledge", description: "We pursue learning and discovery to advance understanding and benefit society.", gradient: "from-pink-500 to-rose-500" },
              { icon: "🤲", title: "Service", description: "We are committed to serving our community and making a positive impact.", gradient: "from-indigo-500 to-purple-500" }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:scale-[1.05] transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 backdrop-blur-xl bg-white/60 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 border-2 border-white/80">
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* University Timeline Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
              Our Journey Through Time
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Key milestones that shaped our institution
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 rounded-full hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="hover:scale-[1.02] transition-transform duration-300 inline-block">
                      <CardContent className="p-6">
                        <span className="text-sm font-bold text-purple-600">{item.year}</span>
                        <h3 className="text-xl font-bold text-gray-800 mt-1">{item.event}</h3>
                        <p className="text-gray-600 font-light mt-2">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/60 flex items-center justify-center text-purple-600 font-bold shadow-lg z-10 shrink-0 border-2 border-white/80">
                    {item.year.slice(-2)}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Dedicated leaders driving our mission forward
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:scale-[1.05] transition-all duration-300 group text-center">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      className="w-20 h-20 mx-auto backdrop-blur-xl bg-white/60 rounded-full flex items-center justify-center mb-4 shadow-xl border-2 border-white/80"
                    >
                      <span className="text-4xl">{leader.avatar}</span>
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{leader.name}</h3>
                    <p className="text-sm font-semibold text-blue-600 mb-3">{leader.role}</p>
                    <p className="text-sm text-gray-600 font-light">{leader.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Research Excellence Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
              Research Excellence
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Pioneering discoveries that shape our world
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:scale-[1.05] transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 backdrop-blur-xl bg-white/60 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform border-2 border-white/80">
                        {area.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{area.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="backdrop-blur-xl bg-blue-500/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">{area.projects}</p>
                        <p className="text-xs text-gray-600">Active Projects</p>
                      </div>
                      <div className="backdrop-blur-xl bg-purple-500/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-indigo-600">{area.funding}</p>
                        <p className="text-xs text-gray-600">Annual Funding</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Accreditation & Rankings Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Accreditations */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">✓</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                      Accreditations
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {accreditations.map((acc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 backdrop-blur-xl bg-green-500/5 rounded-xl border border-green-200/50"
                      >
                        <div>
                          <p className="font-bold text-gray-800">{acc.abbr}</p>
                          <p className="text-sm text-gray-600">{acc.name}</p>
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {acc.year}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rankings */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 backdrop-blur-xl bg-white/60 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/80">
                      <span className="text-2xl text-green-600">✓</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                      Rankings & Recognition
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {rankings.map((ranking, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 backdrop-blur-xl bg-yellow-500/5 rounded-xl border border-yellow-200/50"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold text-white">{ranking.rank}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{ranking.category}</p>
                          <p className="text-sm text-gray-600">{ranking.source}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 rounded-3xl p-10 border-2 border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-2">
                NovaTech University at a Glance
              </h2>
              <p className="text-gray-700 font-light">Our impact in numbers</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "130+", label: "Years of Excellence", icon: "📅" },
                { number: stats.total_departments > 0 ? `${stats.total_departments}+` : "50+", label: "Academic Departments", icon: "🏛️" },
                { number: stats.total_majors > 0 ? `${stats.total_majors}+` : "200+", label: "Degree Programs", icon: "📚" },
                { number: "50+", label: "Countries Represented", icon: "🌍" },
                { number: "500K+", label: "Alumni Network", icon: "👥" },
                { number: "1000+", label: "Faculty Members", icon: "👨‍🏫" },
                { number: "250+", label: "Research Labs", icon: "🔬" },
                { number: "$500M+", label: "Research Funding", icon: "💰" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 text-center border border-white/80 hover:bg-white/80 transition-all duration-300 shadow-lg"
                >
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">{stat.number}</p>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="inline-block">
              <CardContent className="p-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
                  Join Our Community
                </h2>
                <p className="text-gray-700 mb-6 max-w-xl mx-auto font-light">
                  Become part of a vibrant academic community dedicated to excellence, innovation, and making a positive impact on the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/registration"
                    className="backdrop-blur-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Apply Now
                  </Link>
                  <Link
                    to="/curriculum"
                    className="backdrop-blur-xl bg-white/60 text-gray-800 font-semibold px-8 py-4 rounded-xl border-2 border-white/60 hover:bg-white/80 hover:scale-105 transition-all duration-300"
                  >
                    Explore Programs
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AbouteUs;