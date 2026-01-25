/* ========================= EnrollmentsList.jsx (FULL) ========================= */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Users,
  BookOpen,
  Calendar,
  Award,
  XCircle,
  CheckCircle2,
  X,
} from "lucide-react";

const STATUS_STYLES = {
  enrolled: {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-300",
    text: "text-emerald-700",
    icon: CheckCircle2,
    label: "Enrolled",
  },
  completed: {
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-300",
    text: "text-blue-700",
    icon: Award,
    label: "Completed",
  },
  dropped: {
    bg: "from-red-50 to-rose-50",
    border: "border-red-300",
    text: "text-red-700",
    icon: XCircle,
    label: "Dropped",
  },
};

const EnrollmentsList = ({
  enrollments = [],
  loading = false,
  onEdit,
  onDelete, // optional
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredEnrollments = useMemo(() => {
    let result = Array.isArray(enrollments) ? enrollments : [];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((e) =>
        String(e.student_name || "").toLowerCase().includes(search) ||
        String(e.student_code || "").toLowerCase().includes(search) ||
        String(e.course_name || "").toLowerCase().includes(search) ||
        String(e.subject_name || "").toLowerCase().includes(search) ||
        String(e.class_name || "").toLowerCase().includes(search) ||
        String(e.email || "").toLowerCase().includes(search)
      );
    }

    if (selectedStatus) {
      result = result.filter((e) => e.status === selectedStatus);
    }

    return result;
  }, [enrollments, searchTerm, selectedStatus]);

  const stats = useMemo(() => {
    const total = enrollments.length;
    const enrolled = enrollments.filter((e) => e.status === "enrolled").length;
    const completed = enrollments.filter((e) => e.status === "completed").length;
    const dropped = enrollments.filter((e) => e.status === "dropped").length;
    return { total, enrolled, completed, dropped };
  }, [enrollments]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Enrollments" value={stats.total} icon={Users} gradient="from-blue-500 to-indigo-600" bgGradient="from-blue-50 to-indigo-50" />
        <StatCard title="Active Students" value={stats.enrolled} icon={CheckCircle2} gradient="from-emerald-500 to-teal-600" bgGradient="from-emerald-50 to-teal-50" />
        <StatCard title="Completed" value={stats.completed} icon={Award} gradient="from-purple-500 to-pink-600" bgGradient="from-purple-50 to-pink-50" />
        <StatCard title="Dropped" value={stats.dropped} icon={XCircle} gradient="from-red-500 to-rose-600" bgGradient="from-red-50 to-rose-50" />
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-2xl border-2 border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-3xl -ml-24 -mb-24" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Enrollments</h2>
                <p className="text-sm font-medium text-gray-600">
                  Manage student course enrollments • {filteredEnrollments.length} results
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  showFilters
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30"
                    : "bg-white/80 text-gray-700 border-2 border-white/60 hover:border-blue-300"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {selectedStatus && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-black">1</span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 border-2 border-white/60 hover:border-purple-300 font-bold text-sm text-gray-700 transition-all shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Refreshing..." : "Refresh"}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-xl border-2 border-white/60 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full rounded-xl bg-white border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      >
                        <option value="">All Statuses</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>

                    <div className="md:col-span-3 flex items-end justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedStatus("");
                          setSearchTerm("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
              <Search className="w-4 h-4 text-blue-700" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, code, course, subject, email..."
              className="w-full pl-14 pr-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-xl text-sm font-medium text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md placeholder:text-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredEnrollments.length === 0 ? (
            <EmptyState hasSearch={!!searchTerm || !!selectedStatus} />
          ) : (
            <EnrollmentsTable enrollments={filteredEnrollments} onEdit={onEdit} onDelete={onDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, gradient, bgGradient }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgGradient} backdrop-blur-xl border-2 border-white/60 p-5 shadow-lg hover:shadow-xl transition-all`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900">{Number(value || 0).toLocaleString()}</p>
      </div>
      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-12 -mb-12" />
  </motion.div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 mb-4"
    />
    <p className="text-sm font-bold text-gray-600">Loading enrollments...</p>
  </div>
);

const EmptyState = ({ hasSearch }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
      <BookOpen className="w-10 h-10 text-gray-400" />
    </div>
    <p className="text-sm font-bold text-gray-900 mb-1">{hasSearch ? "No enrollments found" : "No enrollments yet"}</p>
    <p className="text-xs text-gray-600">{hasSearch ? "Try adjusting your search or filters" : "Enroll students to get started"}</p>
  </div>
);

const EnrollmentsTable = ({ enrollments, onEdit, onDelete }) => (
  <div className="overflow-x-auto rounded-2xl border-2 border-white/60 bg-white/50 backdrop-blur-xl shadow-inner">
    <table className="min-w-full">
      <thead className="bg-gradient-to-r from-white/80 to-gray-50/80 sticky top-0">
        <tr className="border-b-2 border-white/60">
          <th className="px-4 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              Student
            </div>
          </th>
          <th className="px-4 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              Course Details
            </div>
          </th>
          <th className="px-4 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Period
            </div>
          </th>
          <th className="px-4 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wide">Status</th>
          <th className="px-4 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wide">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/60">
        {enrollments.map((enrollment) => (
          <EnrollmentRow key={enrollment.id} enrollment={enrollment} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  </div>
);

const EnrollmentRow = ({ enrollment, onEdit, onDelete }) => {
  const statusConfig = STATUS_STYLES[enrollment.status] || STATUS_STYLES.enrolled;
  const StatusIcon = statusConfig.icon;

  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/60 transition-all">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {enrollment.profile_picture_url ? (
            <img
              src={enrollment.profile_picture_url}
              alt={enrollment.student_name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shadow-md ${
              enrollment.profile_picture_url ? "hidden" : "flex"
            }`}
          >
            <span className="text-lg font-black text-white">
              {String(enrollment.student_name || "?").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-gray-900 break-words whitespace-normal">{enrollment.student_name}</p>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold">
                {enrollment.student_code}
              </span>
              {enrollment.email && (
                <span className="text-xs text-gray-600 font-medium break-words whitespace-normal">{enrollment.email}</span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="space-y-1 min-w-[260px]">
          <p
            className="text-sm font-bold text-gray-900 whitespace-normal break-words"
            title={enrollment.course_name || enrollment.subject_name || ""}
          >
            {enrollment.course_name || enrollment.subject_name}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {enrollment.subject_name && (
              <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                {enrollment.subject_name}
              </span>
            )}
            {enrollment.class_name && (
              <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">
                {enrollment.class_name}
              </span>
            )}
            {enrollment.academic_year && (
              <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
                {enrollment.academic_year}
              </span>
            )}
            {enrollment.semester && (
              <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
                Sem {enrollment.semester}
              </span>
            )}
            {enrollment.teacher_name && (
              <span className="text-xs text-gray-600 font-medium break-words whitespace-normal">
                Teacher: {enrollment.teacher_name}
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="space-y-1">
          {enrollment.academic_year && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-bold text-gray-700 break-words whitespace-normal">{enrollment.academic_year}</span>
            </div>
          )}
          {enrollment.semester && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100">
              <span className="text-xs font-bold text-blue-700">Sem {enrollment.semester}</span>
            </div>
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${statusConfig.bg} border-2 ${statusConfig.border} shadow-sm`}
        >
          <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
          <span className={`text-xs font-black ${statusConfig.text}`}>{statusConfig.label}</span>
        </div>

        {enrollment.progress !== null && enrollment.progress !== undefined && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-gray-600">Progress</span>
              <span className="font-bold text-gray-900">{Number(enrollment.progress)}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Number(enrollment.progress)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        )}
      </td>

      <td className="px-4 py-4">
        <div className="flex justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit?.(enrollment)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 border-2 border-white/60 hover:border-blue-300 hover:shadow-lg transition-all"
            type="button"
          >
            <Edit3 className="w-4 h-4 text-gray-700" />
            <span className="text-xs font-bold text-gray-800">Edit</span>
          </motion.button>

          {typeof onDelete === "function" && (
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.confirm(`Delete enrollment for ${enrollment.student_name}?`)) {
                  onDelete(enrollment.id);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 hover:from-red-100 hover:to-rose-100 hover:shadow-lg transition-all"
              type="button"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-700">Delete</span>
            </motion.button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default EnrollmentsList;
