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

const StudentsForm = ({ onUpdate }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const isEditMode = !!editingStudent;

  useEffect(() => {
    loadStudents();
    loadDepartments();
  }, []);

const loadStudents = async () => {
  try {
    const res = await fetchStudents();

    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    setStudents(list);
    if (onUpdate) onUpdate();
  } catch (err) {
    console.error("Failed to load students:", err);
    setStudents([]);
  }
};

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data.data);
    } catch {
      setDepartments([]);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setEditingStudent(null);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setForm({
      registration_id: student.registration_id || "",
      user_id: student.user_id || "",
      department_id: student.department_id || "",
      full_name_kh: student.full_name_kh || "",
      full_name_en: student.full_name_en || "",
      date_of_birth: student.date_of_birth || "",
      gender: student.gender || "Male",
      nationality: student.nationality || "Cambodian",
      phone_number: student.phone_number || "",
      address: student.address || "",
      generation: student.generation || "",
      parent_name: student.parent_name || "",
      parent_phone: student.parent_phone || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await deleteStudent(id);
      setSuccess(true);
      loadStudents();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
    }
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
      loadStudents();
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

      {/* ================= STUDENTS LIST ================= */}
      <StudentsList
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={setSelectedStudent}
      />

      {/* ================= DETAIL MODAL ================= */}
      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
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

const StudentsList = ({ students, onEdit, onDelete, onView }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
      </div>
      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
        {students.length} Total
      </span>
    </div>

    {students.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student Code</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Generation</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </motion.div>
);

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <GraduationCap className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No students yet</p>
    <p className="text-sm text-gray-400 mt-1">Create your first student to get started</p>
  </motion.div>
);

const StudentRow = ({ student, onEdit, onDelete, onView }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
  >
    <td className="px-4 py-3">
      <span className="text-sm font-medium text-blue-600">{student.student_code}</span>
    </td>
    <td className="px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{student.full_name_en}</p>
        <p className="text-xs text-gray-500">{student.full_name_kh}</p>
      </div>
    </td>
    <td className="px-4 py-3">
      <span className="text-sm text-gray-600">{student.phone_number || "-"}</span>
    </td>
    <td className="px-4 py-3">
      <span className="text-sm text-gray-600">{student.generation || "-"}</span>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center justify-end gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onView(student)}
          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(student)}
          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
        >
          <Edit className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(student.id)}
          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </td>
  </motion.tr>
);

const StudentModal = ({ student, onClose }) => {
  if (!student) return null;

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
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="w-full h-full flex items-center justify-center">
              <GraduationCap className="w-24 h-24 text-white/30" />
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
              <h2 className="text-3xl font-bold text-white mb-2">{student.full_name_en}</h2>
              <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                <Hash className="w-4 h-4" />
                {student.student_code}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Khmer Name" value={student.full_name_kh} />
              <InfoField label="Gender" value={student.gender} />
              <InfoField label="Date of Birth" value={student.date_of_birth} />
              <InfoField label="Nationality" value={student.nationality} />
              <InfoField label="Phone" value={student.phone_number} />
              <InfoField label="Generation" value={student.generation} />
            </div>
            
            {student.address && (
              <InfoField label="Address" value={student.address} />
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <InfoField label="Parent Name" value={student.parent_name} />
              <InfoField label="Parent Phone" value={student.parent_phone} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
  </div>
);

export default StudentsForm;