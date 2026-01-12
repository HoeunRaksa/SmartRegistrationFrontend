import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const headerImage = "public/assets/images/curriculum.png";

export const programs = {
  AiResearcher: {
    icon: "🤖",
    iconColor: "from-teal-500 to-cyan-500",
    title: "AI Researcher",
    description: "Explore the forefront of artificial intelligence and machine learning.",
    items: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Robotics"],
  },
  BusinessEconomics: {
    icon: "💼",
    iconColor: "from-yellow-500 to-orange-500",
    title: "Business & Economics",
    description: "Industry-leading business programs with global perspectives and practical experience.",
    items: ["MBA Programs", "International Business", "Finance & Banking", "Entrepreneurship"],
  },
  ArtsHumanities: {
    icon: "🎨",
    iconColor: "from-pink-500 to-rose-500",
    title: "Arts & Humanities",
    description: "Explore creativity and critical thinking through diverse cultural and artistic studies.",
    items: ["Literature", "History", "Philosophy", "Visual Arts"],
  },
  EnvironmentalLifeSciences: {
    icon: "🌿",
    iconColor: "from-green-500 to-emerald-500",
    title: "Environmental & Life Sciences",
    description: "Programs focused on sustainability, ecology, and life sciences research.",
    items: ["Ecology", "Marine Biology", "Sustainability Studies", "Genetics"],
  },
  LawSocialSciences: {
    icon: "⚖️",
    iconColor: "from-purple-500 to-indigo-500",
    title: "Law & Social Sciences",
    description: "Comprehensive programs preparing students for careers in law, governance, and society.",
    items: ["Law", "Political Science", "Sociology", "Public Policy"],
  },
  InformationTechnologyAI: {
    icon: "🖥️",
    iconColor: "from-indigo-500 to-blue-500",
    title: "Information Technology & AI",
    description: "Advanced IT programs and artificial intelligence research for the future of technology.",
    items: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing", "Software Engineering"],
  },
  HealthMedicine: {
    icon: "🏥",
    iconColor: "from-red-500 to-pink-500",
    title: "Health & Medicine",
    description: "Leading programs in medical sciences, healthcare, and public health.",
    items: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
  },
  HospitalityTourism: {
    icon: "✈️",
    iconColor: "from-sky-500 to-blue-500",
    title: "Hospitality & Tourism",
    description: "Prepare for global careers in hospitality, travel, and tourism management.",
    items: ["Hotel Management", "Tourism Studies", "Event Management", "Travel Operations"],
  },
  ScienceEngineering: {
    icon: "🧪",
    iconColor: "from-blue-600 to-purple-600",
    title: "Science & Engineering",
    description: "Cutting-edge research facilities and world-renowned faculty in STEM fields.",
    items: ["Computer Science", "Biomedical Engineering", "Environmental Science", "Data Analytics"],
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

const Curriculum = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.section 
        className="relative mt-5 rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6 sm:p-10">
          <div className="container mx-auto flex flex-col-reverse md:flex-row items-center md:justify-between gap-8">
            <div className="text-center md:text-left md:w-1/2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Unlock Your Potential with Our Programs
              </h1>
              <p className="text-lg sm:text-xl mb-6 leading-relaxed text-gray-700 font-light">
                Dive into world-class education and research opportunities designed to equip you with skills for tomorrow's careers.
              </p>
              <Link
                to="/curriculum"
                className="inline-block backdrop-blur-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 font-semibold"
              >
                Explore Programs
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                className="backdrop-blur-xl bg-white/30 p-4 rounded-3xl border border-white/20 shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={headerImage}
                  alt="Education Hero"
                  className="w-full rounded-2xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Programs Section */}
      <section className="py-10 my-8">
        <div className="mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              World-Class Academic Programs
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed max-w-4xl mx-auto text-gray-700 font-light">
              Discover our comprehensive range of undergraduate, graduate, and doctoral
              programs designed to prepare you for success in the global marketplace.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 p-4">
            {Object.entries(programs).map(([key, program], i) => (
              <motion.div
                key={key}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
              >
                <div className="relative flex flex-col h-full rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/20 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] group">
                  {/* Gradient top accent */}
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${program.iconColor}`} />
                  
                  {/* Hover glow */}
                  <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />

                  <div className="relative flex flex-col h-full p-6 lg:p-8">
                    {/* Icon */}
                    <div className={`text-4xl mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${program.iconColor} shadow-lg`}>
                      {program.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 lg:text-lg text-base mb-4 leading-relaxed font-light">
                      {program.description}
                    </p>

                    {/* Items */}
                    <ul className="mb-6 space-y-2 text-gray-700 text-sm sm:text-base">
                      {program.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
                          <span className="font-light">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Learn More */}
                    <Link
                      to={`/curriculum/${encodeURIComponent(key)}`}
                      className="mt-auto inline-flex items-center gap-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:gap-4 transition-all duration-300 text-sm sm:text-base lg:text-lg"
                    >
                      Learn More <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Curriculum;