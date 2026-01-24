import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateStudent, resetStudentPassword } from "../../../src/api/student_api.jsx";
import { fetchDepartments } from "../../../src/api/department_api.jsx";
import { fetchMajors } from "../../../src/api/major_api.jsx";

import {
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
  Key,
  RefreshCw,
  Copy,
  Lock,
  GraduationCap,
} from "lucide-react";

/* ================== HELPERS ================== */
const toDateInputValue = (val) => {
  if (!val) return "";
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return "";
};

const generatePassword = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `novatech${yyyy}${mm}${dd}${hh}${mi}${ss}`;
};

const buildAcademicYears = (count = 10) => {
  const y = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => `${y + i}-${y + i + 1}`);
};

/* ================== CONSTANTS ================== */
const INITIAL_FORM_STATE = {
  // student table
  department_id: "",
  full_name_en: "",
  full_name_kh: "",
  date_of_birth: "",
  gender: "Male",
  nationality: "Cambodian",
  phone_number: "",
  address: "",
  generation: "",
  parent_name: "",
  parent_phone: "",

  // registration/user important fields
  personal_email: "",
  current_address: "",
  major_id: "",
  shift: "",
  batch: "",
  academic_year: "",
};

const SHIFT_OPTIONS = ["Morning", "Afternoon", "Evening"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];

/* ================== ANIMATION VARIANTS ================== */
const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
  },
};

/* ================== COMPONENT ================== */
const StudentsForm = ({ onUpdate, editingStudent, onCancelEdit }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Password Reset States
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const academicYearOptions = useMemo(() => buildAcademicYears(12), []);
  const filteredMajors = useMemo(() => {
    if (!form.department_id) return majors;
    return majors.filter((m) => String(m.department_id) === String(form.department_id));
  }, [majors, form.department_id]);

  useEffect(() => {
    loadDepartments();
    loadMajors();
  }, []);

  useEffect(() => {
    if (!editingStudent) {
      setForm(INITIAL_FORM_STATE);
      return;
    }

    const reg = editingStudent.registration || {};

    setForm({
      department_id: editingStudent.department_id || "",

      full_name_en: editingStudent.full_name_en || "",
      full_name_kh: editingStudent.full_name_kh || "",
      date_of_birth: toDateInputValue(editingStudent.date_of_birth),
      gender: editingStudent.gender || "Male",
      nationality: editingStudent.nationality || "Cambodian",
      phone_number: editingStudent.phone_number || "",
      address: editingStudent.address || "",
      generation: editingStudent.generation != null ? String(editingStudent.generation) : "",
      parent_name: editingStudent.parent_name || "",
      parent_phone: editingStudent.parent_phone || "",

      personal_email: reg.personal_email || editingStudent.user?.email || "",
      current_address: reg.current_address || "",
      major_id: reg.major_id || "",
      shift: reg.shift || "",
      batch: reg.batch || "",
      academic_year: reg.academic_year || "",
    });

    setShowPasswordReset(false);
    setPasswordResetSuccess(false);
    setNewPassword("");
  }, [editingStudent]);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setDepartments(list);
    } catch (err) {
      console.error("Failed to load departments:", err);
      setDepartments([]);
    }
  };

  const loadMajors = async () => {
    try {
      const res = await fetchMajors();
      const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setMajors(list);
    } catch (err) {
      console.error("Failed to load majors:", err);
      setMajors([]);
    }
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
      setTimeout(() => setPasswordResetSuccess(false), 10000);
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
    onCancelEdit?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingStudent) {
      setError("Please select a student to edit. Creating students is not allowed.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        department_id: form.department_id,

        full_name_kh: form.full_name_kh,
        full_name_en: form.full_name_en,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        nationality: form.nationality,
        phone_number: form.phone_number,
        address: form.address,
       generation: form.generation != null ? String(form.generation) : "",
        parent_name: form.parent_name,
        parent_phone: form.parent_phone,

        personal_email: form.personal_email,
        current_address: form.current_address,
        major_id: form.major_id || null,
        shift: form.shift,
        batch: form.batch,
        academic_year: form.academic_year,
      };

      console.log("UPDATE PAYLOAD", payload);

      await updateStudent(editingStudent.id, payload);

      setSuccess(true);
      onUpdate?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || err.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {success && <Alert type="success" message="Student updated successfully!" />}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

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
              <p className="text-sm font-semibold text-green-800 mb-1">Password Reset Successfully!</p>

              <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 mb-1 font-medium">New Password:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono font-bold text-green-900 bg-green-50 px-3 py-1.5 rounded border border-green-200">
                    {newPassword}
                  </code>

                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    type="button"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-green-600 mt-2">⚠️ Save this password. Student must use it to login.</p>
            </div>

            <button onClick={() => setPasswordResetSuccess(false)} className="text-green-600 hover:text-green-800" type="button">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={animations.fadeUp} initial="hidden" animate="show" className="rounded-2xl bg-white/90 border border-white shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Edit Student</h2>
          </div>

          {editingStudent && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetForm}
              type="button"
              className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </motion.button>
          )}
        </div>

        {!editingStudent ? (
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
            Select a student from table to edit. Creating new students is disabled.
          </div>
        ) : (
          <motion.form onSubmit={handleSubmit} variants={animations.container} initial="hidden" animate="show" className="space-y-4">
            {/* ================= University Info ================= */}
            <SectionTitle title="University Information" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SelectField
                label="Department"
                icon={Building2}
                value={form.department_id}
                onChange={(v) => setForm((p) => ({ ...p, department_id: v, major_id: "" }))}
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                required
              />

              <SelectField
                label="Major"
                icon={GraduationCap}
                value={form.major_id}
                onChange={(v) => setField("major_id", v)}
                options={filteredMajors.map((m) => ({ value: m.id, label: m.major_name }))}
              />

              <SelectField
                label="Shift"
                icon={Hash}
                value={form.shift}
                onChange={(v) => setField("shift", v)}
                options={SHIFT_OPTIONS.map((s) => ({ value: s, label: s }))}
              />

              <InputField label="Batch" icon={Hash} value={form.batch} onChange={(v) => setField("batch", v)} placeholder="Batch" />

              <SelectField
                label="Academic Year"
                icon={Calendar}
                value={form.academic_year}
                onChange={(v) => setField("academic_year", v)}
                options={academicYearOptions.map((y) => ({ value: y, label: y }))}
              />

              <InputField
                label="Generation"
                icon={Hash}
                value={form.generation}
                onChange={(v) => setField("generation", v)}
                placeholder="Generation/Batch"
              />
            </div>

            {/* ================= Personal Info ================= */}
            <SectionTitle title="Personal Information" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputField label="Full Name (English)" icon={User} col="md:col-span-2" value={form.full_name_en} onChange={(v) => setField("full_name_en", v)} />
              <InputField label="Full Name (Khmer)" icon={User} col="md:col-span-2" value={form.full_name_kh} onChange={(v) => setField("full_name_kh", v)} />

              <InputField
                label="Date of Birth"
                icon={Calendar}
                type="date"
                value={form.date_of_birth}
                onChange={(v) => setField("date_of_birth", v)}
              />

              <SelectField
                label="Gender"
                icon={User}
                value={form.gender}
                onChange={(v) => setField("gender", v)}
                options={GENDER_OPTIONS.map((g) => ({ value: g, label: g }))}
              />

              <InputField label="Nationality" icon={MapPin} value={form.nationality} onChange={(v) => setField("nationality", v)} />
              <InputField label="Phone Number" icon={Phone} value={form.phone_number} onChange={(v) => setField("phone_number", v)} />

              <TextAreaField label="Address" icon={MapPin} col="md:col-span-2" value={form.address} onChange={(v) => setField("address", v)} />
              <TextAreaField label="Current Address" icon={MapPin} col="md:col-span-2" value={form.current_address} onChange={(v) => setField("current_address", v)} />

              <InputField label="Personal Email" icon={Mail} col="md:col-span-2" value={form.personal_email} onChange={(v) => setField("personal_email", v)} />
            </div>

            {/* ================= Parent Info ================= */}
            <SectionTitle title="Parent / Guardian" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputField label="Parent Name" icon={User} value={form.parent_name} onChange={(v) => setField("parent_name", v)} />
              <InputField label="Parent Phone" icon={Phone} value={form.parent_phone} onChange={(v) => setField("parent_phone", v)} />
            </div>

            {/* ================= Password Reset ================= */}
            <SectionTitle title="Password Reset" />

            <motion.div variants={animations.item} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Key className="w-5 h-5 text-orange-600" />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-3">
                    Generate a new password for <b>{editingStudent.full_name_en}</b>. Password format:{" "}
                    <code className="font-mono font-semibold">novatech + datetime</code>
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
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                        <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
                          <p className="text-xs font-medium text-gray-700 mb-2">⚠️ Confirm reset?</p>
                          <p className="text-xs text-gray-600">Student will be logged out from all devices.</p>
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            type="button"
                            onClick={async () => {
                              setResettingPassword(true);
                              try {
                                const pwd = generatePassword();
                                setNewPassword(pwd);
                                await resetStudentPassword(editingStudent.id, pwd);
                                setPasswordResetSuccess(true);
                                setShowPasswordReset(false);
                                setTimeout(() => setPasswordResetSuccess(false), 10000);
                              } catch (err) {
                                setError(err.response?.data?.message || "Failed to reset password");
                              } finally {
                                setResettingPassword(false);
                              }
                            }}
                            disabled={resettingPassword}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md disabled:opacity-50"
                          >
                            {resettingPassword ? "Resetting..." : "Confirm Reset"}
                          </motion.button>

                          <motion.button
                            type="button"
                            onClick={() => setShowPasswordReset(false)}
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
            </motion.div>

            <SubmitButton loading={loading} />
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

/* ===================== UI PARTS ===================== */
const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm ${
      type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    )}

    <p className={`text-sm font-medium ${type === "success" ? "text-green-800" : "text-red-800"}`}>{message}</p>

    {onClose && (
      <button onClick={onClose} className="ml-auto text-red-600 hover:text-red-800" type="button">
        <X className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

const SectionTitle = ({ title }) => (
  <div className="pt-2">
    <p className="text-sm font-semibold text-gray-900">{title}</p>
    <div className="h-px bg-gray-200 mt-2" />
  </div>
);

const BaseFieldShell = ({ label, icon: Icon, children, col = "" }) => (
  <motion.div variants={{ ...{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } } }} className={`space-y-1 ${col}`}>
    <label className="text-xs font-semibold text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon className="w-4 h-4" />
      </div>
      {children}
    </div>
  </motion.div>
);

const InputField = ({ label, icon, value, onChange, placeholder = "", type = "text", col = "" }) => (
  <BaseFieldShell label={label} icon={icon} col={col}>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
    />
  </BaseFieldShell>
);

const TextAreaField = ({ label, icon, value, onChange, col = "" }) => (
  <BaseFieldShell label={label} icon={icon} col={col}>
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all resize-none"
    />
  </BaseFieldShell>
);

const SelectField = ({ label, icon, value, onChange, options = [], required = false, col = "" }) => (
  <BaseFieldShell label={label} icon={icon} col={col}>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all appearance-none cursor-pointer"
    >
      <option value="">Select {label}</option>
      {options.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  </BaseFieldShell>
);

const SubmitButton = ({ loading }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    type="submit"
    className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
  >
    <span className="flex items-center justify-center gap-2">
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
          Updating Student...
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          Update Student
        </>
      )}
    </span>
  </motion.button>
);

export default StudentsForm;
