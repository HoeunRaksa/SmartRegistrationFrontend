import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createSubject,
  fetchSubjects,
  updateSubject,
  deleteSubject,
} from "../../../src/api/subject_api.jsx";
import {
  BookOpen,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Grid3x3,
  Trash2,
  Edit,
  Code,
  Hash,
  Clock,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  subject_code: "",
  subject_name: "",
  credit_hours: "",
  description: "",
};

const INPUT_FIELDS = [
  { key: "subject_code", icon: Code, placeholder: "Subject Code (e.g., CS101)", col: "" },
  { key: "subject_name", icon: BookOpen, placeholder: "Subject Name", col: "md:col-span-2" },
  { key: "credit_hours", icon: Clock, placeholder: "Credit Hours", col: "", type: "number" },
  { key: "description", icon: FileText, placeholder: "Description", col: "md:col-span-3", multiline: true },
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
  card: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  },
};

/* ================== COMPONENT ================== */

const SubjectsForm = ({ onUpdate }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);

  const isEditMode = !!editingSubject;

  useEffect(() => {
    loadSubjects();
  }, []);

const loadSubjects = async () => {
  try {
    const res = await fetchSubjects();

    // ✅ SAFELY EXTRACT ARRAY
    const data = Array.isArray(res.data)
      ? res.data
      : res.data.data ?? [];

    setSubjects(data);

    if (onUpdate) onUpdate();
  } catch (err) {
    console.error("Load subjects error:", err);
    setSubjects([]);
  }
};


  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setEditingSubject(null);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setForm({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      credit_hours: subject.credit_hours || "",
      description: subject.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await deleteSubject(id);
      setSuccess(true);
      loadSubjects();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subject");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode) {
        await updateSubject(editingSubject.id, form);
      } else {
        await createSubject(form);
      }

      resetForm();
      setSuccess(true);
      loadSubjects();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= ALERTS ================= */}
      <AnimatePresence>
        {success && (
          <Alert type="success" message={`Subject ${isEditMode ? "updated" : "created"} successfully!`} />
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
      />

      {/* ================= SUBJECTS LIST ================= */}
      <SubjectsList
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={setSelectedSubject}
      />

      {/* ================= DETAIL MODAL ================= */}
      <SubjectModal
        subject={selectedSubject}
        onClose={() => setSelectedSubject(null)}
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

const FormSection = ({ isEditMode, onCancel, onSubmit, form, setForm, loading }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
  >
    <FormHeader isEditMode={isEditMode} onCancel={onCancel} />
    
    <motion.form
      onSubmit={onSubmit}
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <InputGrid form={form} setForm={setForm} />
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

const InputGrid = ({ form, setForm }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {INPUT_FIELDS.map((field) => (
      <InputField key={field.key} field={field} form={form} setForm={setForm} />
    ))}
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
          type={field.type || "text"}
          name={field.key}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          min={field.type === "number" ? "0" : undefined}
          step={field.type === "number" ? "0.5" : undefined}
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

const SubjectsList = ({ subjects, onEdit, onDelete, onView }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Grid3x3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">All Subjects</h3>
      </div>
      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
        {subjects.length} Total
      </span>
    </div>

    {subjects.length === 0 ? (
      <EmptyState />
    ) : (
      <motion.div
        variants={animations.container}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} onEdit={onEdit} onDelete={onDelete} onView={onView} />
        ))}
      </motion.div>
    )}
  </motion.div>
);

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <BookOpen className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No subjects yet</p>
    <p className="text-sm text-gray-400 mt-1">Create your first subject to get started</p>
  </motion.div>
);

const SubjectCard = ({ subject, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      variants={animations.card}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onView(subject)}
      className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <SubjectCardHeader subject={subject} onEdit={onEdit} onDelete={onDelete} />
      <SubjectCardContent subject={subject} />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

const SubjectCardHeader = ({ subject, onEdit, onDelete }) => (
  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
    <div className="w-full h-full flex items-center justify-center">
      <BookOpen className="w-16 h-16 text-purple-300" />
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white/90 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(subject);
        }}
      >
        <Edit className="w-4 h-4 text-blue-600" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white/90 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(subject.id);
        }}
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </motion.button>
    </div>
  </div>
);

const SubjectCardContent = ({ subject }) => (
  <div className="p-5">
    <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600">
      {subject.subject_name}
    </h4>

    <div className="flex items-center gap-2 mb-3">
      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
        <Code className="w-3 h-3" />
        {subject.subject_code}
      </span>
      {subject.credit_hours && (
        <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-2.5 py-1 rounded-full font-medium">
          <Clock className="w-3 h-3" />
          {subject.credit_hours} hrs
        </span>
      )}
    </div>

    {subject.description && (
      <p className="text-xs text-gray-600 line-clamp-3">{subject.description}</p>
    )}
  </div>
);

const SubjectModal = ({ subject, onClose }) => {
  if (!subject) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <SubjectModalHeader subject={subject} onClose={onClose} />
          <SubjectModalContent subject={subject} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SubjectModalHeader = ({ subject, onClose }) => (
  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
    <div className="w-full h-full flex items-center justify-center">
      <BookOpen className="w-24 h-24 text-white/30" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClose}
      className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
    >
      <X className="w-5 h-5" />
    </motion.button>

    <div className="absolute bottom-6 left-6 right-6">
      <h2 className="text-3xl font-bold text-white mb-2">{subject.subject_name}</h2>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
          <Code className="w-4 h-4" />
          {subject.subject_code}
        </span>
        {subject.credit_hours && (
          <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            {subject.credit_hours} Credit Hours
          </span>
        )}
      </div>
    </div>
  </div>
);

const SubjectModalContent = ({ subject }) => (
  <div className="p-6 space-y-4">
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Subject Code</p>
      <p className="text-sm font-medium text-gray-800">{subject.subject_code}</p>
    </div>

    {subject.credit_hours && (
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Credit Hours</p>
        <p className="text-sm font-medium text-gray-800">{subject.credit_hours}</p>
      </div>
    )}

    {subject.description && (
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
        <p className="text-sm text-gray-700">{subject.description}</p>
      </div>
    )}
  </div>
);

export default SubjectsForm;