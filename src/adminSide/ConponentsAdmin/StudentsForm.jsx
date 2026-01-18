import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createStudent,
  fetchStudents,
  updateStudent,
  deleteStudent,
  resetStudentPassword,
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
  Key,
  RefreshCw,
  Copy,
  Lock,
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
  
  // Password Reset States
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const isEditMode = !!editingStudent;

  // ✅ Load departments on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  // ✅ Populate form when editingStudent changes
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
      setShowPasswordReset(false);
      setPasswordResetSuccess(false);
    } else {
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

  // Generate password: novatech + current datetime
  const generatePassword = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `novatech${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const handleResetPassword = async () => {
    if (!editingStudent) return;

    const generatedPassword = generatePassword();
    setNewPassword(generatedPassword);
    setResettingPassword(true);

    try {
      await resetStudentPassword(editingStudent.id, generatedPassword);
      setPasswordResetSuccess(true);
      setShowPasswordReset(false);
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setPasswordResetSuccess(false);
      }, 10000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setShowPasswordReset(false);
    setPasswordResetSuccess(false);
    setNewPassword("");
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
        
        {/* Password Reset Success Alert */}
        {passwordResetSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex items-start gap-3 p-4 rounded-2xl border shadow-lg bg-green-50 border-green-200"
          >
            <div className="p-1 bg-green-100 rounded-full mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 mb-1">
                Password Reset Successfully!
              </p>
              <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 mb-1 font-medium">New Password:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono font-bold text-green-900 bg-green-50 px-3 py-1.5 rounded border border-green-200">
                    {newPassword}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                ⚠️ Please save this password. The student must use it to login.
              </p>
            </div>
            <button
              onClick={() => setPasswordResetSuccess(false)}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
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
        editingStudent={editingStudent}
        showPasswordReset={showPasswordReset}
        setShowPasswordReset={setShowPasswordReset}
        handleResetPassword={handleResetPassword}
        resettingPassword={resettingPassword}
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

const FormSection = ({ 
  isEditMode, 
  onCancel, 
  onSubmit, 
  form, 
  setForm, 
  departments, 
  loading,
  editingStudent,
  showPasswordReset,
  setShowPasswordReset,
  handleResetPassword,
  resettingPassword
}) => (
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
      
      {/* Password Reset Section - Only in Edit Mode */}
      {isEditMode && editingStudent && (
        <motion.div 
          variants={animations.item}
          className="pt-4 border-t border-gray-200"
        >
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Key className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Password Reset
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Generate a new password for {editingStudent.full_name_en}. 
                  The password will be: <code className="font-mono font-semibold">novatech + current datetime</code>
                </p>
                
                <AnimatePresence>
                  {!showPasswordReset ? (
                    <motion.button
                      type="button"
                      onClick={() => setShowPasswordReset(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Password
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          ⚠️ Are you sure you want to reset the password?
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1 mb-3">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>A new password will be generated automatically</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>Student will be logged out from all devices</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>You must save and share the new password with the student</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          type="button"
                          onClick={handleResetPassword}
                          disabled={resettingPassword}
                          whileHover={{ scale: resettingPassword ? 1 : 1.02 }}
                          whileTap={{ scale: resettingPassword ? 1 : 0.98 }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {resettingPassword ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Resetting...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Confirm Reset
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setShowPasswordReset(false)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
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