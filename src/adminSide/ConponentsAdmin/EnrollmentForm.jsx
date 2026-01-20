import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  enrollStudent,
  updateEnrollmentStatus,
} from "../../api/admin_course_api.jsx";
import {
  BookOpen,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  GraduationCap,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  student_id: "",
  course_id: "",
  status: "enrolled",
};

const INPUT_FIELDS = [
  { key: "student_id", icon: User, placeholder: "Select Student", col: "md:col-span-2", type: "select" },
  { key: "course_id", icon: BookOpen, placeholder: "Select Course", col: "md:col-span-2", type: "select" },
  { key: "status", icon: GraduationCap, placeholder: "Status", col: "md:col-span-2", type: "select" },
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

const EnrollmentForm = ({ onUpdate, editingEnrollment, onCancel, students, courses }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingEnrollment;

  // ✅ Populate form when editingEnrollment changes
  useEffect(() => {
    if (editingEnrollment) {
      setForm({
        student_id: editingEnrollment.student_id || "",
        course_id: editingEnrollment.course_id || "",
        status: editingEnrollment.status || "enrolled",
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingEnrollment]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        student_id: parseInt(form.student_id, 10),
        course_id: parseInt(form.course_id, 10),
        status: form.status,
      };

      let response;
      if (isEditMode) {
        response = await updateEnrollmentStatus(editingEnrollment.id, form.status);
      } else {
        response = await enrollStudent(submitData);
      }

      resetForm();
      setSuccess(true);
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "Failed to save enrollment";

      if (err.response?.data) {
        const data = err.response.data;
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join(", ");
        } else if (data.message) {
          errorMessage = data.message;
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
          <Alert type="success" message={`Enrollment ${isEditMode ? "updated" : "created"} successfully!`} />
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
        students={students}
        courses={courses}
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

const FormSection = ({ isEditMode, onCancel, onSubmit, form, setForm, loading, students, courses }) => (
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
      <InputGrid form={form} setForm={setForm} students={students} courses={courses} isEditMode={isEditMode} />
      <SubmitButton loading={loading} isEditMode={isEditMode} />
    </motion.form>
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditMode ? "Update Enrollment" : "Enroll Student"}
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

const InputGrid = ({ form, setForm, students, courses, isEditMode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <InputField field={{ key: "student_id", icon: User, placeholder: "Select Student", col: "md:col-span-2", type: "select" }} form={form} setForm={setForm} options={students} disabled={isEditMode} />
    <InputField field={{ key: "course_id", icon: BookOpen, placeholder: "Select Course", col: "md:col-span-2", type: "select" }} form={form} setForm={setForm} options={courses} disabled={isEditMode} />
    <InputField field={{ key: "status", icon: GraduationCap, placeholder: "Status", col: "md:col-span-2", type: "select" }} form={form} setForm={setForm} options={[
      { id: "enrolled", name: "Enrolled" },
      { id: "dropped", name: "Dropped" },
      { id: "completed", name: "Completed" }
    ]} />
  </div>
);

const InputField = ({ field, form, setForm, options = [], disabled = false }) => {
  const Icon = field.icon;
  const value = form[field.key] ?? "";
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <motion.div variants={animations.item} className={`relative ${field.col}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        <Icon className="w-3.5 h-3.5" />
      </div>
      {field.type === "select" ? (
        <select
          name={field.key}
          value={value}
          onChange={handleChange}
          required
          disabled={disabled}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{field.placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name || opt.student_name || opt.title || opt.id}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || "text"}
          name={field.key}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          required
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
          {isEditMode ? "Updating..." : "Enrolling..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Status" : "Enroll Student"}
        </>
      )}
    </span>
  </motion.button>
);

export default EnrollmentForm;
