import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createTeacherGrade,
  updateTeacherGrade,
} from "../../api/teacher_api.jsx";
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
  Info,
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
  {
    key: "student_id",
    icon: User,
    label: "Student",
    placeholder: "Select Student",
    helpText: "Choose the student to grade",
    col: "md:col-span-1",
    type: "select"
  },
  {
    key: "course_id",
    icon: BookOpen,
    label: "Course",
    placeholder: "Select Course",
    helpText: "Which course is this grade for?",
    col: "md:col-span-1",
    type: "select"
  },
  {
    key: "assignment_name",
    icon: FileText,
    label: "Assignment Name",
    placeholder: "e.g., Midterm Exam, Homework 1",
    helpText: "Name of the assignment or exam",
    col: "md:col-span-2"
  },
  {
    key: "score",
    icon: Hash,
    label: "Score Earned",
    placeholder: "Score (e.g., 85)",
    helpText: "Points the student earned",
    col: "md:col-span-1",
    type: "number"
  },
  {
    key: "total_points",
    icon: Hash,
    label: "Total Points",
    placeholder: "Total (e.g., 100)",
    helpText: "Maximum points possible",
    col: "md:col-span-1",
    type: "number"
  },
  {
    key: "letter_grade",
    icon: Award,
    label: "Letter Grade",
    placeholder: "A, B, C, D, or F",
    helpText: "Letter grade (A is highest)",
    col: "md:col-span-1"
  },
  {
    key: "grade_point",
    icon: Hash,
    label: "Grade Point (GPA)",
    placeholder: "4.0, 3.5, etc.",
    helpText: "On a 4.0 scale (4.0 = A)",
    col: "md:col-span-1",
    type: "number",
    step: "0.01"
  },
  {
    key: "semester",
    icon: FileText,
    label: "Semester",
    placeholder: "Fall, Spring, Summer",
    helpText: "Which semester/term?",
    col: "md:col-span-1"
  },
  {
    key: "academic_year",
    icon: FileText,
    label: "Academic Year",
    placeholder: "2024, 2025, etc.",
    helpText: "Year this grade was earned",
    col: "md:col-span-1"
  },
  {
    key: "feedback",
    icon: FileText,
    label: "Feedback (Optional)",
    placeholder: "Comments for the student...",
    helpText: "Optional comments or notes",
    col: "md:col-span-2",
    multiline: true
  },
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
        response = await updateTeacherGrade(editingGrade.id, submitData);
      } else {
        response = await createTeacherGrade(submitData);
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
        title={isEditMode ? "Edit Grade" : "Create New Grade"}
        Icon={Award}
        form={form}
        setForm={setForm}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isEditMode={isEditMode}
        inputFields={INPUT_FIELDS}
        students={students}
        courses={courses}
      />
    </div>
  );
};

/* ================== ALERT COMPONENT ================== */
const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.3 }}
    className={`p-4 rounded-xl border ${type === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
      : "bg-red-50 border-red-200 text-red-800"
      } flex items-center gap-3`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    )}
    <p className="flex-1 font-medium">{message}</p>
    {onClose && (
      <button onClick={onClose} className="p-1 hover:bg-white/50 rounded transition">
        <X className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

/* ================== FORM SECTION ================== */
const FormSection = ({
  title,
  Icon,
  form,
  setForm,
  loading,
  onSubmit,
  onCancel,
  isEditMode,
  inputFields,
  students,
  courses,
}) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {isEditMode && (
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 rounded-xl border border-white/40 transition"
        >
          Cancel Edit
        </button>
      )}
    </div>

    <form onSubmit={onSubmit}>
      <motion.div
        variants={animations.container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {inputFields.map((field) => (
          <motion.div key={field.key} variants={animations.item} className={field.col}>
            <FormInput
              field={field}
              form={form}
              setForm={setForm}
              students={students}
              courses={courses}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {isEditMode ? "Update Grade" : "Create Grade"}
            </>
          )}
        </motion.button>
      </div>
    </form>
  </motion.div>
);

/* ================== FORM INPUT ================== */
const FormInput = ({ field, form, setForm, students, courses }) => {
  const Icon = field.icon;

  if (field.type === "select") {
    const options = field.key === "student_id" ? students : courses;
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
          <Icon className="w-4 h-4 text-blue-600" />
          {field.label || field.placeholder}
        </label>
        <select
          value={form[field.key]}
          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition shadow-sm hover:border-gray-300"
        >
          <option value="">{field.placeholder}</option>
          {options?.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {field.key === "student_id"
                ? (opt.full_name || opt.full_name_en || opt.name || 'Unknown')
                : (opt.name || opt.course_name || 'Unknown')}
            </option>
          ))}
        </select>
        {field.helpText && (
          <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">i</span>
            {field.helpText}
          </p>
        )}
      </div>
    );
  }

  if (field.multiline) {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
          <Icon className="w-4 h-4 text-blue-600" />
          {field.label || field.placeholder}
        </label>
        <textarea
          value={form[field.key]}
          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
          placeholder={field.placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition resize-none hover:border-gray-300"
        />
        {field.helpText && (
          <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">i</span>
            {field.helpText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
        <Icon className="w-4 h-4 text-blue-600" />
        {field.label || field.placeholder}
      </label>
      <input
        type={field.type || "text"}
        step={field.step}
        value={form[field.key]}
        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
        placeholder={field.placeholder}
        required
        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition shadow-sm hover:border-gray-300"
      />
      {field.helpText && (
        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">i</span>
          {field.helpText}
        </p>
      )}
    </div>
  );
};

export default GradeForm;
