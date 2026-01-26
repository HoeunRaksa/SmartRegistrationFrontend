import React from 'react';
import { motion } from 'framer-motion';

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

const AbouteUs = () => {
  return (
    <div className="min-h-screen  relative overflow-hidden">
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
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
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
          className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 mt-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
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
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
                    >
                      <span className="text-4xl">🎯</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
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
                      className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
                    >
                      <span className="text-4xl">👁️</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
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
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
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
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
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
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
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
      </div>
    </div>
  );
};

export default AbouteUs;