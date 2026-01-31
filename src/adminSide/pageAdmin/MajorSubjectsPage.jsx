import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MajorSubjectsForm from "../ConponentsAdmin/MajorSubjectsForm.jsx";
import MajorSubjectsList from "../ConponentsAdmin/MajorSubjectsList.jsx";
import FormModal from "../../Components/FormModal.jsx";
import { fetchMajorSubjects, deleteMajorSubject } from "../../api/major_subject_api.jsx";
import { Link2, BarChart3 } from "lucide-react";
import Alert from "../../gobalConponent/Alert.jsx";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";
import { AnimatePresence } from "framer-motion";

const MajorSubjectsPage = () => {
  const [rows, setRows] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
  const [confirm, setConfirm] = useState({ show: false, id: null });

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchMajorSubjects();
      setRows(res.data || []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id) => {
    setConfirm({ show: true, id });
  };

  const executeDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteMajorSubject(confirm.id);
      load();
      setAlert({ show: true, message: "Major-subject deleted successfully", type: "success" });
    } catch (e) {
      console.error(e);
      setAlert({ show: true, message: "Delete failed. Check console.", type: "error" });
    } finally {
      setConfirm({ show: false, id: null });
    }
  };

  const quickStats = [
    {
      label: "MajorSubjects",
      value: loading ? "…" : rows.length,
      color: "from-cyan-500 to-blue-500",
      icon: Link2,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <ConfirmDialog
        isOpen={confirm.show}
        title="Confirm Delete"
        message="Are you sure you want to delete this major-subject? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
        confirmText="Delete"
        type="danger"
      />
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Major Subjects</h1>
          <p className="text-sm text-gray-600 font-medium">Link subjects to specific majors and departments.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          Add Major Subject
        </motion.button>
      </div>

      {/* quick stats */}
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
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="hidden sm:block bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">
                Tip: Courses should use <b>major_subject_id</b> from these records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      >
        <MajorSubjectsForm
          onSuccess={() => {
            load();
            setIsFormOpen(false);
          }}
        />
      </FormModal>
      <MajorSubjectsList rows={rows} onDelete={handleDelete} onRefresh={load} />
    </div>
  );
};

export default MajorSubjectsPage;
