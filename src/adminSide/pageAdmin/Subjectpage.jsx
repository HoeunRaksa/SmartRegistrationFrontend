import React from "react";
import { motion } from "framer-motion";
import SubjectsForm from '../ConponentsAdmin/SubjectsForm.jsx';
import {
  BookOpen,
  Home,
  ChevronRight,
  Settings,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

const SubjectsPage = () => {
  // Quick stats for the page header
  const quickStats = [
    { label: "Active", value: "24", color: "from-green-500 to-emerald-500", icon: TrendingUp },
    { label: "Students", value: "2.4K", color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Growth", value: "+18%", color: "from-purple-500 to-pink-500", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6 z-100">
      {/* ================= BREADCRUMB NAVIGATION ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-sm"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </motion.div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Management</span>
        </motion.div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <BookOpen className="w-4 h-4" />
          <span>Subjects</span>
        </div>
      </motion.div>

      {/* ================= PAGE HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white/40 rounded-3xl p-6 border border-white/50 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-50" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-1"
                >
                  Subjects Management
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-600"
                >
                  Create, manage, and organize your academic subjects
                </motion.p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3">
              {quickStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="flex-1 min-w-[90px]"
                  >
                    <div className="bg-white/50 rounded-2xl p-3 border border-white/40 shadow-md hover:shadow-lg transition-shadow">
                      <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-1.5`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= SUBJECTS FORM ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SubjectsForm />
      </motion.div>
    </div>
  );
};

export default SubjectsPage;