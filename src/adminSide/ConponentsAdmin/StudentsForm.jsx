import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createStudent,
  fetchStudents,
  updateStudent,
  deleteStudent,
} from "../../../src/api/student_api.jsx";
import { fetchDepartments } from "../../../src/api/department_api.jsx";
import {
  GraduationCap,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Hash,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  registration_id: "",
  user_id: "",
  department_id: "",
  full_name_kh: "",
  full_name_en: "",
  date_of_birth: "",
  gender: "Male",
  nationality: "Cambodian",
  phone_number: "",
  address: "",
  generation: "",
  parent_name: "",
  parent_phone: "",
};

const INPUT_FIELDS = [
  { key: "full_name_en", icon: User, placeholder: "Full Name (English)", col: "md:col-span-2" },
  { key: "full_name_kh", icon: User, placeholder: "Full Name (Khmer)", col: "md:col-span-2" },
  { key: "date_of_birth", icon: Calendar, placeholder: "Date of Birth", col: "", type: "date" },
  { key: "gender", icon: User, placeholder: "Gender", col: "", type: "select", options: ["Male", "Female", "Other"] },
  { key: "nationality", icon: MapPin, placeholder: "Nationality", col: "" },
  { key: "phone_number", icon: Phone, placeholder: "Phone Number", col: "" },
  { key: "address", icon: MapPin, placeholder: "Address", col: "md:col-span-2", multiline: true },
  { key: "generation", icon: Hash, placeholder: "Generation/Batch", col: "" },
  { key: "parent_name", icon: User, placeholder: "Parent Name", col: "" },
  { key: "parent_phone", icon: Phone, placeholder: "Parent Phone", col: "" },
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

const StudentsForm = ({ onUpdate, editingStudent, onCancelEdit }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingStudent;

  // ✅ Load departments on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  // ✅ NEW: Populate form when editingStudent changes
  useEffect(() => {
    if (editingStudent) {
      setForm({
        registration_id: editingStudent.registration_id || "",
        user_id: editingStudent.user_id || "",
        department_id: editingStudent.department_id || "",
        full_name_kh: editingStudent.full_name_kh || "",
        full_name_en: editingStudent.full_name_en || "",
        date_of_birth: editingStudent.date_of_birth || "",
        gender: editingStudent.gender || "Male",
        nationality: editingStudent.nationality || "Cambodian",
        phone_number: editingStudent.phone_number || "",
        address: editingStudent.address || "",
        generation: editingStudent.generation || "",
        parent_name: editingStudent.parent_name || "",
        parent_phone: editingStudent.parent_phone || "",
      });
    } else {
      // ✅ Reset form when not editing
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingStudent]);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
        
      setDepartments(list);
    } catch (err) {
      console.error("Failed to load departments:", err);
      setDepartments([]);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    if (onCancelEdit) onCancelEdit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode) {
        await updateStudent(editingStudent.id, form);
      } else {
        await createStudent(form);
      }

      resetForm();
      setSuccess(true);
      if (onUpdate) onUpdate();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= ALERTS ================= */}
      <AnimatePresence>
        {success && (
          <Alert type="success" message={`Student ${isEditMode ? "updated" : "created"} successfully!`} />
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
        departments={departments}
        loading={loading}
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

const FormSection = ({ isEditMode, onCancel, onSubmit, form, setForm, departments, loading }) => (
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
        {isEditMode ? "Edit Student" : "Create New Student"}
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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    <DepartmentSelect form={form} setForm={setForm} departments={departments} />
    
    {INPUT_FIELDS.map((field) => (
      <InputField key={field.key} field={field} form={form} setForm={setForm} />
    ))}
  </div>
);

const DepartmentSelect = ({ form, setForm, departments }) => (
  <motion.div variants={animations.item} className="relative md:col-span-3">
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
          {dept.name}
        </option>
      ))}
    </select>
  </motion.div>
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
      {field.type === "select" ? (
        <select
          name={field.key}
          value={value}
          onChange={handleChange}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : field.multiline ? (
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
          {isEditMode ? "Updating Student..." : "Saving Student..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Student" : "Create Student"}
        </>
      )}
    </span>
  </motion.button>
);

export default StudentsForm;