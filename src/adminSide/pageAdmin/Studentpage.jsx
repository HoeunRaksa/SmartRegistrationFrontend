import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import StudentsForm from "../ConponentsAdmin/StudentsForm.jsx";
import StudentsTable from "../ConponentsAdmin/Studentstable.jsx";
import FormModal from "../../Components/FormModal.jsx";
import StudentProfile from "../../gobalConponent/Studentprofile.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { Users, TrendingUp, BarChart3 } from "lucide-react";

const safeArray = (v) => (Array.isArray(v) ? v : []);

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    setIsFormOpen(true);
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-sm text-gray-600 font-medium">Add, edit and manage university students.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingStudent(null);
            setIsFormOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Add Student
        </motion.button>
      </div>

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

      {/* ================= FORM MODAL ================= */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        maxWidth="max-w-4xl"
      >
        <StudentsForm
          onUpdate={() => {
            loadStudents();
            setIsFormOpen(false);
          }}
          editingStudent={editingStudent}
          onCancelEdit={() => {
            setEditingStudent(null);
            setIsFormOpen(false);
          }}
        />
      </FormModal>

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
