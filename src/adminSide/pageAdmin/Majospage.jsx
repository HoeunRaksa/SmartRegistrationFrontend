import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MajorsForm from '../ConponentsAdmin/MajorsForm.jsx';
import MajorsList from '../ConponentsAdmin/MajorsList.jsx';
import FormModal from "../../Components/FormModal.jsx";
import { fetchMajors } from "../../api/major_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import {
  GraduationCap,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

const MajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingMajor, setEditingMajor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadMajors();
    loadStudents();
  }, []);

  const loadMajors = async () => {
    try {
      const res = await fetchMajors();
      setMajors(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load majors:", err);
      setMajors([]);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await fetchStudents();
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load students:", err);
      setStudents([]);
    }
  };

  const handleEdit = (major) => {
    setEditingMajor(major);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    loadMajors();
    setEditingMajor(null);
  };

  const handleCancel = () => {
    setEditingMajor(null);
  };

  const quickStats = [
    {
      label: "Majors",
      value: majors.length,
      color: "from-green-500 to-emerald-500",
      icon: TrendingUp,
    },
    {
      label: "Students",
      value: students.length,
      color: "from-blue-500 to-cyan-500",
      icon: Users,
    },
    {
      label: "Avg / Major",
      value:
        majors.length === 0
          ? 0
          : Math.round(students.length / majors.length),
      color: "from-purple-500 to-pink-500",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Majors</h1>
          <p className="text-sm text-gray-600 font-medium">Manage academic majors and their associated subjects.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingMajor(null);
            setIsFormOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          Add Major
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
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
          setEditingMajor(null);
        }}
      >
        <MajorsForm
          editingMajor={editingMajor}
          onSuccess={() => {
            handleSuccess();
            setIsFormOpen(false);
          }}
          onCancel={() => {
            handleCancel();
            setIsFormOpen(false);
          }}
        />
      </FormModal>

      {/* ================= MAJORS LIST ================= */}
      <MajorsList
        majors={majors}
        onEdit={handleEdit}
        onRefresh={loadMajors}
      />
    </div>
  );
};

export default MajorsPage;