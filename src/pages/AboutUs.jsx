import { Card, CardContent } from "../Components/ui/Card.jsx";
import { HistorySection } from "../Components/about/HistorySection.jsx";
import { MissionSection } from "../Components/about/MissionSection.jsx";
import milestone from "../Data/Milestones.json";
import { ApiBaseImg } from "../config/Configration.jsx";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, type: "spring", stiffness: 120, damping: 20 },
  }),
};

const AbouteUs = () => {
  return (
    <div className="my-4 mt-5 relative">
      <main className="min-h-screen">
        <HistorySection />
        <MissionSection />
      </main>

      {/* Academic Excellence Section */}
      <section className="py-12 my-5 rounded-lg font text-gray-700 relative">
        {/* Subtle animated background blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl pointer-events-none animate-blob"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-red-400/30 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-2000"></div>

        <div className="mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="sm:text-3xl text-2xl font-bold py-5 header-text">
              Academic Excellence
            </h2>
            <p className="sm:text-xl text-sm font-medium max-w-3xl mx-auto py-2 text-gray-700 leading-relaxed">
              Our commitment to excellence is reflected in our achievements, recognition, and the success of our graduates who are making a difference worldwide.
            </p>
          </div>

          {/* Milestones Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:p-20 p-4">
            {milestone.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                whileHover={{ scale: 1.05, rotateZ: 1, transition: { duration: 0.3 } }}
              >
                <Card className="glass shadow-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="aspect-video p-5 overflow-hidden">
                    <motion.img
                      src={`${ApiBaseImg}${achievement.image}`}
                      alt={achievement.title}
                      className="w-full h-full object-cover rounded-lg"
                      initial={{ scale: 1.1 }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <motion.div
                      className="sm:text-xl text-gray-700 text-sm font-bold"
                      initial={{ y: -20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {achievement.count}
                    </motion.div>
                    <motion.h3
                      className="text-lg text-gray-700 font-semibold py-3"
                      initial={{ y: -10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.25 }}
                    >
                      {achievement.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.3 }}
                    >
                      {achievement.description}
                    </motion.p>
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

export default AbouteUs;
