import { motion } from "framer-motion";
import { deleteSchedule } from "../../api/admin_course_api.jsx";
import {
  Calendar,
  Trash2,
  Edit,
  Hash,
  BookOpen,
  Clock,
  MapPin,
  Building2,
} from "lucide-react";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";
import { useState } from "react";
import Alert from "../../gobalConponent/Alert.jsx";
import { AnimatePresence } from "framer-motion";

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

const SchedulesList = ({ schedules, onEdit, onRefresh }) => {
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const handleDelete = (id) => {
    setConfirm({ show: true, id });
  };

  const executeDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteSchedule(confirm.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
      setAlert({ show: true, message: err.response?.data?.message || "Failed to delete schedule", type: "error" });
    } finally {
      setConfirm({ show: false, id: null });
    }
  };

  return (
    <motion.div
      variants={animations.fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Schedules</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {schedules.length} Total
        </span>
      </div>

      {schedules.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Room</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule, index) => (
                <ScheduleRow
                  key={schedule.id}
                  schedule={schedule}
                  index={index}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
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
        message="Are you sure you want to delete this schedule? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Calendar className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No schedules yet</p>
    <p className="text-sm text-gray-400 mt-1">Create class schedules to organize courses</p>
  </motion.div>
);

const ScheduleRow = ({ schedule, index, onEdit, onDelete }) => {
  const dayColors = {
    Monday: "blue",
    Tuesday: "purple",
    Wednesday: "green",
    Thursday: "orange",
    Friday: "pink",
    Saturday: "yellow",
    Sunday: "red",
  };

  const dayColor = dayColors[schedule.day_of_week] || "gray";

  // ✅ Build room display from backend data
  const roomDisplay = schedule.room_full_name ||
    (schedule.building_code && schedule.room_number
      ? `${schedule.building_code}-${schedule.room_number}`
      : schedule.room_number || schedule.room || null);

  return (
    <motion.tr
      variants={animations.row}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      className="hover:bg-blue-50/30 transition-colors duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Hash className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm font-medium text-gray-900">{index + 1}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {schedule.course_label || schedule.course?.title || schedule.course_name || `Course #${schedule.course_id}`}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 text-xs bg-${dayColor}-100 text-${dayColor}-600 px-2.5 py-1 rounded-full font-medium`}>
          <Calendar className="w-3 h-3" />
          {schedule.day_of_week}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-900">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="font-medium">
            {schedule.start_time} - {schedule.end_time}
          </span>
        </div>
      </td>

      {/* ✅ FIXED: Display room with building code */}
      <td className="px-6 py-4 whitespace-nowrap">
        {roomDisplay ? (
          <div className="flex items-center gap-1 text-sm text-gray-900">
            <Building2 className="w-3 h-3 text-gray-400" />
            <span className="font-medium">{roomDisplay}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(schedule)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit Schedule"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(schedule.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete Schedule"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default SchedulesList;