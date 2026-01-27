import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createClassSession,
  markAttendance,
} from "../../api/admin_course_api.jsx";
import {
  CheckSquare,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Calendar,
  User,
  Clock,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_SESSION_FORM = {
  course_id: "",
  session_date: "",
  start_time: "",
  end_time: "",
};

const INITIAL_ATTENDANCE_FORM = {
  student_id: "",
  class_session_id: "",
  status: "present",
  remarks: "",
};

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

const AttendanceForm = ({ onUpdate, courses, students, sessions }) => {
  const [mode, setMode] = useState("session"); // "session" or "attendance"
  const [sessionForm, setSessionForm] = useState(INITIAL_SESSION_FORM);
  const [attendanceForm, setAttendanceForm] = useState(INITIAL_ATTENDANCE_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const resetForms = () => {
    setSessionForm(INITIAL_SESSION_FORM);
    setAttendanceForm(INITIAL_ATTENDANCE_FORM);
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        course_id: parseInt(sessionForm.course_id, 10),
        session_date: sessionForm.session_date,
        start_time: sessionForm.start_time,
        end_time: sessionForm.end_time,
      };

      await createClassSession(submitData);
      resetForms();
      setSuccess(true);
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "Failed to create class session";

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

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        student_id: parseInt(attendanceForm.student_id, 10),
        class_session_id: parseInt(attendanceForm.class_session_id, 10),
        status: attendanceForm.status,
        remarks: attendanceForm.remarks?.trim() || null,
      };

      await markAttendance(submitData);
      resetForms();
      setSuccess(true);
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "Failed to mark attendance";

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
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
        <button
          type="button"
          onClick={() => setMode("session")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "session"
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
            : "text-gray-600 hover:bg-white/40"
            }`}
        >
          Create Class Session
        </button>
        <button
          type="button"
          onClick={() => setMode("attendance")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "attendance"
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
            : "text-gray-600 hover:bg-white/40"
            }`}
        >
          Mark Attendance
        </button>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {success && (
          <Alert type="success" message={`${mode === "session" ? "Class session created" : "Attendance marked"} successfully!`} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      {/* Forms */}
      {mode === "session" ? (
        <SessionFormSection
          onSubmit={handleSessionSubmit}
          form={sessionForm}
          setForm={setSessionForm}
          loading={loading}
          courses={courses}
        />
      ) : (
        <AttendanceFormSection
          onSubmit={handleAttendanceSubmit}
          form={attendanceForm}
          setForm={setAttendanceForm}
          loading={loading}
          students={students}
          sessions={sessions}
        />
      )}
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm ${type === "success"
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

const SessionFormSection = ({ onSubmit, form, setForm, loading, courses }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-2xl bg-white/90 border border-white shadow-lg p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">Create Class Session</h2>
    </div>

    <motion.form
      onSubmit={onSubmit}
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          icon={BookOpen}
          name="course_id"
          type="select"
          placeholder="Select Course"
          value={form.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
          options={courses}
          col="md:col-span-2"
        />
        <InputField
          icon={Calendar}
          name="session_date"
          type="date"
          placeholder="Session Date"
          value={form.session_date}
          onChange={(e) => setForm({ ...form, session_date: e.target.value })}
          col="md:col-span-2"
        />
        <InputField
          icon={Clock}
          name="start_time"
          type="time"
          placeholder="Start Time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        />
        <InputField
          icon={Clock}
          name="end_time"
          type="time"
          placeholder="End Time"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
        />
      </div>
      <SubmitButton loading={loading} text="Create Session" />
    </motion.form>
  </motion.div>
);

const AttendanceFormSection = ({ onSubmit, form, setForm, loading, students, sessions }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-2xl bg-white/90 border border-white shadow-lg p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">Mark Attendance</h2>
    </div>

    <motion.form
      onSubmit={onSubmit}
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          icon={User}
          name="student_id"
          type="select"
          placeholder="Select Student"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
          options={students}
        />
        <InputField
          icon={BookOpen}
          name="class_session_id"
          type="select"
          placeholder="Select Session"
          value={form.class_session_id}
          onChange={(e) => setForm({ ...form, class_session_id: e.target.value })}
          options={sessions || []}
        />
        <InputField
          icon={CheckSquare}
          name="status"
          type="select"
          placeholder="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { id: "present", name: "Present" },
            { id: "absent", name: "Absent" },
            { id: "late", name: "Late" },
            { id: "excused", name: "Excused" }
          ]}
        />
        <InputField
          icon={X}
          name="remarks"
          type="text"
          placeholder="Remarks (optional)"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
      </div>
      <SubmitButton loading={loading} text="Mark Attendance" />
    </motion.form>
  </motion.div>
);

const InputField = ({ icon: Icon, name, type, placeholder, value, onChange, options = [], col = "" }) => (
  <motion.div variants={animations.item} className={`relative ${col}`}>
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
      <Icon className="w-3.5 h-3.5" />
    </div>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={!placeholder.includes("optional")}
        className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.display_name || opt.course_name || opt.full_name_en || opt.student_name || opt.name || opt.title || (opt.student_code ? `${opt.full_name_kh || ''} (${opt.student_code})` : opt.id)}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={!placeholder.includes("optional")}
        className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
      />
    )}
  </motion.div>
);

const SubmitButton = ({ loading, text }) => (
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
          Processing...
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {text}
        </>
      )}
    </span>
  </motion.button>
);

export default AttendanceForm;
