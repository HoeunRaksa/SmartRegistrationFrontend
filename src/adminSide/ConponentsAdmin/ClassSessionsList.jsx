import { motion } from "framer-motion";
import { deleteSession } from "../../api/course_api.jsx";
import {
  Calendar,
  Trash2,
  Edit,
  Hash,
  BookOpen,
  Clock,
  MapPin,
  Building2,
  CheckCircle,
  Users,
} from "lucide-react";

const ClassSessionsList = ({ sessions, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await deleteSession(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete session:", err);
      alert(err.response?.data?.message || "Failed to delete session");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Class Sessions</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {sessions.length} Total
        </span>
      </div>

      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Attendance</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((session, index) => (
                <SessionRow
                  key={session.id}
                  session={session}
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

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Calendar className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No class sessions yet</p>
    <p className="text-sm text-gray-400 mt-1">Generate sessions from schedules or create manually</p>
  </div>
);

const SessionRow = ({ session, index, onEdit, onDelete }) => {
  const sessionDate = new Date(session.session_date);
  const isUpcoming = sessionDate >= new Date();
  const isPast = sessionDate < new Date();

  const roomDisplay = session.room_full_name || 
                      (session.building_code && session.room_number 
                        ? `${session.building_code}-${session.room_number}` 
                        : session.room_number || session.room || null);

  const hasAttendance = session.has_attendance || session.attendance_count > 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`hover:bg-blue-50/30 transition-colors ${isPast ? 'opacity-60' : ''}`}
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
              {session.course_label || `Course #${session.course_id}`}
            </div>
            {session.instructor && (
              <div className="text-xs text-gray-500">{session.instructor}</div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {sessionDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 text-xs ${
          isUpcoming ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        } px-2.5 py-1 rounded-full font-medium`}>
          <Calendar className="w-3 h-3" />
          {session.day_of_week}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-900">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="font-medium">
            {session.start_time} - {session.end_time}
          </span>
        </div>
      </td>

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
        {hasAttendance ? (
          <div className="flex items-center gap-1 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-900">{session.attendance_count || 0}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No records</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(session)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit Session"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(session.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete Session"
            disabled={hasAttendance}
          >
            <Trash2 className={`w-4 h-4 ${hasAttendance ? 'text-red-300' : 'text-red-600'}`} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default ClassSessionsList;