import React, { useEffect, useState, useMemo } from "react";
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
  TrendingUp,
  Calendar,
  ArrowUp,
  Sparkles,
  ChevronRight,
  Loader,
  UserCheck,
  Grid3x3,
} from "lucide-react";
import profileFallback from "../../assets/images/profile.png";
import { fetchDepartments } from "../../api/department_api.jsx";
import { fetchMajors } from "../../api/major_api.jsx";
import { fetchSubjects } from "../../api/subject_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { fetchRegistrations } from "../../api/registration_api.jsx";

const Dashboard = () => {
  const [activeView, setActiveView] = useState('admin/dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

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

      const [deptRes, majorRes, subjectRes, studentRes, regRes] = await Promise.all([
        fetchDepartments(),
        fetchMajors(),
        fetchSubjects(),
        fetchStudents(),
        fetchRegistrations(),
      ]);

      const deptsData = deptRes.data?.data || deptRes.data || [];
      const majorsData = majorRes.data?.data || majorRes.data || [];
      const subjectsData = subjectRes.data?.data || subjectRes.data || [];
      const studentsData = studentRes.data?.data || studentRes.data || [];
      const regsData = regRes.data?.data || regRes.data || [];

      setDepartments(Array.isArray(deptsData) ? deptsData : []);
      setMajors(Array.isArray(majorsData) ? majorsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setRegistrations(Array.isArray(regsData) ? regsData : []);

      console.log("Dashboard data loaded:", {
        departments: deptsData.length,
        majors: majorsData.length,
        subjects: subjectsData.length,
        students: studentsData.length,
        totalRegistrations: regsData.length,
        pendingRegistrations: regsData.filter(r =>
          r.payment_status === 'PENDING' || r.payment_status === null || r.payment_status === ''
        ).length
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingRegistrations = useMemo(() => {
    return registrations.filter(r => {
      const isPending =
        r.payment_status === 'PENDING' ||
        r.payment_status === null ||
        r.payment_status === '';
      return isPending;
    });
  }, [registrations]);

  const recentRegistrationsCount = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return pendingRegistrations.filter(r => {
      if (!r.created_at) return false;
      const created = new Date(r.created_at);
      return created > weekAgo;
    }).length;
  }, [pendingRegistrations]);

  const stats = [
    {
      label: "Total Departments",
      value: departments.length,
      change: departments.length > 0 ? `${departments.length} active` : "0",
      gradient: "from-blue-500 to-cyan-500",
      icon: Building2
    },
    {
      label: "Active Majors",
      value: majors.length,
      change: majors.length > 0 ? `${majors.length} programs` : "0",
      gradient: "from-purple-500 to-pink-500",
      icon: GraduationCap
    },
    {
      label: "Total  Students enrolled",
      value: students.length,
      change: students.length > 0 ? `${students.length} enrolled` : "0",
      gradient: "from-orange-500 to-red-500",
      icon: Users
    },
    {
      label: "Pending Registrations",
      value: pendingRegistrations.length,
      change: recentRegistrationsCount > 0 ? `+${recentRegistrationsCount} this week` : "No recent",
      gradient: "from-green-500 to-emerald-500",
      icon: UserCheck
    },
  ];

  const topPerformingMajors = useMemo(() => {
    if (majors.length === 0 || registrations.length === 0) return [];

    const majorCounts = {};
    registrations.forEach(reg => {
      const majorId = reg.major_id;
      if (majorId) majorCounts[majorId] = (majorCounts[majorId] || 0) + 1;
    });

    return majors
      .map(major => {
        const count = majorCounts[major.id] || 0;
        return {
          id: major.id,
          name: major.major_name || "Unknown Major",
          students: count,
          departmentName: major.department?.name || "N/A"
        };
      })
      .filter(m => m.students > 0)
      .sort((a, b) => b.students - a.students)
      .slice(0, 5);
  }, [majors, registrations]);

  const departmentBreakdown = useMemo(() => {
    if (departments.length === 0 || students.length === 0) return [];

    const deptCounts = {};
    students.forEach(student => {
      const deptId = student.department_id;
      if (deptId) deptCounts[deptId] = (deptCounts[deptId] || 0) + 1;
    });

    return departments
      .map(dept => ({
        id: dept.id,
        name: dept.name,
        code: dept.code,
        studentCount: deptCounts[dept.id] || 0
      }))
      .filter(d => d.studentCount > 0)
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 5);
  }, [departments, students]);

  const recentRegistrations = useMemo(() => {
    return [...pendingRegistrations]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(reg => {
        const dept = departments.find(d => d.id === reg.department_id);
        const major = majors.find(m => m.id === reg.major_id);
        return {
          id: reg.id,
          name: reg.full_name_en || `${reg.first_name} ${reg.last_name}`,
          department: dept?.name || "Unknown",
          major: major?.major_name || "Unknown",
          date: new Date(reg.created_at).toLocaleDateString(),
          status: reg.payment_status || "PENDING"
        };
      });
  }, [pendingRegistrations, departments, majors]);

  const genderStats = useMemo(() => {
    const male = students.filter(s => s.gender === 'Male').length;
    const female = students.filter(s => s.gender === 'Female').length;
    const total = students.length;

    return {
      male,
      female,
      malePercentage: total > 0 ? Math.round((male / total) * 100) : 0,
      femalePercentage: total > 0 ? Math.round((female / total) * 100) : 0
    };
  }, [students]);

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

            <div className="flex flex-col items-end gap-3">
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
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </motion.div>

              {/* Refresh button placed correctly */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={loadAllData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 border border-white shadow-sm text-sm font-semibold text-gray-800 hover:bg-white transition"
              >
                <ArrowUp className="w-4 h-4" />
                Refresh
              </motion.button>
            </div>
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
              className="group relative overflow-hidden backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white cursor-pointer"
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
                  <span className="text-xs text-gray-600 px-2.5 py-1.5 rounded-full font-medium border border-gray-200 bg-white/50">
                    {stat.change}
                  </span>
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

      {/* SYSTEM OVERVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              System Overview
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Real-time summary from your backend data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="px-4 py-3 rounded-2xl bg-white/70 border border-white shadow-sm">
              <p className="text-xs text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/70 border border-white shadow-sm">
              <p className="text-xs text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/70 border border-white shadow-sm">
              <p className="text-xs text-gray-600">Completed Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.payment_status === "PAID" || r.payment_status === "COMPLETED").length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TODAY'S SNAPSHOT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "New Students Today",
            value: students.filter(s => {
              if (!s.created_at) return false;
              const d = new Date(s.created_at);
              const now = new Date();
              return d.toDateString() === now.toDateString();
            }).length,
            icon: Users,
            badge: "Live",
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            title: "New Registrations Today",
            value: registrations.filter(r => {
              if (!r.created_at) return false;
              const d = new Date(r.created_at);
              const now = new Date();
              return d.toDateString() === now.toDateString();
            }).length,
            icon: UserCheck,
            badge: "Live",
            gradient: "from-purple-500 to-pink-500"
          },
          {
            title: "Pending Today",
            value: registrations.filter(r => {
              if (!r.created_at) return false;
              const isPending = r.payment_status === "PENDING" || r.payment_status === null || r.payment_status === "";
              const d = new Date(r.created_at);
              const now = new Date();
              return isPending && d.toDateString() === now.toDateString();
            }).length,
            icon: TrendingUp,
            badge: "Today",
            gradient: "from-green-500 to-emerald-500"
          }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.08, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative overflow-hidden backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-[0.06]`} />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold px-3 py-1 rounded-full border border-white bg-white/70 text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {card.badge}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* RECENT ACTIVITY + QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Registrations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100">
                <UserCheck className="w-5 h-5 text-blue-500" />
              </div>
              Pending Registrations
            </h3>
            <span className="text-xs text-gray-600 backdrop-blur-sm px-3 py-1 rounded-full border bg-white/60 shadow-sm border-white">
              {recentRegistrations.length} pending
            </span>
          </div>

          {recentRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No registrations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRegistrations.map((reg, i) => (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  className="group backdrop-blur-xl p-4 rounded-2xl border bg-white/60 shadow-sm border-white hover:border-blue-300/50 transition-all duration-300 cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{reg.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{reg.major} - {reg.department}</p>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {reg.date}
                        <span className="mx-1">•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${reg.status === 'COMPLETED' || reg.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {reg.status}
                        </span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100">
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
                      className="absolute inset-0 bg-white/10 backdrop-blur-sm"
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm p-4"
                onClick={() => setActiveView("admin/dashboard")}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 bg-white/95 backdrop-blur-3xl border ${borderColors[view]} shadow-2xl`}
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

      {/* RECENT STUDENTS + SUBJECTS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-100">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              Latest Students
            </h3>
            <span className="text-xs text-gray-600 backdrop-blur-sm px-3 py-1 rounded-full border bg-white/60 shadow-sm border-white">
              {students.length} total
            </span>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No students yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...students]
                .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
                .slice(0, 5)
                .map((s, i) => (
                  <motion.div
                    key={s.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    whileHover={{ x: 4, scale: 1.02 }}
                    className="group backdrop-blur-xl p-4 rounded-2xl border bg-white/60 shadow-sm border-white hover:border-orange-300/50 transition-all duration-300 cursor-pointer hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {s.full_name_en || s.full_name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || "Student"}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          ID: {s.student_code || s.student_id || "N/A"} • Gender: {s.gender || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Subjects Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-green-100">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            Subjects Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/70 border border-white shadow-sm">
              <p className="text-xs text-gray-600">Total Subjects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{subjects.length}</p>
              <p className="text-xs text-gray-500 mt-2">All subjects in system</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 border border-white shadow-sm">
              <p className="text-xs text-gray-600">Departments with Subjects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {new Set(
                  majors
                    .filter(m => m?.subjects?.length > 0)
                    .map(m => m?.department_id || m?.department?.id)
                    .filter(Boolean)
                ).size}
              </p>
              <p className="text-xs text-gray-500 mt-2">Coverage overview</p>
            </div>

            <div className="sm:col-span-2 p-5 rounded-2xl bg-white/70 border border-white shadow-sm">
              <p className="text-xs text-gray-600 mb-2">Quick Insight</p>
              <p className="text-sm text-gray-700">
                Your system has <span className="font-bold">{subjects.length}</span> subjects across{" "}
                <span className="font-bold">{departments.length}</span> departments and{" "}
                <span className="font-bold">{majors.length}</span> majors.
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* TOP MAJORS + DEPARTMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Performing Majors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            Top Majors by Enrollment
          </h3>

          {topPerformingMajors.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No enrollments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topPerformingMajors.map((m, i) => {
                const maxStudents = Math.max(...topPerformingMajors.map(maj => maj.students));
                const percentage = (m.students / maxStudents) * 100;

                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="backdrop-blur-xl p-5 rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-300 shadow-sm hover:shadow-md bg-white/40"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{m.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{m.departmentName}</p>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-bold text-green-600 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-200/50 bg-green-50">
                        {m.students} students
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200/50 h-2.5 rounded-full overflow-hidden border border-white/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm"
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 min-w-[45px] text-right">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Department Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-blue-100">
              <Grid3x3 className="w-5 h-5 text-blue-500" />
            </div>
            Students by Department
          </h3>

          {departmentBreakdown.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No students yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {departmentBreakdown.map((dept, i) => {
                const colors = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-orange-500 to-red-500",
                  "from-green-500 to-emerald-500",
                  "from-indigo-500 to-purple-500"
                ];
                const maxCount = Math.max(...departmentBreakdown.map(d => d.studentCount));
                const percentage = (dept.studentCount / maxCount) * 100;

                return (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: -4 }}
                    className="backdrop-blur-xl p-5 rounded-2xl border border-white/30 hover:border-blue-300/50 transition-all duration-300 shadow-sm hover:shadow-md bg-white/40"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{dept.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Code: {dept.code}</p>
                      </div>
                      <span className="text-sm font-bold text-blue-600 backdrop-blur-sm px-2.5 py-1 rounded-full border border-blue-200/50 bg-blue-50">
                        {dept.studentCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200/50 h-2.5 rounded-full overflow-hidden border border-white/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${colors[i % colors.length]} shadow-sm`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 min-w-[45px] text-right">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* GENDER DISTRIBUTION */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="backdrop-blur-2xl rounded-3xl p-6 border bg-white/60 shadow-lg border-white"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-purple-100">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            Gender Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl p-6 rounded-2xl border border-white/30 bg-white/40">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-700">Male Students</p>
                <p className="text-2xl font-bold text-blue-600">{genderStats.male}</p>
              </div>
              <div className="relative h-3 bg-gray-200/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${genderStats.malePercentage}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">{genderStats.malePercentage}% of total students</p>
            </div>

            <div className="backdrop-blur-xl p-6 rounded-2xl border border-white/30 bg-white/40">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-700">Female Students</p>
                <p className="text-2xl font-bold text-pink-600">{genderStats.female}</p>
              </div>
              <div className="relative h-3 bg-gray-200/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${genderStats.femalePercentage}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  className="absolute h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">{genderStats.femalePercentage}% of total students</p>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default Dashboard;
