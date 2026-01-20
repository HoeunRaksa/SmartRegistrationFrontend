import React, { useEffect, useState } from "react";
import AssignmentForm from "../ConponentsAdmin/AssignmentForm.jsx";
import AssignmentsList from "../ConponentsAdmin/AssignmentsList.jsx";
import { fetchAllAssignments } from "../../api/admin_course_api.jsx";
import { fetchCourses } from "../../api/course_api.jsx";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssignments();
    loadCourses();
  }, []);

  // ================= LOAD ASSIGNMENTS =================
  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetchAllAssignments();
      const data = res.data?.data || res.data || [];
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load assignments:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD COURSES =================
  const loadCourses = async () => {
    try {
      const res = await fetchCourses();
      const data = res.data?.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourses([]);
    }
  };

  // ================= HANDLE EDIT =================
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <AssignmentForm
        editingAssignment={editingAssignment}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onUpdate={loadAssignments}
        courses={courses}
      />

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
