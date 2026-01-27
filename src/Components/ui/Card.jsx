import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

// Standard Glass Card
export const Card = ({ children, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`rounded-3xl backdrop-blur-2xl bg-white/60 border-2 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-500 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// 3D Enhanced Card
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

  const handleMouseMove = (e) => {
    if (!hover3D) return;

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

  return (
    <motion.div
      className={`relative rounded-3xl transition-shadow duration-500 ${shadowStyles[shadowIntensity]} ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      whileHover={{
        scale: 1.02,
        z: 50,
      }}
      {...props}
    >
      <div style={{ transform: 'translateZ(20px)' }} className="h-full">
        {children}
      </div>

      {/* 3D Depth Shadow/Glow */}
      <div
        className="absolute inset-0 -z-10 rounded-[inherit] opacity-20 blur-2xl transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(79, 70, 229, 0.4))',
          transform: 'translateZ(-10px)',
        }}
      />
    </motion.div>
  );
};

// Floating Card Animation
export const FloatingCard3D = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        y: [0, -10, 0],
        rotateX: [0, 2, 0],
        rotateY: [0, 3, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{
        y: -15,
        rotateX: 5,
        rotateY: 5,
        scale: 1.05,
      }}
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