import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import StudentsForm from "../ConponentsAdmin/StudentsForm.jsx";
import StudentsTable from "../ConponentsAdmin/Studentstable.jsx";
import StudentProfile from "../../gobalConponent/Studentprofile.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { Users, TrendingUp, BarChart3 } from "lucide-react";

const safeArray = (v) => (Array.isArray(v) ? v : []);

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchStudents();
      const data = res?.data?.data ?? res?.data ?? [];
      setStudents(safeArray(data));
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleEdit = useCallback((student) => {
    if (!student) return;
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleView = useCallback((student) => {
    if (!student?.id) return;
    setSelectedStudent(student);
  }, []);

  const departmentsCount = useMemo(() => {
    const ids = students.map((s) => s?.department_id).filter(Boolean);
    return new Set(ids).size;
  }, [students]);

  const quickStats = useMemo(
    () => [
      { label: "Total Students", value: students.length, color: "from-blue-500 to-cyan-500", icon: Users },
      { label: "Active Students", value: students.length, color: "from-green-500 to-emerald-500", icon: TrendingUp },
      { label: "Departments", value: departmentsCount, color: "from-purple-500 to-pink-500", icon: BarChart3 },
    ],
    [students.length, departmentsCount]
  );

  return (
    <div className="min-h-screen space-y-6">
      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= FORM ================= */}
      <StudentsForm
        onUpdate={loadStudents}
        editingStudent={editingStudent}
        onCancelEdit={() => setEditingStudent(null)}
      />

      {/* ================= TABLE ================= */}
      <StudentsTable
        students={students}
        loading={loading}
        onView={handleView}
        onUpdate={loadStudents}
        onEdit={handleEdit}
      />

      {/* ================= PROFILE MODAL ================= */}
      {selectedStudent && (
        <StudentProfile student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default StudentPage;
