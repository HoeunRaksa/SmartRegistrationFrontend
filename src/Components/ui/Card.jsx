import { motion } from "framer-motion";

const Card = ({ children, className, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ duration: 0.3 }}
    className={`rounded-3xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.1 }}
    className={`p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const CardContent = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className={`p-6 pt-0 ${className}`}
  >
    {children}
  </motion.div>
);

const CardTitle = ({ children, className }) => (
  <motion.h3
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className={`font-semibold ${className}`}
  >
    {children}
  </motion.h3>
);

const CardDescription = ({ children, className }) => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className={`text-sm ${className}`}
  >
    {children}
  </motion.p>
);

export { Card, CardHeader, CardContent, CardTitle, CardDescription };