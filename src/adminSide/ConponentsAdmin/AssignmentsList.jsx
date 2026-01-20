import { motion } from "framer-motion";
import { deleteAssignment } from "../../api/admin_course_api.jsx";
import {
  FileText,
  Trash2,
  Edit,
  Hash,
  BookOpen,
  Calendar,
  Award,
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

const AssignmentsList = ({ assignments, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await deleteAssignment(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete assignment:", err);
      alert(err.response?.data?.message || "Failed to delete assignment");
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
          <FileText className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Assignments</h3>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full font-semibold">
          {assignments.length} Total
        </span>
      </div>

      {assignments.length === 0 ? (
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
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.map((assignment, index) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
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
      <FileText className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No assignments yet</p>
    <p className="text-sm text-gray-400 mt-1">Create assignments to track student work</p>
  </motion.div>
);

const AssignmentRow = ({ assignment, index, onEdit, onDelete }) => {
  const typeColors = {
    homework: "blue",
    quiz: "purple",
    exam: "red",
    project: "green",
    lab: "yellow",
  };

  const typeColor = typeColors[assignment.assignment_type?.toLowerCase()] || "gray";

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = new Date(assignment.due_date) < new Date();

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

      {/* Assignment */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
            <FileText className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {assignment.title}
            </div>
            {assignment.description && (
              <div className="text-xs text-gray-500 max-w-xs truncate">
                {assignment.description}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-900">
            {assignment.course?.title || assignment.course_name || `Course #${assignment.course_id}`}
          </span>
        </div>
      </td>

      {/* Type */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 text-xs bg-${typeColor}-100 text-${typeColor}-600 px-2.5 py-1 rounded-full font-medium capitalize`}>
          {assignment.assignment_type}
        </span>
      </td>

      {/* Points */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Award className="w-3 h-3 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{assignment.total_points}</span>
        </div>
      </td>

      {/* Due Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
          <Calendar className="w-3 h-3" />
          <span className="font-medium">{formatDate(assignment.due_date)}</span>
          {isOverdue && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">
              Overdue
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(assignment)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit Assignment"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(assignment.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete Assignment"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default AssignmentsList;
