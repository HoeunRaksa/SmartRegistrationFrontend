import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createGrade,
  updateGrade,
} from "../../api/admin_course_api.jsx";
import {
  Award,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  BookOpen,
  Hash,
  FileText,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  student_id: "",
  course_id: "",
  assignment_name: "",
  score: "",
  total_points: "",
  letter_grade: "",
  grade_point: "",
  feedback: "",
  semester: "",
  academic_year: "",
};

const INPUT_FIELDS = [
  { key: "student_id", icon: User, placeholder: "Select Student", col: "md:col-span-1", type: "select" },
  { key: "course_id", icon: BookOpen, placeholder: "Select Course", col: "md:col-span-1", type: "select" },
  { key: "assignment_name", icon: FileText, placeholder: "Assignment Name", col: "md:col-span-2" },
  { key: "score", icon: Hash, placeholder: "Score", col: "md:col-span-1", type: "number" },
  { key: "total_points", icon: Hash, placeholder: "Total Points", col: "md:col-span-1", type: "number" },
  { key: "letter_grade", icon: Award, placeholder: "Letter Grade (A, B, C...)", col: "md:col-span-1" },
  { key: "grade_point", icon: Hash, placeholder: "Grade Point (4.0)", col: "md:col-span-1", type: "number", step: "0.01" },
  { key: "semester", icon: FileText, placeholder: "Semester (e.g., Fall)", col: "md:col-span-1" },
  { key: "academic_year", icon: FileText, placeholder: "Academic Year (e.g., 2024)", col: "md:col-span-1" },
  { key: "feedback", icon: FileText, placeholder: "Feedback (optional)", col: "md:col-span-2", multiline: true },
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

const GradeForm = ({ onUpdate, editingGrade, onCancel, students, courses }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingGrade;

  useEffect(() => {
    if (editingGrade) {
      setForm({
        student_id: editingGrade.student_id || "",
        course_id: editingGrade.course_id || "",
        assignment_name: editingGrade.assignment_name || "",
        score: editingGrade.score || "",
        total_points: editingGrade.total_points || "",
        letter_grade: editingGrade.letter_grade || "",
        grade_point: editingGrade.grade_point || "",
        feedback: editingGrade.feedback || "",
        semester: editingGrade.semester || "",
        academic_year: editingGrade.academic_year || "",
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingGrade]);

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
        assignment_name: form.assignment_name.trim(),
        score: parseFloat(form.score),
        total_points: parseFloat(form.total_points),
        letter_grade: form.letter_grade.trim(),
        grade_point: parseFloat(form.grade_point),
        feedback: form.feedback?.trim() || null,
        semester: form.semester.trim(),
        academic_year: form.academic_year.trim(),
      };

      let response;
      if (isEditMode) {
        response = await updateGrade(editingGrade.id, submitData);
      } else {
        response = await createGrade(submitData);
      }

      resetForm();
      setSuccess(true);
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "Failed to save grade";

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
      <AnimatePresence>
        {success && (
          <Alert type="success" message={`Grade ${isEditMode ? "updated" : "created"} successfully!`} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
      </AnimatePresence>

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
      <InputGrid form={form} setForm={setForm} students={students} courses={courses} />
      <SubmitButton loading={loading} isEditMode={isEditMode} />
    </motion.form>
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditMode ? "Edit Grade" : "Create New Grade"}
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

const InputGrid = ({ form, setForm, students, courses }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {INPUT_FIELDS.map((field) => (
      <InputField key={field.key} field={field} form={form} setForm={setForm} students={students} courses={courses} />
    ))}
  </div>
);

const InputField = ({ field, form, setForm, students, courses }) => {
  const Icon = field.icon;
  const value = form[field.key] ?? "";
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  let options = [];
  if (field.key === "student_id") options = students;
  if (field.key === "course_id") options = courses;

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
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
        >
          <option value="">{field.placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name || opt.student_name || opt.title || opt.id}
            </option>
          ))}
        </select>
      ) : field.multiline ? (
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
          min={field.type === "number" ? "0" : undefined}
          step={field.step || (field.type === "number" ? "1" : undefined)}
          required={!field.placeholder.includes("optional")}
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
          {isEditMode ? "Updating Grade..." : "Saving Grade..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Grade" : "Create Grade"}
        </>
      )}
    </span>
  </motion.button>
);

export default GradeForm;
