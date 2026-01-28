import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AssignmentForm from "../ConponentsAdmin/AssignmentForm.jsx";
import AssignmentsList from "../ConponentsAdmin/AssignmentsList.jsx";
import FormModal from "../../Components/FormModal.jsx";
import { fetchAllAssignments } from "../../api/admin_course_api.jsx";
import { fetchCourses } from "../../api/course_api.jsx";
import { getCachedCourses } from "../../utils/dataCache";
import {
  FileText,
  BookOpen,
  Clock,
  CheckSquare,
} from "lucide-react";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Staggered loading to prevent 429 errors
  useEffect(() => {
    loadAssignments(selectedCourse);
    setTimeout(() => loadCourses(), 100); // 100ms delay
  }, [selectedCourse]);

  // ================= LOAD ASSIGNMENTS =================
  const loadAssignments = async (courseId = "") => {
    try {
      setLoading(true);
      const res = await fetchAllAssignments(courseId);
      const data = res.data?.data || res.data || [];
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load assignments:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
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
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  };

  // ================= HANDLE SUCCESS =================
  const handleSuccess = () => {
    loadAssignments();
    setEditingAssignment(null);
  };

  // ================= HANDLE CANCEL =================
  const handleCancel = () => {
    setEditingAssignment(null);
  };

  // ================= REAL QUICK STATS =================
  const totalCourses = new Set(assignments.map(a => a.course_id)).size;
  const totalPoints = assignments.reduce((sum, a) => sum + (parseFloat(a.points) || 0), 0);

  const quickStats = [
    {
      label: "Total Assignments",
      value: assignments.length,
      color: "from-blue-500 to-cyan-500",
      icon: FileText,
    },
    {
      label: "Courses",
      value: totalCourses,
      color: "from-green-500 to-emerald-500",
      icon: BookOpen,
    },
    {
      label: "Total Points",
      value: totalPoints,
      color: "from-purple-500 to-pink-500",
      icon: CheckSquare,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* ================= FILTER ================= */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          Assignments Management
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-600">Filter Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="flex-1 sm:w-64 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.display_name || course.course_name || `${course.course_code || 'Course'} - ${course.id}`}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingAssignment(null);
              setIsFormOpen(true);
            }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Add Assignment
          </motion.button>
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

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAssignment(null);
        }}
        maxWidth="max-w-4xl"
      >
        <AssignmentForm
          editingAssignment={editingAssignment}
          onSuccess={() => {
            handleSuccess();
            setIsFormOpen(false);
          }}
          onCancel={() => {
            handleCancel();
            setIsFormOpen(false);
          }}
          onUpdate={loadAssignments}
          courses={courses}
        />
      </FormModal>

      {/* ================= ASSIGNMENTS LIST ================= */}
      <AssignmentsList
        assignments={assignments}
        onEdit={handleEdit}
        onRefresh={loadAssignments}
      />
    </div>
  );
};

export default AssignmentsPage;
