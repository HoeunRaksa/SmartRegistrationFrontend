import { motion } from "framer-motion";
import React from "react";

const Button = ({ children, variant = "default", className = "", ...props }) => {
  const baseClasses = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2";

  const variants = {
    default: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(139,92,246,0.4)] hover:-translate-y-0.5",
    primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)]",
    secondary: "bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-[0_10px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.4)]",
    outline: "border-2 border-indigo-600/30 bg-white/40 backdrop-blur-md text-indigo-700 hover:bg-white/60 hover:border-indigo-600/50 hover:text-indigo-800",
    glass: "backdrop-blur-xl bg-white/60 text-gray-800 border-2 border-white/60 shadow-lg hover:bg-white/80 hover:scale-105",
    ghost: "text-indigo-600 hover:bg-indigo-50/50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant] || variants.default} ${className} group`}
      {...props}
    >
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export const Button3D = ({ children, className = "", ...props }) => {
  return (
    <motion.button
      className={`relative flex items-center justify-center ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        scale: 1.05,
        rotateX: -5,
        rotateY: 5,
        z: 20,
      }}
      whileTap={{
        scale: 0.95,
        rotateX: 5,
        rotateY: -5,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      <div style={{ transform: 'translateZ(10px)' }} className="relative z-10">
        {children}
      </div>

      {/* Button Depth Shadow */}
      <div
        className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-blue-600/30 to-purple-600/30 blur-md"
        style={{ transform: 'translateZ(-5px)' }}
      />
    </motion.button>
  );
};

export { Button };