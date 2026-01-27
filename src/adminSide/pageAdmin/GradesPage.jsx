import React, { useEffect, useState } from "react";
import GradeForm from "../ConponentsAdmin/GradeForm.jsx";
import GradesList from "../ConponentsAdmin/GradesList.jsx";
import { fetchAllGrades } from "../../api/admin_course_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { fetchCourses } from "../../api/course_api.jsx";
import { getCachedStudents, getCachedCourses } from "../../utils/dataCache";
import {
  Award,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Staggered loading to prevent 429 errors
  useEffect(() => {
    loadGrades();
    setTimeout(() => loadStudents(), 150); // 150ms delay
    setTimeout(() => loadCourses(), 300);  // 300ms delay
  }, []);

  // Update when filter changes
  useEffect(() => {
    loadGrades(selectedCourse);
  }, [selectedCourse]);

  // ================= LOAD GRADES =================
  const loadGrades = async (courseId = "") => {
    try {
      setLoading(true);
      const res = await fetchAllGrades(courseId);
      const data = res.data?.data || res.data || [];
      setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load grades:", error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD STUDENTS (WITH CACHING) =================
  const loadStudents = async () => {
    try {
      const res = await getCachedStudents(fetchStudents);
      const data = res.data?.data || res.data || [];
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    }
  };

  // ================= LOAD COURSES (WITH CACHING) =================
  const loadCourses = async () => {
    try {
      const res = await getCachedCourses(fetchCourses);
      const data = res.data?.data || res.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourses([]);
    }
  };

  // ================= HANDLE EDIT =================
  const handleEdit = (grade) => {
    setEditingGrade(grade);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= HANDLE SUCCESS =================
  const handleSuccess = () => {
    loadGrades();
    setEditingGrade(null);
  };

  // ================= HANDLE CANCEL =================
  const handleCancel = () => {
    setEditingGrade(null);
  };

  // ================= REAL QUICK STATS =================
  const averageGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + (parseFloat(g.grade_point) || 0), 0) / grades.length).toFixed(2)
    : 0;

  const quickStats = [
    {
      label: "Total Grades",
      value: grades.length,
      color: "from-purple-500 to-pink-500",
      icon: Award,
    },
    {
      label: "Students Graded",
      value: new Set(grades.map(g => g.student_id)).size,
      color: "from-blue-500 to-cyan-500",
      icon: Users,
    },
    {
      label: "Avg GPA",
      value: averageGrade,
      color: "from-green-500 to-emerald-500",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* ================= FILTER ================= */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          Grades Management
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-600">Filter Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="flex-1 sm:w-64 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name} ({course.course_code})
              </option>
            ))}
          </select>
        </div>
      </div>

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
      <GradeForm
        editingGrade={editingGrade}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onUpdate={loadGrades}
        students={students}
        courses={courses}
      />

      {/* ================= GRADES LIST ================= */}
      <GradesList
        grades={grades}
        onEdit={handleEdit}
        onRefresh={loadGrades}
      />
    </div>
  );
};

export default GradesPage;
