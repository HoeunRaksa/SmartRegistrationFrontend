import { useEffect, useState } from "react";
import ClassSessionForm from "../ConponentsAdmin/ClassSessionForm.jsx";
import ClassSessionsList from "../ConponentsAdmin/ClassSessionsList.jsx";
import { fetchAllSessions, generateSessions } from "../../api/course_api.jsx";
import { fetchCourseOptions } from "../../api/course_api.jsx";
import { fetchBuildingOptions } from "../../api/building_api.jsx";
import { Calendar, Clock, Hash, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ClassSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    course_id: "",
  });

  useEffect(() => {
    loadSessions();
    loadCourses();
    loadBuildings();
  }, []);

  const loadSessions = async (customFilters = {}) => {
    try {
      setLoading(true);
      const params = { ...filters, ...customFilters };
      const res = await fetchAllSessions(params);
      const data = res.data?.data || res.data || [];
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await fetchCourseOptions();
      const data = res.data?.data || res.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourses([]);
    }
  };

  const loadBuildings = async () => {
    try {
      const res = await fetchBuildingOptions();
      const data = res.data?.data || res.data || [];
      setBuildings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load buildings:", error);
      setBuildings([]);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    loadSessions();
    setEditingSession(null);
  };

  const handleCancel = () => {
    setEditingSession(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    loadSessions(filters);
  };

  const handleClearFilters = () => {
    setFilters({ start_date: "", end_date: "", course_id: "" });
    loadSessions({});
  };

  const handleGenerateSessions = async () => {
    if (!window.confirm("Generate sessions from schedules? This will create sessions for the date range specified.")) {
      return;
    }

    const startDate = prompt("Enter start date (YYYY-MM-DD):", "2026-01-27");
    const endDate = prompt("Enter end date (YYYY-MM-DD):", "2026-05-30");

    if (!startDate || !endDate) return;

    try {
      setGenerating(true);
      const res = await generateSessions({
        start_date: startDate,
        end_date: endDate,
        overwrite: false,
      });

      alert(res.data?.message || "Sessions generated successfully!");
      loadSessions();
    } catch (error) {
      console.error("Failed to generate sessions:", error);
      alert(error.response?.data?.message || "Failed to generate sessions");
    } finally {
      setGenerating(false);
    }
  };

  const upcomingSessions = sessions.filter((s) => new Date(s.session_date) >= new Date()).length;
  const pastSessions = sessions.filter((s) => new Date(s.session_date) < new Date()).length;
  const uniqueCourses = new Set(sessions.map((s) => s.course_id)).size;

  const quickStats = [
    {
      label: "Total Sessions",
      value: sessions.length,
      color: "from-blue-500 to-cyan-500",
      icon: Calendar,
    },
    {
      label: "Upcoming",
      value: upcomingSessions,
      color: "from-green-500 to-emerald-500",
      icon: Clock,
    },
    {
      label: "Courses",
      value: uniqueCourses,
      color: "from-purple-500 to-pink-500",
      icon: Hash,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* Quick Stats */}
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
                  <p className="text-2xl font-bold text-gray-900">{loading ? "…" : stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerateSessions}
        disabled={generating}
        className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" />
          {generating ? "Generating Sessions..." : "Generate Sessions from Schedules"}
        </span>
      </motion.button>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="rounded-xl bg-white/70 px-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="Start Date"
          />
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="rounded-xl bg-white/70 px-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="End Date"
          />
          <select
            name="course_id"
            value={filters.course_id}
            onChange={handleFilterChange}
            className="rounded-xl bg-white/70 px-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display_name || c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <ClassSessionForm
        editingSession={editingSession}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onUpdate={loadSessions}
        courses={courses}
        buildings={buildings}
      />

      {/* List */}
      <ClassSessionsList sessions={sessions} onEdit={handleEdit} onRefresh={loadSessions} />
    </div>
  );
};

export default ClassSessionsPage;