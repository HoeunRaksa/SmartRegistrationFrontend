import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createMajor,
  updateMajor,
} from "../../../src/api/major_api.jsx";
import { fetchDepartments } from "../../../src/api/department_api.jsx";
import {
  GraduationCap,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Building2,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  major_name: "",
  description: "",
  department_id: "",
};

const INPUT_FIELDS = [
  { key: "major_name", icon: GraduationCap, placeholder: "Major Name", col: "md:col-span-2" },
  { key: "description", icon: FileText, placeholder: "Description", col: "md:col-span-2", multiline: true },
];

/* ================== ANIMATION VARIANTS ================== */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  },
  item: {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
  },
};

/* ================== COMPONENT ================== */

const MajorsForm = ({ editingMajor, onSuccess, onCancel }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingMajor;

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (editingMajor) {
      setForm({
        major_name: editingMajor.major_name || "",
        description: editingMajor.description || "",
        department_id: editingMajor.department_id || "",
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingMajor]);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data.data || []);
    } catch {
      setDepartments([]);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    if (onCancel) onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode) {
        await updateMajor(editingMajor.id, form);
      } else {
        await createMajor(form);
      }

      resetForm();
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save major");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= ALERTS ================= */}
      <AnimatePresence>
        {success && (
          <Alert type="success" message={`Major ${isEditMode ? "updated" : "created"} successfully!`} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      {/* ================= FORM ================= */}
      <motion.div
        variants={animations.fadeUp}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-2xl bg-white/90 border border-white shadow-lg  p-5"
      >
        <FormHeader isEditMode={isEditMode} onCancel={resetForm} />
        
        <motion.form
          onSubmit={handleSubmit}
          variants={animations.container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <InputGrid form={form} setForm={setForm} departments={departments} />
          <SubmitButton loading={loading} isEditMode={isEditMode} />
        </motion.form>
      </motion.div>
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm ${
      type === "success"
        ? "bg-green-50 border-green-200"
        : "bg-red-50 border-red-200"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    )}
    <p className={`text-sm font-medium ${type === "success" ? "text-green-800" : "text-red-800"}`}>
      {message}
    </p>
    {onClose && (
      <button onClick={onClose} className="ml-auto text-red-600 hover:text-red-800">
        <X className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditMode ? "Edit Major" : "Create New Major"}
      </h2>
    </div>
    {isEditMode && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        type="button"
        className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
      >
        <X className="w-4 h-4" />
        Cancel
      </motion.button>
    )}
  </div>
);

const InputGrid = ({ form, setForm, departments }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {INPUT_FIELDS.map((field) => (
      <InputField key={field.key} field={field} form={form} setForm={setForm} />
    ))}
    <DepartmentSelect form={form} setForm={setForm} departments={departments} />
  </div>
);

const InputField = ({ field, form, setForm }) => {
  const Icon = field.icon;
  const value = form[field.key] ?? "";
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <motion.div variants={animations.item} className={`relative ${field.col}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        <Icon className="w-3.5 h-3.5" />
      </div>
      {field.multiline ? (
        <textarea
          name={field.key}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={2}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all resize-none"
        />
      ) : (
        <input
          name={field.key}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
        />
      )}
    </motion.div>
  );
};

const DepartmentSelect = ({ form, setForm, departments }) => (
  <motion.div variants={animations.item} className="relative md:col-span-2">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
      <Building2 className="w-3.5 h-3.5" />
    </div>
    <select
      name="department_id"
      value={form.department_id}
      onChange={(e) => setForm({ ...form, department_id: e.target.value })}
      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all appearance-none cursor-pointer"
      required
    >
      <option value="">Select Department</option>
      {departments.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name} ({dept.code})
        </option>
      ))}
    </select>
  </motion.div>
);

const SubmitButton = ({ loading, isEditMode }) => (
  <motion.button
    variants={animations.item}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    type="submit"
    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
  >
    {!loading && (
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
    )}

    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
          {isEditMode ? "Updating Major..." : "Saving Major..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Major" : "Create Major"}
        </>
      )}
    </span>
  </motion.button>
);

export default MajorsForm;