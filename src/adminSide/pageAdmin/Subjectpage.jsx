import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SubjectsForm from "../ConponentsAdmin/SubjectsForm.jsx";
import SubjectsList from "../ConponentsAdmin/SubjectsList.jsx";
import FormModal from "../../Components/FormModal.jsx";
import { fetchSubjects } from "../../api/subject_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import {
  BookOpen,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
    loadStudents();
  }, []);

  // ================= LOAD SUBJECTS =================
  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await fetchSubjects();
      const data = res.data?.data || res.data || [];
      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD STUDENTS =================
  const loadStudents = async () => {
    try {
      const res = await fetchStudents();
      const data = res.data?.data || [];
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    }
  };

  // ================= HANDLE EDIT =================
  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  // ================= HANDLE SUCCESS =================
  const handleSuccess = () => {
    loadSubjects();
    setEditingSubject(null);
  };

  // ================= HANDLE CANCEL =================
  const handleCancel = () => {
    setEditingSubject(null);
  };

  // ================= REAL QUICK STATS =================
  const quickStats = [
    {
      label: "Subjects",
      value: subjects.length,
      color: "from-green-500 to-emerald-500",
      icon: BookOpen,
    },
    {
      label: "Students",
      value: students.length,
      color: "from-blue-500 to-cyan-500",
      icon: Users,
    },
    {
      label: "Avg / Subject",
      value: subjects.length === 0 ? 0 : Math.round(students.length / subjects.length),
      color: "from-purple-500 to-pink-500",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-sm text-gray-600 font-medium">Manage academic subjects and curriculum details.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingSubject(null);
            setIsFormOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Add Subject
        </motion.button>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="glass-card p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "…" : stat.value}
                  </p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FORM MODAL ================= */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSubject(null);
        }}
      >
        <SubjectsForm
          editingSubject={editingSubject}
          onSuccess={() => {
            handleSuccess();
            setIsFormOpen(false);
          }}
          onCancel={() => {
            handleCancel();
            setIsFormOpen(false);
          }}
          onUpdate={loadSubjects}
        />
      </FormModal>

      {/* ================= SUBJECTS LIST ================= */}
      <SubjectsList
        subjects={subjects}
        onEdit={handleEdit}
        onRefresh={loadSubjects}
      />
    </div>
  );
};

export default SubjectsPage;
