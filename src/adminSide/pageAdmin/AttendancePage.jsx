import React, { useEffect, useState } from "react";
import AttendanceForm from "../ConponentsAdmin/AttendanceForm.jsx";
import AttendanceList from "../ConponentsAdmin/AttendanceList.jsx";
import { fetchAllAttendance } from "../../api/admin_course_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { fetchCourses } from "../../api/course_api.jsx";
import { getCachedStudents, getCachedCourses } from "../../utils/dataCache";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Staggered loading to prevent 429 errors
  useEffect(() => {
    loadAttendance();
    setTimeout(() => loadStudents(), 150); // 150ms delay
    setTimeout(() => loadCourses(), 300);  // 300ms delay
  }, []);

  // ================= LOAD ATTENDANCE =================
  const loadAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetchAllAttendance();
      const data = res.data?.data || res.data || [];
      setAttendance(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load attendance:", error);
      setAttendance([]);
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
  const handleEdit = (record) => {
    setEditingRecord(record);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= HANDLE SUCCESS =================
  const handleSuccess = () => {
    loadAttendance();
    setEditingRecord(null);
  };

  // ================= HANDLE CANCEL =================
  const handleCancel = () => {
    setEditingRecord(null);
  };

  // ================= REAL QUICK STATS =================
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const attendanceRate = attendance.length > 0
    ? ((presentCount / attendance.length) * 100).toFixed(1)
    : 0;

  const quickStats = [
    {
      label: "Present",
      value: presentCount,
      color: "from-green-500 to-emerald-500",
      icon: CheckCircle,
    },
    {
      label: "Absent",
      value: absentCount,
      color: "from-red-500 to-pink-500",
      icon: XCircle,
    },
    {
      label: "Late",
      value: lateCount,
      color: "from-orange-500 to-yellow-500",
      icon: Clock,
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
      <AttendanceForm
        editingRecord={editingRecord}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onUpdate={loadAttendance}
        students={students}
        courses={courses}
      />

      {/* ================= ATTENDANCE LIST ================= */}
      <AttendanceList
        attendance={attendance}
        onEdit={handleEdit}
        onRefresh={loadAttendance}
      />
    </div>
  );
};

export default AttendancePage;
