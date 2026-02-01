/* ========================= EnrollmentsList.jsx (OPTIMIZED WITH COLLAPSIBLE DETAILS) ========================= */
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
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  User,
  Hash,
} from "lucide-react";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";
import Alert from "../../gobalConponent/Alert.jsx";

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
  onDelete,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [confirm, setConfirm] = useState({ show: false, id: null, studentName: "" });
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const handleDelete = (id, studentName) => {
    setConfirm({ show: true, id, studentName });
  };

  const executeDelete = async () => {
    if (!confirm.id) return;
    try {
      if (onDelete) await onDelete(confirm.id);
    } catch (err) {
      console.error("Failed to delete enrollment:", err);
      setAlert({ show: true, message: err.response?.data?.message || "Failed to delete enrollment", type: "error" });
    } finally {
      setConfirm({ show: false, id: null, studentName: "" });
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredEnrollments = useMemo(() => {
    let result = Array.isArray(enrollments) ? enrollments : [];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrollments"
          value={stats.total}
          icon={Users}
          gradient="from-blue-500 to-indigo-600"
          bgGradient="from-blue-50 to-indigo-50"
        />
        <StatCard
          title="Active Students"
          value={stats.enrolled}
          icon={CheckCircle2}
          gradient="from-emerald-500 to-teal-600"
          bgGradient="from-emerald-50 to-teal-50"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={Award}
          gradient="from-purple-500 to-pink-600"
          bgGradient="from-purple-50 to-pink-50"
        />
        <StatCard
          title="Dropped"
          value={stats.dropped}
          icon={XCircle}
          gradient="from-red-500 to-rose-600"
          bgGradient="from-red-50 to-rose-50"
        />
      </div>

      {/* Main Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-2xl border-2 border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-3xl -ml-24 -mb-24" />

        <div className="relative z-10">
          {/* Header */}
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${showFilters
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

          {/* Filters */}
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

          {/* Search */}
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

          {/* Table */}
          {loading ? (
            <LoadingState />
          ) : filteredEnrollments.length === 0 ? (
            <EmptyState hasSearch={!!searchTerm || !!selectedStatus} />
          ) : (
            <EnrollmentsTable
              enrollments={filteredEnrollments}
              onEdit={onEdit}
              onDelete={handleDelete}
              expandedRows={expandedRows}
              toggleRow={toggleRow}
            />
          )}

          <Alert
            isOpen={alert.show}
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />

          <ConfirmDialog
            isOpen={confirm.show}
            title="Confirm Delete"
            message={`Are you sure you want to delete the enrollment for ${confirm.studentName}? This action cannot be undone.`}
            onConfirm={executeDelete}
            onCancel={() => setConfirm({ show: false, id: null, studentName: "" })}
            confirmText="Delete"
            type="danger"
          />
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
    <p className="text-sm font-bold text-gray-900 mb-1">
      {hasSearch ? "No enrollments found" : "No enrollments yet"}
    </p>
    <p className="text-xs text-gray-600">
      {hasSearch ? "Try adjusting your search or filters" : "Enroll students to get started"}
    </p>
  </div>
);

const EnrollmentsTable = ({ enrollments, onEdit, onDelete, expandedRows, toggleRow }) => {
  // Group by student to satisfy "dont show the same student in list"
  const groupedEnrollments = useMemo(() => {
    const map = new Map();
    const list = [];

    enrollments.forEach((e) => {
      const sid = String(e.student_id);
      if (!map.has(sid)) {
        const group = {
          student_id: e.student_id,
          student_name: e.student_name,
          student_code: e.student_code,
          profile_picture_url: e.profile_picture_url,
          email: e.email,
          phone_number: e.phone,
          address: e.address,
          academic_year: e.academic_year,
          semester: e.semester,
          department_id: e.department_id,
          major_name: e.major_name,
          courses: [],
        };
        map.set(sid, group);
        list.push(group);
      }
      map.get(sid).courses.push(e);
    });

    return list;
  }, [enrollments]);

  return (
    <div className="space-y-4">
      {groupedEnrollments.map((group) => (
        <StudentEnrollmentCard
          key={group.student_id}
          group={group}
          onEdit={onEdit}
          onDelete={onDelete}
          isExpanded={expandedRows.has(group.student_id)}
          onToggle={() => toggleRow(group.student_id)}
        />
      ))}
    </div>
  );
};

const StudentEnrollmentCard = ({ group, onEdit, onDelete, isExpanded, onToggle }) => {
  const enrollmentCount = group.courses.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
    >
      {/* Main Row */}
      <div className="p-5">
        <div className="flex items-start gap-5">
          {/* Expand Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="mt-1.5 p-2 rounded-xl bg-white/80 border-2 border-white/60 hover:border-blue-300 transition-all flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-700" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-700" />
            )}
          </motion.button>

          {/* Avatar */}
          <div className="flex-shrink-0">
            {group.profile_picture_url ? (
              <img
                src={group.profile_picture_url}
                alt={group.student_name}
                className="w-16 h-16 rounded-[1.25rem] object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shadow-md ${group.profile_picture_url ? "hidden" : "flex"
                }`}
            >
              <span className="text-2xl font-black text-white">
                {String(group.student_name || "?").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Student Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-gray-900 mb-1">{group.student_name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black">
                    {group.student_code}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider">
                    {group.major_name}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black shadow-lg shadow-blue-500/20">
                  {enrollmentCount} {enrollmentCount === 1 ? 'COURSE' : 'COURSES'}
                </span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollment Status</p>
              </div>
            </div>

            {/* Courses Overview */}
            <div className="flex flex-wrap gap-2">
              {group.courses.slice(0, 3).map((e, i) => (
                <span key={e.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/60 border border-white/40 text-xs font-semibold text-gray-700">
                  <BookOpen className="w-3 h-3 text-blue-500" />
                  {e.course_name || e.subject_name}
                </span>
              ))}
              {enrollmentCount > 3 && (
                <span className="text-xs font-black text-blue-600 flex items-center px-2">+{enrollmentCount - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Enrollments Table */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-2 border-white/60 bg-gray-50/30"
          >
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1 space-y-4">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Student Records</h4>
                  <div className="space-y-2">
                    <DetailItem icon={Mail} label="Contact Email" value={group.email} />
                    <DetailItem icon={Phone} label="Phone Line" value={group.phone_number} />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 px-1">Subscribed Courses</h4>
                  <div className="space-y-3">
                    {group.courses.map((enrollment) => {
                      const statusStyle = STATUS_STYLES[enrollment.status] || STATUS_STYLES.enrolled;
                      const Icon = statusStyle.icon;
                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-white/60 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${statusStyle.bg} border ${statusStyle.border}`}>
                              <Icon className={`w-4 h-4 ${statusStyle.text}`} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900">{enrollment.course_name || enrollment.subject_name}</p>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                {enrollment.class_name} • Sem {enrollment.semester} • {enrollment.academic_year}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <p className={`text-xs font-black ${statusStyle.text}`}>{statusStyle.label}</p>
                              {enrollment.progress !== null && (
                                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{enrollment.progress}% Complete</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onEdit?.(enrollment)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onDelete?.(enrollment.id, group.student_name)}
                                className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

{/* Progress Bar (if exists) */ }
{
  enrollment.progress !== null && enrollment.progress !== undefined && (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-gray-600">Progress</span>
        <span className="font-bold text-gray-900">{Number(enrollment.progress)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Number(enrollment.progress)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
        />
      </div>
    </div>
  )
}
      </div >

  {/* Expanded Details - Only Shown When Clicked */ }
  < AnimatePresence >
  { isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border-t-2 border-white/60 bg-gradient-to-br from-white/60 to-gray-50/60 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Details */}
          <div>
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Student Information
            </h4>
            <div className="space-y-2.5">
              <DetailItem icon={Hash} label="Student Code" value={enrollment.student_code} />
              <DetailItem icon={User} label="Full Name" value={enrollment.student_name} />
              <DetailItem icon={Mail} label="Email" value={enrollment.email} />
              <DetailItem icon={Phone} label="Phone" value={enrollment.phone_number} />
              <DetailItem icon={MapPin} label="Address" value={enrollment.address} />
            </div>
          </div>

          {/* Course Details */}
          <div>
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Course Information
            </h4>
            <div className="space-y-2.5">
              <DetailItem label="Course" value={enrollment.course_name} />
              <DetailItem label="Subject" value={enrollment.subject_name} />
              <DetailItem label="Class" value={enrollment.class_name} />
              <DetailItem label="Teacher" value={enrollment.teacher_name} />
              <DetailItem label="Academic Year" value={enrollment.academic_year} />
              <DetailItem label="Semester" value={enrollment.semester ? `Semester ${enrollment.semester}` : null} />
              {enrollment.enrolled_at && (
                <DetailItem
                  label="Enrolled Date"
                  value={new Date(enrollment.enrolled_at).toLocaleDateString()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )}
      </AnimatePresence >
    </motion.div >
  );
};

const DetailItem = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg bg-white/60 border border-white/40">
      {Icon && (
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-blue-700" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-600 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
};

export default EnrollmentsList;