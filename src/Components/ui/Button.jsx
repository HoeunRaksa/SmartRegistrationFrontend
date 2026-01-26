import { motion } from "framer-motion";

const Button = ({ children, variant = "default", className, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-all duration-300 relative overflow-hidden";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses} ${className} group`}
      {...props}
    >
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
export { Button };