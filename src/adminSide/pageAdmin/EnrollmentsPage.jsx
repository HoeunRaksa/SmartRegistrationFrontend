import React, { useEffect, useState } from "react";
import EnrollmentForm from "../ConponentsAdmin/EnrollmentForm.jsx";
import EnrollmentsList from "../ConponentsAdmin/EnrollmentsList.jsx";
import { fetchAllEnrollments } from "../../api/admin_course_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { fetchCourses } from "../../api/course_api.jsx";
import { getCachedStudents, getCachedCourses } from "../../utils/dataCache";
import {
  BookOpen,
  Users,
  CheckCircle,
  BarChart3,
} from "lucide-react";

const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Staggered loading to prevent 429 errors
  useEffect(() => {
    loadEnrollments();
    setTimeout(() => loadStudents(), 150); // 150ms delay
    setTimeout(() => loadCourses(), 300);  // 300ms delay
  }, []);

  // ================= LOAD ENROLLMENTS =================
  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const res = await fetchAllEnrollments();
      const data = res.data?.data || res.data || [];
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
      setEnrollments([]);
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
  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= HANDLE SUCCESS =================
  const handleSuccess = () => {
    loadEnrollments();
    setEditingEnrollment(null);
  };

  // ================= HANDLE CANCEL =================
  const handleCancel = () => {
    setEditingEnrollment(null);
  };

  // ================= REAL QUICK STATS =================
  const enrolledCount = enrollments.filter(e => e.status === 'enrolled').length;
  const completedCount = enrollments.filter(e => e.status === 'completed').length;

  const quickStats = [
    {
      label: "Total Enrollments",
      value: enrollments.length,
      color: "from-blue-500 to-cyan-500",
      icon: BookOpen,
    },
    {
      label: "Active Students",
      value: enrolledCount,
      color: "from-green-500 to-emerald-500",
      icon: Users,
    },
    {
      label: "Completed",
      value: completedCount,
      color: "from-purple-500 to-pink-500",
      icon: CheckCircle,
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
      <EnrollmentForm
        editingEnrollment={editingEnrollment}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onUpdate={loadEnrollments}
        students={students}
        courses={courses}
      />

      {/* ================= ENROLLMENTS LIST ================= */}
      <EnrollmentsList
        enrollments={enrollments}
        onEdit={handleEdit}
        onRefresh={loadEnrollments}
      />
    </div>
  );
};

export default EnrollmentsPage;
