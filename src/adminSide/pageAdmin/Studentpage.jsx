import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StudentsForm from "../ConponentsAdmin/StudentsForm.jsx";
import StudentsTable from "../ConponentsAdmin/Studentstable.jsx";
import StudentProfile from "../../gobalConponent/Studentprofile.jsx";
import { fetchStudents } from "../../api/student_api.jsx";

import {
  GraduationCap,
  Home,
  ChevronRight,
  Settings,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchStudents();
      
      // Handle different response structures
      const studentsData = res.data?.data || res.data || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadStudents = () => {
    loadStudents();
  };

  const quickStats = [
    {
      label: "Total Students",
      value: students.length,
      color: "from-blue-500 to-cyan-500",
      icon: Users,
    },
    {
      label: "Active",
      value: students.length,
      color: "from-green-500 to-emerald-500",
      icon: TrendingUp,
    },
    {
      label: "Departments",
      value: new Set(students.map(s => s.department_id)).size || 0,
      color: "from-purple-500 to-pink-500",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* BREADCRUMB */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-sm"
      >
        <div className="flex items-center gap-2 text-gray-600">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2 text-gray-600">
          <Settings className="w-4 h-4" />
          <span>Management</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <GraduationCap className="w-4 h-4" />
          <span>Students</span>
        </div>
      </motion.div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/40 rounded-3xl p-6 border border-white/50 shadow-lg backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Students Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Register, manage, and view student profiles
                </p>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="flex gap-3">
              {quickStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="min-w-[110px]"
                  >
                    <div className="bg-white/50 rounded-2xl p-3 shadow-md backdrop-blur-sm hover:shadow-lg transition-shadow">
                      <div
                        className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xl font-bold mt-2">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* FORM */}
      <StudentsForm onUpdate={reloadStudents} />

      {/* TABLE */}
      <StudentsTable
        students={students}
        loading={loading}
        onView={(student) => {
          if (!student?.id) return;
          setSelectedStudent(student);
        }}
      />

      {/* PROFILE MODAL */}
      {selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentPage;