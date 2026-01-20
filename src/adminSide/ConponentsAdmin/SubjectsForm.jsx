import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSubject, updateSubject } from "../../../src/api/subject_api.jsx";
import { fetchDepartments } from "../../../src/api/department_api.jsx";
import {
  BookOpen,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  GraduationCap,
  Building2,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  subject_name: "",
  description: "",
  credit: "",
  department_id: "", // ✅ NEW
};

const INPUT_FIELDS = [
  { key: "subject_name", icon: BookOpen, placeholder: "Subject Name", col: "md:col-span-2" },

  // ✅ Department dropdown (special render)
  { key: "department_id", icon: Building2, placeholder: "Department", col: "md:col-span-2", type: "select" },

  { key: "credit", icon: GraduationCap, placeholder: "Credits", col: "md:col-span-2", type: "number" },
  { key: "description", icon: FileText, placeholder: "Description (optional)", col: "md:col-span-2", multiline: true },
];

/* ================== ANIMATION VARIANTS ================== */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
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

const SubjectsForm = ({ onUpdate, onSuccess, editingSubject, onCancel, onCancelEdit }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [departments, setDepartments] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingSubject;

  // ✅ Load departments
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchDepartments();
        const data = res?.data?.data !== undefined ? res.data.data : res?.data;
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load departments:", err);
        setDepartments([]);
      }
    })();
  }, []);

  // ✅ Populate form when editingSubject changes
  useEffect(() => {
    if (editingSubject) {
      setForm({
        subject_name: editingSubject.subject_name || "",
        description: editingSubject.description || "",
        credit: editingSubject.credit ?? "",
        department_id: editingSubject.department_id ?? "", // ✅ NEW
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingSubject]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);

    // keep compatibility with both prop names
    if (onCancel) onCancel();
    if (onCancelEdit) onCancelEdit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // ✅ validation client-side
      if (!form.department_id) {
        setError("Department is required");
        setLoading(false);
        return;
      }

      // Prepare form data
      const submitData = {
        subject_name: form.subject_name.trim(),
        description: form.description?.trim() || null,
        credit: parseInt(form.credit, 10),
        department_id: parseInt(form.department_id, 10), // ✅ NEW
      };

      if (Number.isNaN(submitData.credit)) {
        setError("Credit must be a number");
        setLoading(false);
        return;
      }

      let response;
      if (isEditMode) {
        response = await updateSubject(editingSubject.id, submitData);
      } else {
        response = await createSubject(submitData);
      }

      console.log("Response:", response);

      resetForm();
      setSuccess(true);

      // keep both callbacks working
      if (onUpdate) onUpdate();
      if (onSuccess) onSuccess();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);

      // Extract error message
      let errorMessage = "Failed to save subject";

      if (err.response?.data) {
        const data = err.response.data;

        // Laravel validation errors
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "string") {
          errorMessage = data.substring(0, 200);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= ALERTS ================= */}
      <AnimatePresence>
        {success && (
          <Alert
            type="success"
            message={`Subject ${isEditMode ? "updated" : "created"} successfully!`}
          />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      {/* ================= FORM ================= */}
      <FormSection
        isEditMode={isEditMode}
        onCancel={resetForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        loading={loading}
        departments={departments} // ✅ NEW
      />
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
    <p
      className={`text-sm font-medium ${
        type === "success" ? "text-green-800" : "text-red-800"
      }`}
    >
      {message}
    </p>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-auto text-red-600 hover:text-red-800"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

const FormSection = ({ isEditMode, onCancel, onSubmit, form, setForm, loading, departments }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-2xl bg-white/90 border border-white shadow-lg p-5"
  >
    <FormHeader isEditMode={isEditMode} onCancel={onCancel} />

    <motion.form
      onSubmit={onSubmit}
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <InputGrid form={form} setForm={setForm} departments={departments} />
      <SubmitButton loading={loading} isEditMode={isEditMode} />
    </motion.form>
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditMode ? "Edit Subject" : "Create New Subject"}
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
      <InputField
        key={field.key}
        field={field}
        form={form}
        setForm={setForm}
        departments={departments}
      />
    ))}
  </div>
);

const InputField = ({ field, form, setForm, departments }) => {
  const Icon = field.icon;
  const value = form[field.key] ?? "";
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Department select
  if (field.type === "select" && field.key === "department_id") {
    return (
      <motion.div variants={animations.item} className={`relative ${field.col}`}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          <Icon className="w-3.5 h-3.5" />
        </div>

        <select
          name="department_id"
          value={value}
          onChange={handleChange}
          required
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.department_name ?? d.name ?? `Department #${d.id}`}
            </option>
          ))}
        </select>
      </motion.div>
    );
  }

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
          rows={3}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all resize-none"
        />
      ) : (
        <input
          type={field.type || "text"}
          name={field.key}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          min={field.type === "number" ? "1" : undefined}
          step={field.type === "number" ? "1" : undefined}
          required={field.key === "subject_name" || field.key === "credit"}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
        />
      )}
    </motion.div>
  );
};

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
          {isEditMode ? "Updating Subject..." : "Saving Subject..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Subject" : "Create Subject"}
        </>
      )}
    </span>
  </motion.button>
);

export default SubjectsForm;
