import React from "react";
import { Card, CardContent } from "../ui/Card";
import milestone from "../../Data/Milestones.json";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
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

export function HistorySection() {
  return (
    <section className="py-10 my-5 font text-gray-700 rounded-lg relative overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-blob" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-2000" />

      <div className="mx-auto px-5 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl my-5 md:text-5xl lg:text-6xl font-bold text-gray-800">
            {milestone.header.title}
          </h2>
          <p className="sm:text-xl text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed ">
            {milestone.header.dedicated}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:p-20 p-2">
          {milestone.timeline.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                rotateZ: 1,
                transition: { duration: 0.3 },
              }}
            >
              <Card className="glass shadow-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <CardContent className="text-start">
                  <div className="flex items-center gap-3 p-3 w-full">
                    <div className="lg:text-4xl sm:text-2xl text-xl mx-2">
                      {item.icon}
                    </div>
                    <div className="md:text-2xl text-xl font-semibold text-gray-700">
                      {item.year}
                    </div>
                  </div>

                  <h3 className="sm:text-xl font-medium mb-3 py-3 text-gray-800">
                    {item.title}
                  </h3>

                  <p className="sm:text-lg text-sm text-gray-600 leading-relaxed">
                    {item.description}
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
