// SchedulesPage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScheduleForm from "../ConponentsAdmin/ScheduleForm.jsx";
import SchedulesList from "../ConponentsAdmin/SchedulesList.jsx";
import FormModal from "../../Components/FormModal.jsx";
import { fetchAllSchedules } from "../../api/admin_course_api.jsx";
import { fetchCourseOptions } from "../../api/course_api.jsx";
import { Calendar, Clock, BookOpen } from "lucide-react";

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ✅ staggered loading to reduce 429 risk
  useEffect(() => {
    loadSchedules();
    const t = setTimeout(() => loadCourses(), 150);
    return () => clearTimeout(t);
  }, []);

  // ================= LOAD SCHEDULES =================
  const loadSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const res = await fetchAllSchedules();
      const data = res.data?.data || res.data || [];
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load schedules:", error);
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // ================= LOAD COURSES =================
  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await fetchCourseOptions();

      // ✅ Handle different response structures safely
      const data = res.data?.data || res.data || res || [];
      const coursesArray = Array.isArray(data) ? data : [];

      console.log('✅ Loaded courses:', coursesArray.length, coursesArray);
      setCourses(coursesArray);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  // ================= HANDLE EDIT =================
  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  // ================= HANDLE SUCCESS =================
  const handleSuccess = () => {
    loadSchedules();
    setEditingSchedule(null);
  };

  // ================= HANDLE CANCEL =================
  const handleCancel = () => {
    setEditingSchedule(null);
  };

  // ================= QUICK STATS =================
  const totalCourses = new Set((schedules || []).map((s) => s.course_id)).size;
  const totalDays = new Set((schedules || []).map((s) => s.day_of_week)).size;

  const isLoading = loadingSchedules || loadingCourses;

  const quickStats = [
    {
      label: "Total Schedules",
      value: schedules.length,
      color: "from-blue-500 to-cyan-500",
      icon: Calendar,
    },
    {
      label: "Courses",
      value: totalCourses,
      color: "from-green-500 to-emerald-500",
      icon: BookOpen,
    },
    {
      label: "Active Days",
      value: totalDays,
      color: "from-purple-500 to-pink-500",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
          <p className="text-sm text-gray-600 font-medium">Manage academic session timings and course scheduling.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingSchedule(null);
            setIsFormOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Add Schedule
        </motion.button>
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
                    {isLoading ? "…" : stat.value}
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
          setEditingSchedule(null);
        }}
        maxWidth="max-w-4xl"
      >
        <ScheduleForm
          editingSchedule={editingSchedule}
          onSuccess={() => {
            handleSuccess();
            setIsFormOpen(false);
          }}
          onCancel={() => {
            handleCancel();
            setIsFormOpen(false);
          }}
          onUpdate={loadSchedules}
          courses={courses}
        />
      </FormModal>

      {/* ================= SCHEDULES LIST ================= */}
      <SchedulesList
        schedules={schedules}
        onEdit={handleEdit}
        onRefresh={loadSchedules}
      />
    </div>
  );
};

export default SchedulesPage;