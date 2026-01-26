import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchDepartments } from "../api/department_api";

const headerImage = "/assets/images/curriculum.png";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

// Icon mapping based on department name/faculty
const getDepartmentIcon = (dept) => {
  const name = (dept.faculty?.toLowerCase() || dept.name?.toLowerCase() || '');
  
  const iconMap = {
    'science': { emoji: '🧪', color: 'from-blue-600 to-purple-600' },
    'engineering': { emoji: '⚙️', color: 'from-blue-600 to-purple-600' },
    'technology': { emoji: '🖥️', color: 'from-indigo-500 to-blue-500' },
    'business': { emoji: '💼', color: 'from-yellow-500 to-orange-500' },
    'economics': { emoji: '📊', color: 'from-yellow-500 to-orange-500' },
    'finance': { emoji: '💰', color: 'from-yellow-500 to-orange-500' },
    'art': { emoji: '🎨', color: 'from-pink-500 to-rose-500' },
    'humanities': { emoji: '📚', color: 'from-pink-500 to-rose-500' },
    'literature': { emoji: '✍️', color: 'from-pink-500 to-rose-500' },
    'medical': { emoji: '🏥', color: 'from-red-500 to-pink-500' },
    'health': { emoji: '❤️', color: 'from-red-500 to-pink-500' },
    'nursing': { emoji: '⚕️', color: 'from-red-500 to-pink-500' },
    'law': { emoji: '⚖️', color: 'from-purple-500 to-indigo-500' },
    'legal': { emoji: '⚖️', color: 'from-purple-500 to-indigo-500' },
    'environment': { emoji: '🌿', color: 'from-green-500 to-emerald-500' },
    'biology': { emoji: '🧬', color: 'from-green-500 to-emerald-500' },
    'tourism': { emoji: '✈️', color: 'from-sky-500 to-blue-500' },
    'hospitality': { emoji: '🏨', color: 'from-sky-500 to-blue-500' },
    'ai': { emoji: '🤖', color: 'from-teal-500 to-cyan-500' },
    'artificial': { emoji: '🤖', color: 'from-teal-500 to-cyan-500' },
    'computer': { emoji: '💻', color: 'from-indigo-500 to-blue-500' },
    'social': { emoji: '👥', color: 'from-purple-500 to-indigo-500' },
  };

  for (const [key, value] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return value;
    }
  }

  return { emoji: '🎓', color: 'from-blue-500 to-purple-500' };
};

const Curriculum = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDepartments();
        
        // Handle the response structure from your Laravel API
        // The API should return { success: true, data: [...departments] }
        if (response.data && Array.isArray(response.data)) {
          // If response.data is directly the array of departments
          setDepartments(response.data);
        } else if (response.data.success && response.data.data) {
          // If response has a success wrapper
          setDepartments(response.data.data);
        } else if (response.data.data) {
          // Alternative structure
          setDepartments(response.data.data);
        } else {
          // Fallback
          setDepartments(response.data || []);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError(err.response?.data?.message || "Failed to load departments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 opacity-30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 px-4 py-10">
        {/* Hero Section */}
        <motion.section 
          className="relative mt-5 rounded-3xl overflow-hidden max-w-7xl mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/60 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 sm:p-10">
            {/* Gradient top accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center md:justify-between gap-8">
              <div className="text-center md:text-left md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block mb-4"
                >
                  <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-white/50">
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Academic Programs
                    </span>
                  </div>
                </motion.div>

                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 drop-shadow-lg"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Unlock Your Potential with Our Programs
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="backdrop-blur-xl bg-white/40 p-5 rounded-2xl border border-white/50 mb-6"
                >
                  <p className="text-lg sm:text-xl leading-relaxed text-gray-800 font-light">
                    Dive into world-class education and research opportunities designed to equip you with skills for tomorrow's careers.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <a
                    href="#programs"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="relative inline-block backdrop-blur-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-[0_10px_40px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.6)] transition-all duration-500 hover:scale-105 border border-white/30 font-semibold overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">Explore Programs</span>
                  </a>
                </motion.div>
              </div>

              <div className="md:w-1/2 flex justify-center">
                <motion.div
                  className="backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 p-6 rounded-3xl border-2 border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_rgba(139,92,246,0.4)] transition-all duration-700"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
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
        <section id="programs" className="py-10 my-8 max-w-7xl mx-auto">
          <div className="mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 drop-shadow-lg"
              >
                World-Class Academic Programs
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 p-6 rounded-3xl border border-white/60 shadow-xl max-w-4xl mx-auto"
              >
                <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-800 font-light">
                  Discover our comprehensive range of undergraduate, graduate, and doctoral
                  programs designed to prepare you for success in the global marketplace.
                </p>
              </motion.div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 p-10 rounded-3xl border-2 border-white/60 shadow-xl">
                  <svg className="animate-spin h-16 w-16 mx-auto mb-6 text-purple-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Loading Programs...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="backdrop-blur-2xl bg-gradient-to-br from-red-50/80 to-white/60 p-10 rounded-3xl border-2 border-red-200/60 shadow-xl max-w-lg text-center">
                  <div className="backdrop-blur-xl bg-red-500/10 p-4 rounded-2xl inline-block mb-4">
                    <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Programs</h3>
                  <p className="text-red-700 font-medium mb-6">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && departments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 p-4">
                {departments.map((dept, i) => {
                  const iconData = getDepartmentIcon(dept);
                  
                  return (
                    <motion.div
                      key={dept.id}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={cardVariants}
                    >
                      <div className="relative flex flex-col h-full rounded-3xl overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(139,92,246,0.4)] hover:scale-[1.02] group">
                        
                        {/* Gradient top accent */}
                        <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${iconData.color}`} />
                        
                        {/* Hover glow */}
                        <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />

                        <div className="relative flex flex-col h-full p-6 lg:p-8">
                          {/* Icon or Image */}
                          <div className="mb-4 flex items-center gap-4">
                            {dept.image_url ? (
                              <img 
                                src={dept.image_url} 
                                alt={dept.name}
                                className="w-16 h-16 object-cover rounded-2xl shadow-lg"
                                onError={(e) => {
                                  // Fallback to emoji icon if image fails to load
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`text-4xl flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${iconData.color} shadow-lg ${dept.image_url ? 'hidden' : ''}`}>
                              {iconData.emoji}
                            </div>
                            
                            {/* Code Badge */}
                            {dept.code && (
                              <div className="backdrop-blur-xl bg-white/60 px-3 py-1.5 rounded-full border border-white/70 shadow-sm">
                                <span className="text-xs font-bold text-gray-700">{dept.code}</span>
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                            {dept.title || dept.name}
                          </h3>

                          {/* Faculty */}
                          {dept.faculty && (
                            <div className="mb-3 flex items-center gap-2">
                              <div className="backdrop-blur-xl bg-purple-500/10 p-1.5 rounded-lg">
                                <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-700">{dept.faculty}</span>
                            </div>
                          )}

                          {/* Description */}
                          {dept.description && (
                            <div className="backdrop-blur-xl bg-white/40 p-4 rounded-2xl border border-white/50 mb-4 flex-grow">
                              <p className="text-gray-800 lg:text-base text-sm leading-relaxed font-light line-clamp-3">
                                {dept.description}
                              </p>
                            </div>
                          )}

                          {/* Contact Info Preview */}
                          {(dept.contact_email || dept.phone_number) && (
                            <div className="mb-6 space-y-2 text-sm">
                              {dept.contact_email && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <span className="font-medium truncate">{dept.contact_email}</span>
                                </div>
                              )}
                              {dept.phone_number && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <span className="font-medium">{dept.phone_number}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Learn More */}
                          <Link
                            to={`/departments/${dept.id}`}
                            className="mt-auto inline-flex items-center gap-2 font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:gap-4 transition-all duration-300 text-sm sm:text-base lg:text-lg group-hover:scale-105"
                          >
                            Learn More 
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && departments.length === 0 && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 p-10 rounded-3xl border-2 border-white/60 shadow-xl max-w-lg text-center">
                  <div className="backdrop-blur-xl bg-gray-500/10 p-4 rounded-2xl inline-block mb-4">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Programs Available</h3>
                  <p className="text-gray-600">Check back soon for new academic programs!</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Curriculum;