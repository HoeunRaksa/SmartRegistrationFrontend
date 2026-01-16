import React, { useEffect, useState } from "react";

import MajorsForm from '../ConponentsAdmin/MajorsForm.jsx';
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
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FORM ================= */}
      <MajorsForm />
    </div>
  );
};

export default MajorsPage;