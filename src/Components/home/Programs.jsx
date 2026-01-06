import { motion } from "framer-motion";
import { useState } from "react";

const programs = {
  ScienceEngineering: {
    title: "Science & Engineering",
    description:
      "Cutting-edge research facilities and world-renowned faculty in STEM fields, empowering students to turn curiosity into innovation and build solutions that shape the future.",
    items: [
      "Computer Science",
      "Biomedical Engineering",
      "Environmental Science",
      "Data Analytics",
    ],
    link: "#",
  },

  BusinessEconomics: {
    title: "Business & Economics",
    description:
      "Industry-leading business programs with global perspectives and practical experience, preparing students to lead with confidence, think strategically, and succeed in dynamic markets.",
    items: [
      "MBA Programs",
      "International Business",
      "Finance & Banking",
      "Entrepreneurship",
    ],
    link: "#",
  },

  ArtsHumanities: {
    title: "Arts & Humanities",
    description:
      "Explore creativity and critical thinking through diverse cultural and artistic studies, inspiring students to express ideas, challenge perspectives, and shape society.",
    items: [
      "Literature",
      "History",
      "Philosophy",
      "Visual Arts",
    ],
    link: "#",
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
      <div className="relative h-full overflow-hidden rounded-3xl backdrop-blur-xl bg-white/40 border border-white/20 shadow-xl group cursor-pointer hover:scale-[1.03] transition-all duration-500 hover:shadow-2xl">
        {/* Gradient accent top border */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        {/* Soft hover glow */}
        <div className={`absolute -inset-1 blur-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 transition-opacity duration-500 ${showDetails ? 'opacity-100' : 'opacity-0'}`} />

        <div className="relative flex flex-col h-full p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 py-2">
            {program.title}
          </h3>
          
          <p className="text-base lg:text-lg text-gray-700 mb-6 leading-relaxed font-light">
            {program.description}
          </p>

          {showDetails && (
            <motion.ul 
              className="space-y-3 text-sm lg:text-base text-gray-700 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {program.items.map((item, i) => (
                <motion.li 
                  key={i} 
                  custom={i} 
                  initial="hidden" 
                  animate="visible" 
                  variants={itemVariants} 
                  className="flex items-start gap-3"
                >
                  <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 shadow-sm" />
                  <span className="font-light">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-auto inline-flex items-center justify-center gap-2 font-semibold text-white backdrop-blur-xl bg-gradient-to-br from-blue-600 to-purple-600 px-5 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
          >
            {showDetails ? "Hide Details" : "View Details"}
            <span className={`transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}>↓</span>
          </button>

          <a
            href={program.link}
            className="mt-4 inline-flex items-center gap-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:gap-4 transition-all duration-300"
          >
            Learn More <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function Program() {
  return (
    <section className="py-20 my-4 rounded-3xl">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            World-Class Academic Programs
          </h2>
          <p className="text-base sm:text-lg lg:text-xl font-light max-w-4xl mx-auto text-gray-700 leading-relaxed">
            Discover our comprehensive range of undergraduate, graduate, and doctoral
            programs designed to prepare you for success in the global marketplace.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Object.values(programs).map((program, index) => (
            <ProgramCard key={index} program={program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}