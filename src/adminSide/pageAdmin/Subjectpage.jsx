import React, { useEffect, useState } from "react";
import SubjectsForm from "../ConponentsAdmin/SubjectsForm.jsx";
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
      value:
        subjects.length === 0
          ? 0
          : Math.round(students.length / subjects.length),
      color: "from-purple-500 to-pink-500",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all"
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

      {/* ================= FORM ================= */}
      <SubjectsForm onUpdate={loadSubjects} />
    </div>
  );
};

export default SubjectsPage;
