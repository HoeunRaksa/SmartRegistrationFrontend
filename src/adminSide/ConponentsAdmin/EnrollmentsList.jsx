import { motion } from "framer-motion";
import { deleteEnrollment } from "../../api/admin_course_api.jsx";
import {
  BookOpen,
  Trash2,
  Edit,
  User,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

/* ================== ANIMATION VARIANTS ================== */

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

/* ================== COMPONENT ================== */

const EnrollmentsList = ({ enrollments, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;

    try {
      await deleteEnrollment(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete enrollment:", err);
      alert(err.response?.data?.message || "Failed to delete enrollment");
    }
  };

  return (
    <motion.div
      variants={animations.fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Enrollments</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {enrollments.length} Total
        </span>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrollments.map((enrollment, index) => (
                <EnrollmentRow
                  key={enrollment.id}
                  enrollment={enrollment}
                  index={index}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <BookOpen className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No enrollments yet</p>
    <p className="text-sm text-gray-400 mt-1">Enroll students in courses to get started</p>
  </motion.div>
);

const EnrollmentRow = ({ enrollment, index, onEdit, onDelete }) => {
  const statusConfig = {
    enrolled: { icon: CheckCircle2, color: "green", label: "Enrolled" },
    dropped: { icon: XCircle, color: "red", label: "Dropped" },
    completed: { icon: CheckCircle2, color: "blue", label: "Completed" },
  };

  const status = statusConfig[enrollment.status] || statusConfig.enrolled;
  const StatusIcon = status.icon;

  return (
    <motion.tr
      variants={animations.row}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      className="hover:bg-blue-50/30 transition-colors duration-200"
    >
      {/* Index */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Hash className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm font-medium text-gray-900">{index + 1}</span>
        </div>
      </td>

      {/* Student */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {enrollment.student?.name || enrollment.student_name || `Student #${enrollment.student_id}`}
            </div>
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">
          {enrollment.course?.title || enrollment.course_name || `Course #${enrollment.course_id}`}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 text-xs bg-${status.color}-100 text-${status.color}-600 px-2.5 py-1 rounded-full font-medium`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </td>

      {/* Progress */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${enrollment.progress || 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 font-medium">{enrollment.progress || 0}%</span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(enrollment)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit Enrollment"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(enrollment.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete Enrollment"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default EnrollmentsList;
