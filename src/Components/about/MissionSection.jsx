import { Card, CardContent } from "../ui/Card";
import React from "react";
import milestone from "../../Data/Milestones.json";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, type: "spring", stiffness: 120, damping: 20 },
  }),
};

export function MissionSection() {
  return (
    <section className="py-10 text-gray-700 rounded-lg relative">
      {/* Decorative animated background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl pointer-events-none animate-blob"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-red-400/30 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-2000"></div>

      <div className="mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-700 header-text">
            Our Mission & Values
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="md:text-xl sm:text-sm text-xs mb-8 text-gray-600 leading-relaxed">
              At Excellence University, our mission is to advance knowledge through innovative research, provide transformative educational experiences, and prepare students to become ethical leaders who will make a positive impact on the world.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:p-20 p-6">
          {milestone.values.map((value, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{ scale: 1.05, rotateZ: 1, transition: { duration: 0.3 } }}
            >
              <Card className="glass shadow-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-10 text-center">
                  <div className="sm:text-5xl text-3xl mb-4">{value.icon}</div>
                  <h3 className="sm:text-2xl text-xl text-gray-700 font-semibold mb-3">
                    {value.title}
                  </h3>
                  <p className="sm:text-xl text-xs text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
