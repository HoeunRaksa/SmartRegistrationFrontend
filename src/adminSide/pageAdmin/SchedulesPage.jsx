// SchedulesPage.jsx
import { useEffect, useMemo, useState } from "react";
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
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

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

  const filteredSchedules = useMemo(() => {
    return (schedules || []).filter((s) => {
      const course = s.course || {};
      const matchYear = filterYear ? String(course.academic_year || s.academic_year) === String(filterYear) : true;
      const matchSem = filterSemester ? String(course.semester || s.semester) === String(filterSemester) : true;
      return matchYear && matchSem;
    });
  }, [schedules, filterYear, filterSemester]);

  // ================= QUICK STATS =================
  const totalCourses = new Set((filteredSchedules || []).map((s) => s.course_id)).size;
  const totalDays = new Set((filteredSchedules || []).map((s) => s.day_of_week)).size;

  const isLoading = loadingSchedules || loadingCourses;

  const quickStats = [
    {
      label: "Filtered Schedules",
      value: filteredSchedules.length,
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

      {/* ================= FILTERS ================= */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Academic Year</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Academic Years</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Semester</label>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setFilterYear(""); setFilterSemester(""); }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
        >
          Clear Filters
        </motion.button>
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
        schedules={filteredSchedules}
        onEdit={handleEdit}
        onRefresh={loadSchedules}
      />
    </div>
  );
};

export default SchedulesPage;