import { Card, CardContent } from "../Components/ui/Card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import headerImage from "../../public/assets/images/curriculum.png";

export const programs = {
  AiResearcher: {
    icon: "🤖",
    iconColor: "text-teal-500",
    title: "AI Researcher",
    description: "Explore the forefront of artificial intelligence and machine learning.",
    items: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Robotics"],
  },
  BusinessEconomics: {
    icon: "💼",
    iconColor: "text-yellow-600",
    title: "Business & Economics",
    description: "Industry-leading business programs with global perspectives and practical experience.",
    items: ["MBA Programs", "International Business", "Finance & Banking", "Entrepreneurship"],
  },
  ArtsHumanities: {
    icon: "🎨",
    iconColor: "text-pink-500",
    title: "Arts & Humanities",
    description: "Explore creativity and critical thinking through diverse cultural and artistic studies.",
    items: ["Literature", "History", "Philosophy", "Visual Arts"],
  },
  EnvironmentalLifeSciences: {
    icon: "🌿",
    iconColor: "text-green-600",
    title: "Environmental & Life Sciences",
    description: "Programs focused on sustainability, ecology, and life sciences research.",
    items: ["Ecology", "Marine Biology", "Sustainability Studies", "Genetics"],
  },
  LawSocialSciences: {
    icon: "⚖️",
    iconColor: "text-purple-600",
    title: "Law & Social Sciences",
    description: "Comprehensive programs preparing students for careers in law, governance, and society.",
    items: ["Law", "Political Science", "Sociology", "Public Policy"],
  },
  InformationTechnologyAI: {
    icon: "🖥️",
    iconColor: "text-indigo-600",
    title: "Information Technology & AI",
    description: "Advanced IT programs and artificial intelligence research for the future of technology.",
    items: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing", "Software Engineering"],
  },
  HealthMedicine: {
    icon: "🏥",
    iconColor: "text-red-600",
    title: "Health & Medicine",
    description: "Leading programs in medical sciences, healthcare, and public health.",
    items: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
  },
  HospitalityTourism: {
    icon: "✈️",
    iconColor: "text-teal-500",
    title: "Hospitality & Tourism",
    description: "Prepare for global careers in hospitality, travel, and tourism management.",
    items: ["Hotel Management", "Tourism Studies", "Event Management", "Travel Operations"],
  },
  ScienceEngineering: {
    icon: "🧪",
    iconColor: "text-blue-600",
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
    <div>
      {/* Hero Section */}
      <motion.section 
        className="relative text-gray-700 mt-5 rounded-3xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 py-10 flex flex-col-reverse md:flex-row items-center md:justify-between">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="header-text">
              Unlock Your Potential with Our Programs
            </h1>
            <p className="sm:text-xl text-xs mb-6 leading-relaxed font-medium">
              Dive into world-class education and research opportunities designed to equip you with skills for tomorrow’s careers.
            </p>
            <Link
              to="/curriculum"
              className="inline-block bg-gradient-to-br from-red-400 to-blue-600 text-white px-6 py-3 sm:text-sm text-xs rounded-lg shadow-lg hover:bg-gray-100 transition-all font"
            >
              Explore Programs
            </Link>
          </div>
          <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
            <motion.img
              src={`${headerImage}`}
              alt="Education Hero"
              className="w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Programs Section */}
      <section className="py-20 my-4 text-gray-700 rounded-3xl">
        <div className="mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="sm:text-5xl text-xl md:text-5xl font mb-6 text-balance header-text">
              World-Class Academic Programs
            </h2>
            <p className="lg:text-xl sm:text-sm text-xs mb-8 text-pretty leading-relaxed max-w-4xl mx-auto font-medium">
              Discover our comprehensive range of undergraduate, graduate, and doctoral
              programs designed to prepare you for success in the global marketplace.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:p-20 p-4">
            {Object.entries(programs).map(([key, program], i) => (
              <motion.div
                key={key}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
              >
                <Card
                  className="
                    relative flex flex-col h-full
                    rounded-3xl
                    overflow-hidden
                    shadow-lg
                    glass
                    border border-gray-200
                    transition-transform duration-500
                    hover:-translate-y-2 hover:shadow-2xl
                    group
                  "
                >
                  {/* Gradient Glow */}
                  <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl"></div>

                  <CardContent className="relative flex flex-col h-full p-6">
                    {/* Icon */}
                    <div
                      className={`text-5xl sm:text-6xl lg:text-7xl mb-4 ${program.iconColor} flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-md`}
                    >
                      {program.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 lg:text-lg text-base mb-4 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Items */}
                    <ul className="mb-6 list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base">
                      {program.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>

                    {/* Learn More */}
                    <Link
                      to={`/curriculum/${encodeURIComponent(key)}`}
                      className="
                        mt-auto inline-flex items-center gap-2
                        font-semibold text-blue-600
                        hover:gap-3 hover:underline
                        transition-all duration-300 text-sm sm:text-base lg:text-lg
                      "
                    >
                      Learn More <span aria-hidden>→</span>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Curriculum;
