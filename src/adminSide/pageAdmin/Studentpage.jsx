import React, { useEffect, useState } from "react";
import StudentsForm from "../ConponentsAdmin/StudentsForm.jsx";
import StudentsTable from "../ConponentsAdmin/Studentstable.jsx";
import StudentProfile from "../../gobalConponent/Studentprofile.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import {
  GraduationCap,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchStudents();
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

  const handleEdit = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickStats = [
    { label: "Total", value: students.length, color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Active", value: students.length, color: "from-green-500 to-emerald-500", icon: TrendingUp },
    { label: "Departments", value: new Set(students.map(s => s.department_id)).size || 0, color: "from-purple-500 to-pink-500", icon: BarChart3 },
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
      <StudentsForm 
        onUpdate={reloadStudents}
        editingStudent={editingStudent}
        onCancelEdit={() => setEditingStudent(null)}
      />

      {/* ================= TABLE ================= */}
      <StudentsTable
        students={students}
        loading={loading}
        onView={(student) => {
          if (!student?.id) return;
          setSelectedStudent(student);
        }}
        onUpdate={reloadStudents}
        onEdit={handleEdit}
      />

      {/* ================= PROFILE MODAL ================= */}
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
