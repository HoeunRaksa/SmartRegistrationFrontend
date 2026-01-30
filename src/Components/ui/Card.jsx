import { motion, useReducedMotion } from "framer-motion";
import React, { useState, useEffect } from "react";

// Standard Glass Card - GPU-friendly (opacity + y/transform), respects reduced motion
export const Card = ({ children, className = "", ...props }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduced ? 0.12 : 0.5, ease: "easeOut" }}
      className={`rounded-3xl backdrop-blur-2xl bg-white/60 border-2 border-white/60 gen-z-card shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.2)] transition-all duration-500 ${className}`}
      style={{ willChange: reduced ? "auto" : undefined }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 3D Enhanced Card - GPU transforms; respects reduced motion by disabling tilt
export const Card3D = ({
  children,
  className = '',
  hover3D = true,
  perspective = 1000,
  rotationIntensity = 10,
  shadowIntensity = 'medium',
  ...props
}) => {
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const reducedMotion = useReducedMotion();
  const enable3D = hover3D && !reducedMotion;

  const handleMouseMove = (e) => {
    if (!enable3D) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateXValue = (mouseY / (rect.height / 2)) * rotationIntensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * -rotationIntensity;

    setRotateX(-rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const shadowStyles = {
    low: 'shadow-lg',
    medium: 'shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]',
    high: 'shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)]',
  };

  const springTransition = reducedMotion
    ? { duration: 0.1, ease: "easeOut" }
    : { type: 'spring', stiffness: 400, damping: 30 };

  return (
    <motion.div
      className={`relative rounded-3xl transition-shadow duration-500 gen-z-card group ${shadowStyles[shadowIntensity]} ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={springTransition}
      whileHover={reducedMotion ? undefined : { scale: 1.02, z: 50 }}
      {...props}
    >
      <div style={{ transform: 'translateZ(20px)' }} className="h-full">
        {children}
      </div>

      <div
        className="absolute inset-0 -z-10 rounded-[inherit] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
          transform: 'translateZ(-12px)',
        }}
      />
    </motion.div>
  );
};

// Floating Card Animation - disabled when user prefers reduced motion
export const FloatingCard3D = ({ children, className = '', delay = 0 }) => {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      animate={
        reducedMotion
          ? { y: 0, rotateX: 0, rotateY: 0 }
          : {
            y: [0, -10, 0],
            rotateX: [0, 2, 0],
            rotateY: [0, 3, 0],
          }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }
      }
      whileHover={
        reducedMotion ? undefined : { y: -15, rotateX: 5, rotateY: 5, scale: 1.05 }
      }
    >
      {children}
    </motion.div>
  );
};

// Parallax Scroll Card
export const ParallaxCard = ({ children, className = '', depth = 50 }) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setOffsetY(scrollY * 0.1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `translateZ(${depth}px) translateY(${offsetY}px)`,
      }}
    >
      {children}
    </motion.div>
  );
};

// Sub-components
export const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 font-light leading-relaxed ${className}`}>
    {children}
  </p>
);

export default { Card, Card3D, FloatingCard3D, ParallaxCard, CardHeader, CardContent, CardTitle, CardDescription };