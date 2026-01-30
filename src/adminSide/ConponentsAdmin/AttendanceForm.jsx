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
  Info,
  HelpCircle,
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
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
    <div className="space-y-4 sm:space-y-6">
      {/* Mode Toggle - Fully Responsive */}
      <motion.div variants={animations.scaleIn} initial="hidden" animate="show">
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 sm:p-2 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/60 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("session")}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${mode === "session"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-800"
              }`}
          >
            📅 Create Class Session
          </button>
          <button
            type="button"
            onClick={() => setMode("attendance")}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${mode === "attendance"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-800"
              }`}
          >
            ✓ Mark Attendance
          </button>
        </div>
      </motion.div>

      {/* Info Box - Mobile Friendly */}
      <motion.div variants={animations.fadeUp} initial="hidden" animate="show">
        <div className="p-3 sm:p-4 rounded-xl bg-blue-50/60 border border-blue-200/40 backdrop-blur-sm">
          <div className="flex items-start gap-2 sm:gap-3">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-blue-900">
                {mode === "session"
                  ? "Create a new class session before marking attendance"
                  : "Select a session from the dropdown to mark student attendance"}
              </p>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                {mode === "session"
                  ? "Choose the course, date, and time for the class session"
                  : "All sessions you've created will appear in the dropdown list"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerts - Responsive */}
      <AnimatePresence>
        {success && (
          <Alert type="success" message={`${mode === "session" ? "Class session created" : "Attendance marked"} successfully! 🎉`} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      {/* Forms - AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {mode === "session" ? (
          <SessionFormSection
            key="session"
            onSubmit={handleSessionSubmit}
            form={sessionForm}
            setForm={setSessionForm}
            loading={loading}
            courses={courses}
          />
        ) : (
          <AttendanceFormSection
            key="attendance"
            onSubmit={handleAttendanceSubmit}
            form={attendanceForm}
            setForm={setAttendanceForm}
            loading={loading}
            students={students}
            sessions={sessions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border shadow-md ${type === "success"
        ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
        : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
      }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
    ) : (
      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
    )}
    <p className={`text-xs sm:text-sm font-medium flex-1 ${type === "success" ? "text-emerald-800" : "text-red-800"}`}>
      {message}
    </p>
    {onClose && (
      <button onClick={onClose} className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0">
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    )}
  </motion.div>
);

const SessionFormSection = ({ onSubmit, form, setForm, loading, courses }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    exit="hidden"
    className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-xl p-4 sm:p-6 lg:p-8"
  >
    {/* Header */}
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Create Class Session</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Set up a new teaching session</p>
      </div>
    </div>

    <motion.form
      onSubmit={onSubmit}
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Course Selection */}
        <InputField
          icon={BookOpen}
          name="course_id"
          type="select"
          label="Course"
          placeholder="Choose a course"
          helpText="Select the course for this session"
          value={form.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
          options={courses}
          col="lg:col-span-2"
        />

        {/* Date */}
        <InputField
          icon={Calendar}
          name="session_date"
          type="date"
          label="Session Date"
          placeholder="Pick a date"
          helpText="When will this session take place?"
          value={form.session_date}
          onChange={(e) => setForm({ ...form, session_date: e.target.value })}
          col="lg:col-span-2"
        />

        {/* Time Fields */}
        <InputField
          icon={Clock}
          name="start_time"
          type="time"
          label="Start Time"
          placeholder="Start time"
          helpText="Session begins at"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        />
        <InputField
          icon={Clock}
          name="end_time"
          type="time"
          label="End Time"
          placeholder="End time"
          helpText="Session ends at"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
        />
      </div>

      <SubmitButton loading={loading} text="Create Session" icon={Sparkles} />
    </motion.form>
  </motion.div>
);

const AttendanceFormSection = ({ onSubmit, form, setForm, loading, students, sessions }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    exit="hidden"
    className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-xl p-4 sm:p-6 lg:p-8"
  >
    {/* Header */}
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
        <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Mark Attendance</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Record student attendance</p>
      </div>
    </div>

    <motion.form
      onSubmit={onSubmit}
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Student Selection */}
        <InputField
          icon={User}
          name="student_id"
          type="select"
          label="Student"
          placeholder="Select student"
          helpText="Which student attended?"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
          options={students}
          col="lg:col-span-2"
        />

        {/* Session Selection - Most Important */}
        <InputField
          icon={BookOpen}
          name="class_session_id"
          type="select"
          label="Class Session"
          placeholder="Choose a session"
          helpText="Select the session you want to mark attendance for"
          value={form.class_session_id}
          onChange={(e) => setForm({ ...form, class_session_id: e.target.value })}
          options={sessions || []}
          col="lg:col-span-2"
          important
        />

        {/* Status */}
        <InputField
          icon={CheckSquare}
          name="status"
          type="select"
          label="Attendance Status"
          placeholder="Select status"
          helpText="Was the student present, late, absent, or excused?"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { id: "present", name: "✓ Present" },
            { id: "late", name: "⏰ Late" },
            { id: "absent", name: "✗ Absent" },
            { id: "excused", name: "📝 Excused" }
          ]}
        />

        {/* Remarks */}
        <InputField
          icon={HelpCircle}
          name="remarks"
          type="text"
          label="Remarks (Optional)"
          placeholder="Add notes (e.g., 'Doctor's appointment')"
          helpText="Any additional information"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
      </div>

      <SubmitButton loading={loading} text="Mark Attendance" icon={CheckCircle2} />
    </motion.form>
  </motion.div>
);

const InputField = ({ icon: Icon, name, type, label, placeholder, helpText, value, onChange, options = [], col = "", important = false }) => (
  <motion.div variants={animations.item} className={`relative ${col}`}>
    {/* Label with Icon */}
    <label className="flex items-center gap-2 mb-2">
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
      <span className="text-xs sm:text-sm font-semibold text-gray-700">
        {label}
        {important && <span className="text-red-500 ml-1">*</span>}
      </span>
    </label>

    {/* Input/Select */}
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={!placeholder.includes("optional")}
        className={`w-full rounded-xl sm:rounded-2xl bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 border-2 ${important ? 'border-blue-400' : 'border-gray-200'
          } outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:border-blue-300`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.display_name || opt.course_name || opt.full_name_en || opt.student_name || opt.name || opt.title ||
              (opt.student_code ? `${opt.full_name_kh || opt.name || 'Student'} (${opt.student_code})` :
                (opt.course_code ? `${opt.name} (${opt.course_code})` : opt.id))}
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
        className="w-full rounded-xl sm:rounded-2xl bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 border-2 border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:border-blue-300"
      />
    )}

    {/* Help Text */}
    {helpText && (
      <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
        <Info className="w-3 h-3" />
        {helpText}
      </p>
    )}
  </motion.div>
);

const SubmitButton = ({ loading, text, icon: Icon }) => (
  <motion.button
    variants={animations.item}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    type="submit"
    className="w-full relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40"
  >
    {/* Shimmer Effect */}
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
          <span className="text-xs sm:text-sm">Processing...</span>
        </>
      ) : (
        <>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          {text}
        </>
      )}
    </span>
  </motion.button>
);

export default AttendanceForm;
