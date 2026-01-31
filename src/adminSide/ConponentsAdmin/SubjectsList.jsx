import { motion } from "framer-motion";
import { deleteSubject } from "../../api/subject_api.jsx";
import {
  BookOpen,
  Trash2,
  Edit,
  Award,
  Hash,
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

const SubjectsList = ({ subjects, onEdit, onRefresh }) => {
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const handleDelete = (id) => {
    setConfirm({ show: true, id });
  };

  const executeDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteSubject(confirm.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete subject:", err);
      setAlert({ show: true, message: err.response?.data?.message || "Failed to delete subject", type: "error" });
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
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Subjects</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {subjects.length} Total
        </span>
      </div>

      {subjects.length === 0 ? (
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
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((subject, index) => (
                <SubjectRow
                  key={subject.id}
                  subject={subject}
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
        message="Are you sure you want to delete this subject? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <BookOpen className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No subjects yet</p>
    <p className="text-sm text-gray-400 mt-1">Create your first subject to get started</p>
  </motion.div>
);

const SubjectRow = ({ subject, index, onEdit, onDelete }) => {
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

      {/* Subject Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {subject.subject_name}
            </div>
          </div>
        </div>
      </td>

      {/* Credits */}
      <td className="px-6 py-4 whitespace-nowrap">
        {subject.credit ? (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2.5 py-1 rounded-full font-medium">
            <Award className="w-3 h-3" />
            {subject.credit} {subject.credit === 1 ? 'Credit' : 'Credits'}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>

      {/* Description */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-600 max-w-xs truncate">
          {subject.description || "-"}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(subject)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit Subject"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(subject.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete Subject"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default SubjectsList;