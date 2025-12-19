import { Card, CardContent } from "../ui/Card";
import { motion } from "framer-motion";
import { useState } from "react";

const programs = {
  ScienceEngineering: {
    title: "Science & Engineering",
    description: "Cutting-edge research facilities and world-renowned faculty in STEM fields.",
    items: ["Computer Science", "Biomedical Engineering", "Environmental Science", "Data Analytics"],
    link: "#"
  },
  BusinessEconomics: {
    title: "Business & Economics",
    description: "Industry-leading business programs with global perspectives and practical experience.",
    items: ["MBA Programs", "International Business", "Finance & Banking", "Entrepreneurship"],
    link: "#"
  },
  ArtsHumanities: {
    title: "Arts & Humanities",
    description: "Explore creativity and critical thinking through diverse cultural and artistic studies.",
    items: ["Literature", "History", "Philosophy", "Visual Arts"],
    link: "#"
  },
};

// Item animation
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

const ProgramCard = ({ program, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <Card className="relative h-full overflow-hidden rounded-3xl glass shadow-lg group cursor-pointer hover:scale-[1.03] transition-transform duration-500">
        {/* Gradient accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
        {/* Soft hover glow */}
        <div className={`absolute -inset-1 blur-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-opacity duration-500 ${showDetails ? 'opacity-100' : 'opacity-0'}`} />

        <CardContent className="relative flex flex-col h-full p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold uppercase tracking-wider text-gray-800 mb-4 py-2">{program.title}</h3>
          <p className="text-base lg:text-lg text-gray-600 mb-6 leading-relaxed">{program.description}</p>

          {showDetails && (
            <ul className="space-y-2 text-sm lg:text-base text-gray-600 mb-6">
              {program.items.map((item, i) => (
                <motion.li key={i} custom={i} initial="hidden" animate="visible" variants={itemVariants} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-auto inline-flex items-center gap-2 font-semibold text-white bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            {showDetails ? "Hide Details" : "View Details"}
            <span className={`transition-transform ${showDetails ? 'rotate-180' : ''}`}>↓</span>
          </button>

          <a
            href={program.link}
            className="mt-4 inline-flex items-center gap-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:gap-4 transition-all duration-300"
          >
            Learn More <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Program() {
  return (
    <section className="py-20 my-4 rounded-3xl text-gray-700">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            World-Class Academic Programs
          </h2>
          <p className="lg:text-xl sm:text-lg font-medium mb-8 max-w-4xl mx-auto text-gray-700">
            Discover our comprehensive range of undergraduate, graduate, and doctoral
            programs designed to prepare you for success in the global marketplace.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(programs).map((program, index) => (
            <ProgramCard key={index} program={program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
