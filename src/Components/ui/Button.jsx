import { motion } from "framer-motion";
import React from "react";

const Button = ({ children, variant = "default", className = "", ...props }) => {
  const baseClasses = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2";

  const variants = {
    default: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white gen-z-btn shadow-[0_10px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_16px_36px_rgba(139,92,246,0.4)] hover:-translate-y-0.5",
    primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white gen-z-btn shadow-[0_10px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_16px_36px_rgba(59,130,246,0.4)]",
    secondary: "bg-gradient-to-r from-indigo-600 to-purple-700 text-white gen-z-btn shadow-[0_10px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_16px_36px_rgba(139,92,246,0.4)]",
    outline: "border-2 border-indigo-600/30 bg-white/40 backdrop-blur-md text-indigo-700 gen-z-glass hover:bg-white/60 hover:border-indigo-600/50 hover:text-indigo-800",
    glass: "backdrop-blur-xl bg-white/60 text-gray-800 border-2 border-white/60 gen-z-glass shadow-lg hover:bg-white/80 hover:scale-105",
    ghost: "text-indigo-600 hover:bg-indigo-50/50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ transformStyle: 'preserve-3d' }}
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
      className={`relative flex items-center justify-center gen-z-btn ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      whileHover={{
        scale: 1.05,
        rotateX: -6,
        rotateY: 6,
        z: 24,
        y: -4,
      }}
      whileTap={{
        scale: 0.96,
        rotateX: 4,
        rotateY: -4,
        z: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 18,
      }}
      {...props}
    >
      <div style={{ transform: 'translateZ(12px)' }} className="relative z-10">
        {children}
      </div>

      {/* Gen Z depth glow */}
      <div
        className="absolute inset-0 -z-10 rounded-[inherit] opacity-80 blur-xl transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4))',
          transform: 'translateZ(-8px)',
        }}
      />
    </motion.button>
  );
};

export { Button };