/* ========================= EnrollmentsList.jsx ========================= */
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteEnrollment } from "../../api/admin_course_api.jsx";
import {
  BookOpen,
  Trash2,
  Edit,
  User,
  Hash,
  CheckCircle2,
  XCircle,
  Award,
  Settings,
  Eye,
} from "lucide-react";

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  row: {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  },
};

const safeStr = (v, fallback = "") =>
  v === null || v === undefined ? fallback : String(v);

const getStudentLabel = (enrollment) => {
  const st = enrollment?.student || {};
  return (
    st?.student_name ||
    st?.full_name_en ||
    st?.full_name_kh ||
    enrollment?.student_name ||
    st?.name ||
    safeStr(enrollment?.student_code) ||
    `Student #${enrollment?.student_id ?? "-"}`
  );
};

const getCourseLabel = (enrollment) => {
  const co = enrollment?.course || {};
  return (
    co?.course_name ||
    co?.display_name ||
    enrollment?.course_name ||
    co?.title ||
    `Course #${enrollment?.course_id ?? "-"}`
  );
};

const getStudentEmail = (enrollment) => {
  const st = enrollment?.student || {};
  return (
    st?.email ||
    st?.personal_email ||
    st?.student_email ||
    enrollment?.email ||
    "N/A"
  );
};

const getStudentPhone = (enrollment) => {
  const st = enrollment?.student || {};
  return (
    st?.phone_number ||
    st?.phone ||
    st?.student_phone ||
    enrollment?.phone ||
    "N/A"
  );
};

const getStudentAddress = (enrollment) => {
  const st = enrollment?.student || {};
  return (
    st?.address ||
    st?.student_address ||
    enrollment?.address ||
    "N/A"
  );
};

const getStudentImage = (enrollment) => {
  const st = enrollment?.student || {};
  // ✅ your backend accessor appends: profile_picture_url
  return (
    st?.profile_picture_url ||
    enrollment?.profile_picture_url ||
    ""
  );
};

const EnrollmentsList = ({ enrollments = [], onEdit, onRefresh }) => {
  const [visibleColumns, setVisibleColumns] = useState({
    index: true,
    student: true,
    course: true,
    status: true,
    email: true,
    phone: true,
    address: true,
    actions: true,
  });

  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;

    try {
      await deleteEnrollment(id);
      onRefresh?.();
    } catch (err) {
      console.error("Failed to delete enrollment:", err);
      alert(err?.response?.data?.message || "Failed to delete enrollment");
    }
  };

  // ✅ If Tailwind JIT misses dynamic classes, use fixed classes
  const statusConfig = useMemo(
    () => ({
      enrolled: {
        icon: CheckCircle2,
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Enrolled",
      },
      dropped: {
        icon: XCircle,
        gradient: "from-red-500 to-rose-500",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        label: "Dropped",
      },
      completed: {
        icon: Award,
        gradient: "from-blue-500 to-indigo-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        label: "Completed",
      },
    }),
    []
  );

  return (
    <motion.div
      variants={animations.fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 border-2 border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="relative flex  items-center justify-between px-6 py-6 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-50/50 to-transparent" />

        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              All Enrollments
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage student course enrollments
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Total
            </p>
            <p className="text-2xl font-black text-white">{enrollments.length}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowColumnSettings((p) => !p)}
            className="p-3 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 shadow-lg shadow-gray-200 transition-all"
            title="Column Settings"
            type="button"
          >
            <Settings className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Column Settings Panel */}
      <AnimatePresence>
        {showColumnSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50"
          >
            <div className="px-8 py-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-bold text-gray-900">
                  Show/Hide Columns
                </h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <ColumnToggle label="Index #" checked={visibleColumns.index} onChange={() => toggleColumn("index")} />
                <ColumnToggle label="Student" checked={visibleColumns.student} onChange={() => toggleColumn("student")} />
                <ColumnToggle label="Course" checked={visibleColumns.course} onChange={() => toggleColumn("course")} />
                <ColumnToggle label="Email" checked={visibleColumns.email} onChange={() => toggleColumn("email")} />
                <ColumnToggle label="Phone" checked={visibleColumns.phone} onChange={() => toggleColumn("phone")} />
                <ColumnToggle label="Address" checked={visibleColumns.address} onChange={() => toggleColumn("address")} />
                <ColumnToggle label="Status" checked={visibleColumns.status} onChange={() => toggleColumn("status")} />
                <ColumnToggle label="Actions" checked={visibleColumns.actions} onChange={() => toggleColumn("actions")} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {enrollments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r  from-gray-100 to-gray-50 border-b-2 border-gray-200">
                {visibleColumns.index && (
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                )}
                {visibleColumns.student && (
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                )}
                {visibleColumns.course && (
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Course
                  </th>
                )}
                {visibleColumns.email && (
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                )}
                {visibleColumns.phone && (
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                )}
                {visibleColumns.address && (
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Address
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="px-8 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {enrollments.map((enrollment, index) => (
                <EnrollmentRow
                  key={enrollment?.id ?? `row-${index}`}
                  enrollment={enrollment}
                  index={index}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  visibleColumns={visibleColumns}
                  statusConfig={statusConfig}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="relative text-center py-20 px-8"
  >
    <div className="absolute inset-0 flex items-center justify-center opacity-5">
      <div className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-3xl" />
    </div>

    <div className="relative">
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex p-8 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-200 shadow-xl mb-6"
      >
        <BookOpen className="w-16 h-16 text-gray-400" />
      </motion.div>

      <h4 className="text-xl font-bold text-gray-900 mb-2">No Enrollments Yet</h4>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Start enrolling students in courses to build your academic database. Use the form above to create your first
        enrollment.
      </p>
    </div>
  </motion.div>
);

const EnrollmentRow = ({ enrollment, index, onEdit, onDelete, visibleColumns, statusConfig }) => {
  const status = statusConfig[enrollment?.status] || statusConfig.enrolled;
  const StatusIcon = status.icon;

  const studentLabel = getStudentLabel(enrollment);
  const courseLabel = getCourseLabel(enrollment);

  const studentEmail = getStudentEmail(enrollment);
  const studentPhone = getStudentPhone(enrollment);
  const studentAddress = getStudentAddress(enrollment);
  const studentImage = getStudentImage(enrollment);

  // initials fallback
  const initials = useMemo(() => {
    const name = safeStr(studentLabel).trim();
    return name ? name.charAt(0).toUpperCase() : "S";
  }, [studentLabel]);

  return (
    <motion.tr
      variants={animations.row}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.03 }}
      className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
    >
      {/* Index */}
      {visibleColumns.index && (
        <td className="px-8 py-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 group-hover:from-blue-100 group-hover:to-purple-100 transition-all">
              <Hash className="w-4 h-4 text-gray-500 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="text-sm font-bold text-gray-900">{index + 1}</span>
          </div>
        </td>
      )}

      {/* Student */}
      {visibleColumns.student && (
        <td className="px-8 py-5">
          <div className="flex items-center gap-3">
            {/* avatar */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              {studentImage ? (
                <img
                  src={studentImage}
                  alt={studentLabel}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
            </div>

            <div>
              <div className="text-sm font-bold text-gray-900">{studentLabel}</div>
              <div className="text-xs text-gray-500 mt-0.5">ID: {enrollment?.student_id}</div>
            </div>
          </div>
        </td>
      )}

      {/* Course */}
      {visibleColumns.course && (
        <td className="px-8 py-5">
          <div className="max-w-xs">
            <div className="text-sm font-semibold text-gray-900 truncate">{courseLabel}</div>
            <div className="text-xs text-gray-500 mt-0.5">ID: {enrollment?.course_id}</div>
          </div>
        </td>
      )}

      {/* Email */}
      {visibleColumns.email && (
        <td className="px-8 py-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700 truncate max-w-[220px]">{studentEmail}</span>
          </div>
        </td>
      )}

      {/* Phone */}
      {visibleColumns.phone && (
        <td className="px-8 py-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-green-100">
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">{studentPhone}</span>
          </div>
        </td>
      )}

      {/* Address */}
      {visibleColumns.address && (
        <td className="px-8 py-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-100">
              <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700 truncate max-w-[220px]">{studentAddress}</span>
          </div>
        </td>
      )}

      {/* Status */}
      {visibleColumns.status && (
        <td className="px-8 py-5">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs border-2 ${status.bg} ${status.text} ${status.border} shadow-sm`}
          >
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </div>
        </td>
      )}

      {/* Actions */}
      {visibleColumns.actions && (
        <td className="px-8 py-5">
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit?.(enrollment)}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-xl shadow-blue-200"
              title="Edit Enrollment"
              type="button"
            >
              <Edit className="w-4 h-4 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete?.(enrollment?.id)}
              className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-xl shadow-red-200"
              title="Delete Enrollment"
              type="button"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </td>
      )}
    </motion.tr>
  );
};

/* ================== COLUMN TOGGLE COMPONENT ================== */
const ColumnToggle = ({ label, checked, onChange }) => (
  <motion.label
    whileHover={{ scale: 1.02 }}
    className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
  >
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-gradient-to-br peer-checked:from-indigo-500 peer-checked:to-purple-600 peer-checked:border-indigo-500 transition-all flex items-center justify-center">
        {checked && <CheckCircle2 className="w-4 h-4 text-white" />}
      </div>
    </div>
    <span className="text-sm font-semibold text-gray-700">{label}</span>
  </motion.label>
);

export default EnrollmentsList;
