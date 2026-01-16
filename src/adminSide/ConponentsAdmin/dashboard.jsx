import React, { useEffect, useState } from "react";
import DepartmentsForm from '../ConponentsAdmin/DepartmentsForm.jsx';
import MajorsForm from '../ConponentsAdmin/MajorsForm.jsx';
import SubjectsForm from '../ConponentsAdmin/SubjectsForm.jsx';
import StudentsForm from '../ConponentsAdmin/StudentsForm.jsx';
import "../../App.css";
import { motion, AnimatePresence } from "framer-motion";
import Clock from "../ConponentsAdmin/Clock";
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Award,
  ArrowUp,
  Sparkles,
  ChevronRight,
  Loader,
} from "lucide-react";
import profileFallback from "../../assets/images/profile.png";
import { fetchDepartments } from "../../api/department_api.jsx";
import { fetchMajors } from "../../api/major_api.jsx";
import { fetchSubjects } from "../../api/subject_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";

const Dashboard = () => {
  const [activeView, setActiveView] = useState('admin/dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [deptRes, majorRes, subjectRes, studentRes] = await Promise.all([
        fetchDepartments(),
        fetchMajors(),
        fetchSubjects(),
        fetchStudents(),
      ]);

      const deptsData = deptRes.data?.data || deptRes.data || [];
      const majorsData = majorRes.data?.data || majorRes.data || [];
      const subjectsData = subjectRes.data?.data || subjectRes.data || [];
      const studentsData = studentRes.data?.data || studentRes.data || [];

      setDepartments(Array.isArray(deptsData) ? deptsData : []);
      setMajors(Array.isArray(majorsData) ? majorsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);

      console.log("Dashboard data loaded:", {
        departments: deptsData.length,
        majors: majorsData.length,
        subjects: subjectsData.length,
        students: studentsData.length
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Departments",
      value: departments.length,
      change: "+2",
      gradient: "from-blue-500 to-cyan-500",
      icon: Building2
    },
    {
      label: "Active Majors",
      value: majors.length,
      change: "+5",
      gradient: "from-purple-500 to-pink-500",
      icon: GraduationCap
    },
    {
      label: "Total Students",
      value: students.length,
      change: `+${Math.floor(students.length * 0.08)}`,
      gradient: "from-orange-500 to-red-500",
      icon: Users
    },
    {
      label: "Subjects",
      value: subjects.length,
      change: "+12",
      gradient: "from-green-500 to-emerald-500",
      icon: BookOpen
    },
  ];

  const recentActivities = [
    { action: "Logged into dashboard", time: "Just now" },
    { action: "System data synced", time: "1 hour ago" },
    { action: "Permissions verified", time: "Today" },
  ];

  // Real major names with student counts based on department relationship
  const topPerformingMajors = (() => {
    if (majors.length === 0) {
      return [{ name: "No majors yet", students: 0, growth: "0%", color: "from-gray-400 to-gray-500" }];
    }

    // Count students per department
    const deptCounts = {};

    students.forEach(student => {
      const deptId = student.department_id;
      if (deptId) {
        deptCounts[deptId] = (deptCounts[deptId] || 0) + 1;
      }
    });

    console.log("Department counts:", deptCounts);
    console.log("All majors data:", majors); // SEE ALL MAJORS

    // Map majors with their department's student count
    const result = majors
      .map((major, index) => {
        console.log(`Major ${index}:`, major); // SEE EACH MAJOR

        return {
          name: major.name || major.title || major.major_name || "Unknown Major", // Try different field names
          students: deptCounts[major.department_id] || 0,
          growth: `+${Math.floor(Math.random() * 15 + 5)}%`,
          color: ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-orange-500 to-red-500", "from-green-500 to-emerald-500"][index % 4]
        };
      })
      .sort((a, b) => b.students - a.students)
      .slice(0, 4);

    console.log("Final topPerformingMajors:", result); // SEE FINAL RESULT

    return result;
  })();

  const upcomingEvents = [
    { title: "Faculty Meeting", date: "Jan 10, 2025", time: "10:00 AM" },
    { title: "Student Orientation", date: "Jan 12, 2025", time: "2:00 PM" },
    { title: "Exam Schedule Release", date: "Jan 15, 2025", time: "9:00 AM" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Loader className="w-12 h-12 text-blue-600" />
          </motion.div>
          <p className="text-gray-600 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 pb-8">

      {/* USER HEADER */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden backdrop-blur-2xl rounded-3xl p-8 border bg-white/70 border-white"
        >
          <div className="absolute inset-0" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-xl" />
                <img
                  src={user.profile_picture_url || profileFallback}
                  alt="Profile"
                  className="relative w-20 h-20 rounded-full object-cover border-4 border-white/40 shadow-xl backdrop-blur-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2"
                >
                  Welcome back, {user.name}
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 capitalize mt-1 flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {user.role} dashboard
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-right"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <Clock />
              </div>
              <div className="text-xs text-gray-600 mt-1 flex items-center justify-end gap-1">
                <Calendar className="w-3 h-3" />
                <Clock />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="group relative overflow-hidden backdrop-blur-2xl rounded-3xl p-6 border  bg-white/60 shadow-lg border-white  cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                    className="flex items-center gap-1 text-xs backdrop-blur-sm text-green-600 px-2.5 py-1.5 rounded-full font-semibold shadow-sm border border-green-200/50"
                  >
                    <ArrowUp className="w-3 h-3" />
                    {stat.change}
                  </motion.span>
                </div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="text-4xl font-bold text-gray-900 mb-1"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            </motion.div>
          );
        })}
      </div>

      {/* ACTIVITY + QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white "
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl backdrop-blur-sm">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              Recent Activity
            </h3>
            <span className="text-xs text-gray-600 backdrop-blur-sm px-3 py-1 rounded-full border bg-white/60 shadow-lg border-white ">Live</span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
                className="group backdrop-blur-xl p-4 rounded-2xl border bg-white/60 shadow-lg border-white  hover:border-blue-300/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{a.action}</p>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {user?.name} • {a.time}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white "
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Add Department", icon: Building2, gradient: "from-blue-500 to-cyan-500", view: "departments" },
              { label: "Add Major", icon: GraduationCap, gradient: "from-purple-500 to-pink-500", view: "majors" },
              { label: "Add Subject", icon: BookOpen, gradient: "from-green-500 to-emerald-500", view: "subjects" },
              { label: "Add Student", icon: Users, gradient: "from-orange-500 to-red-500", view: "students" },
            ].map((action, i) => {
              const Icon = action.icon;
              const isActive = activeView === action.view;

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                  whileHover={{
                    scale: 1.08,
                    y: -4,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView(action.view)}
                  className={`
                    relative overflow-hidden p-5 rounded-2xl text-white shadow-xl transition-all duration-300
                    bg-gradient-to-br ${action.gradient}
                    ${isActive ? "ring-4 ring-white/40 shadow-2xl" : "hover:shadow-2xl"}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 backdrop-blur-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10">
                    <Icon size={28} className="mb-3 mx-auto drop-shadow-lg" />
                    <p className="text-sm font-semibold">{action.label}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* MODALS */}
        <AnimatePresence>
          {["departments", "majors", "subjects", "students"].map((view) => {
            const FormComponent = {
              departments: DepartmentsForm,
              majors: MajorsForm,
              subjects: SubjectsForm,
              students: StudentsForm,
            }[view];

            const borderColors = {
              departments: "border-blue-200/50",
              majors: "border-purple-200/50",
              subjects: "border-green-200/50",
              students: "border-indigo-200/50",
            };

            return activeView === view && (
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute h-[60%] inset-0 z-50 flex items-center justify-center bg-gray-300/10 backdrop-blur-sm p-4"
                onClick={() => setActiveView("admin/dashboard")}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 backdrop-blur-3xl border ${borderColors[view]} shadow-2xl`}
                >
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveView("admin/dashboard")}
                    className="sticky top-0 right-0 ml-auto mb-4 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors duration-200 flex items-center justify-center font-bold z-10"
                  >
                    ✕
                  </motion.button>
                  <FormComponent onUpdate={loadAllData} />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

      </div>

      {/* MAJORS + EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Majors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white "
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            Top Performing Majors
          </h3>
          <div className="space-y-4">
            {topPerformingMajors.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="backdrop-blur-xl p-5 rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-gray-800">{m.name}</p>
                  <span className="flex items-center gap-1 text-sm font-bold text-green-600 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-200/50">
                    <ArrowUp className="w-3 h-3" />
                    {m.growth}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 backdrop-blur-sm h-2.5 rounded-full overflow-hidden border border-white/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: m.students > 0 ? `${Math.min((m.students / Math.max(1, ...topPerformingMajors.map(maj => maj.students))) * 100, 100)}%` : "0%" }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${m.color} shadow-sm`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 min-w-[60px] text-right">
                    {m.students} students
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white "
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: -4 }}
                className="group backdrop-blur-xl p-5 rounded-2xl border border-white/30 hover:border-blue-300/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">{e.title}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {e.date}
                      <span className="text-gray-400">•</span>
                      <Clock className="w-3 h-3 text-purple-500" />
                      {e.time}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CHART */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white "
      >
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
          <div className="p-2 rounded-xl backdrop-blur-sm">
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          Academic Performance Overview
        </h3>
        <div className="relative h-64 bg-gradient-to-br from-transparent to-transparent backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="relative text-gray-600 font-medium flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Chart coming soon
          </motion.p>
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;