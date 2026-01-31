import { motion } from "framer-motion";
import { updateAttendance } from "../../api/admin_course_api.jsx";
import {
  CheckSquare,
  Edit,
  User,
  Hash,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";
import { useState } from "react";
import Alert from "../../gobalConponent/Alert.jsx";
import { AnimatePresence } from "framer-motion";

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

const AttendanceList = ({ attendance, onEdit, onRefresh }) => {
  const [confirm, setConfirm] = useState({ show: false, id: null, nextStatus: null });
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const handleStatusChange = (id, newStatus) => {
    setConfirm({ show: true, id, nextStatus: newStatus });
  };

  const executeStatusChange = async () => {
    if (!confirm.id || !confirm.nextStatus) return;
    try {
      await updateAttendance(confirm.id, { status: confirm.nextStatus });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update attendance:", err);
      setAlert({ show: true, message: err.response?.data?.message || "Failed to update attendance", type: "error" });
    } finally {
      setConfirm({ show: false, id: null, nextStatus: null });
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
          <CheckSquare className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Attendance Records</h3>
        </div>
        <span className="text-xs bg-green-100 text-green-600 px-3 py-1.5 rounded-full font-semibold">
          {attendance.length} Total
        </span>
      </div>

      {attendance.length === 0 ? (
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
                  Session Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((record, index) => (
                <AttendanceRow
                  key={record.id}
                  record={record}
                  index={index}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {alert.show && (
          <div className="fixed top-20 right-5 z-[9999] w-80">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirm.show}
        title="Change Attendance Status"
        message={`Are you sure you want to change this student's status to ${confirm.nextStatus}?`}
        onConfirm={executeStatusChange}
        onCancel={() => setConfirm({ show: false, id: null, nextStatus: null })}
        confirmText="Change Status"
        type="info"
      />
    </motion.div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <CheckSquare className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No attendance records yet</p>
    <p className="text-sm text-gray-400 mt-1">Mark attendance to track student presence</p>
  </motion.div>
);

const AttendanceRow = ({ record, index, onStatusChange }) => {
  const statusConfig = {
    present: { icon: CheckCircle2, color: "green", label: "Present" },
    absent: { icon: XCircle, color: "red", label: "Absent" },
    late: { icon: Clock, color: "yellow", label: "Late" },
    excused: { icon: AlertCircle, color: "blue", label: "Excused" },
  };

  const status = statusConfig[record.status] || statusConfig.present;
  const StatusIcon = status.icon;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
              {record.student?.name || record.student_name || `Student #${record.student_id}`}
            </div>
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-900">
            {record.class_session?.course?.title || record.course_name || "-"}
          </span>
        </div>
      </td>

      {/* Session Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-900">
            {formatDate(record.class_session?.session_date || record.session_date)}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 text-xs bg-${status.color}-100 text-${status.color}-600 px-2.5 py-1 rounded-full font-medium`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </td>

      {/* Remarks */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-600 max-w-xs truncate">
          {record.remarks || "-"}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-1">
          {record.status !== "present" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onStatusChange(record.id, "present")}
              className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
              title="Mark Present"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            </motion.button>
          )}
          {record.status !== "absent" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onStatusChange(record.id, "absent")}
              className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
              title="Mark Absent"
            >
              <XCircle className="w-3.5 h-3.5 text-red-600" />
            </motion.button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default AttendanceList;
