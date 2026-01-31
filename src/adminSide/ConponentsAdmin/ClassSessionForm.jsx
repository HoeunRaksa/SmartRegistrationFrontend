import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { createSession, updateSession } from "../../api/course_api.jsx";
import { fetchRoomOptions } from "../../api/room_api.jsx";
import { fetchBuildingOptions } from "../../api/building_api.jsx";
import { X, CheckCircle2, Sparkles, BookOpen, Calendar, Clock, DoorOpen, Building2, Pencil, RotateCcw, AlertCircle } from "lucide-react";
import Alert from "../../gobalConponent/Alert.jsx";

const INITIAL_FORM_STATE = {
  course_id: "",
  session_date: "",
  start_time: "",
  end_time: "",
  building_id: "",
  room_id: "",
  session_type: "",
};

const SESSION_TYPES = [
  { id: "lecture", name: "Lecture" },
  { id: "lab", name: "Laboratory" },
  { id: "tutorial", name: "Tutorial" },
  { id: "seminar", name: "Seminar" },
  { id: "exam", name: "Exam" },
  { id: "makeup", name: "Makeup Class" },
  { id: "other", name: "Other" },
];

// ✅ Same session times as ScheduleForm
const SHIFT_SESSIONS = {
  morning: [
    { id: "M1", name: "Morning Session 1 (07:45 - 09:00)", start: "07:45", end: "09:00" },
    { id: "M2", name: "Morning Session 2 (09:30 - 10:45)", start: "09:30", end: "10:45" },
  ],
  afternoon: [
    { id: "A1", name: "Afternoon Session 1 (14:00 - 15:15)", start: "14:00", end: "15:15" },
    { id: "A2", name: "Afternoon Session 2 (15:45 - 17:00)", start: "15:45", end: "17:00" },
  ],
  evening: [
    { id: "E1", name: "Evening Session 1 (17:30 - 18:45)", start: "17:30", end: "18:45" },
    { id: "E2", name: "Evening Session 2 (19:15 - 20:30)", start: "19:15", end: "20:30" },
  ],
};

/* ================== HELPERS ================== */

const courseLabel = (c) => {
  if (c?.display_name) return String(c.display_name);
  if (c?.course_label) return String(c.course_label);

  const code = c?.course_code ?? c?.code ?? "";
  const name = c?.course_name ?? c?.name ?? c?.title ?? "";

  if (String(code).trim() && String(name).trim()) return `${code} - ${name}`;
  if (String(name).trim()) return String(name);
  if (String(code).trim()) return String(code);
  return `Course #${c?.id ?? ""}`;
};

const normalizeShift = (shift) => {
  const s = String(shift || "").trim().toLowerCase();
  if (!s) return "";
  if (["morning", "am", "a", "shift1", "1"].includes(s)) return "morning";
  if (["afternoon", "pm", "b", "shift2", "2"].includes(s)) return "afternoon";
  if (["evening", "night", "c", "shift3", "3"].includes(s)) return "evening";
  return s;
};

/* ================== COMPONENT ================== */

const ClassSessionForm = ({ onUpdate, onSuccess, editingSession, onCancel, courses, buildings }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [timeEditable, setTimeEditable] = useState(false);
  const [defaultTimes, setDefaultTimes] = useState({ start: "", end: "" });
  const [sessionId, setSessionId] = useState("");

  // Buildings & Rooms
  const [buildingsList, setBuildingsList] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const isEditMode = !!editingSession;

  // ✅ Load buildings
  useEffect(() => {
    if (Array.isArray(buildings) && buildings.length > 0) {
      setBuildingsList(buildings);
    } else {
      loadBuildings();
    }
  }, [buildings]);

  const loadBuildings = async () => {
    try {
      const res = await fetchBuildingOptions();
      setBuildingsList(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch {
      setBuildingsList([]);
    }
  };

  // ✅ Load rooms when building changes
  useEffect(() => {
    (async () => {
      if (!form.building_id) {
        setRooms([]);
        setForm((p) => ({ ...p, room_id: "" }));
        return;
      }

      setRoomsLoading(true);
      try {
        const res = await fetchRoomOptions({ building_id: form.building_id });
        setRooms(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch {
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    })();
  }, [form.building_id]);

  // ✅ Course options
  const courseOptions = useMemo(() => {
    const arr = Array.isArray(courses) ? courses : [];
    return arr
      .filter((c) => c && typeof c.id !== "undefined" && c.id !== null)
      .map((c) => ({
        id: c.id,
        name: courseLabel(c),
      }));
  }, [courses]);

  // ✅ Selected course
  const selectedCourse = useMemo(() => {
    const arr = Array.isArray(courses) ? courses : [];
    return arr.find((c) => String(c.id) === String(form.course_id));
  }, [courses, form.course_id]);

  const shift = useMemo(() => normalizeShift(selectedCourse?.shift), [selectedCourse?.shift]);

  const sessionOptions = useMemo(() => {
    if (!shift) return [];
    return SHIFT_SESSIONS[shift] || [];
  }, [shift]);

  // ✅ Prefill when editing
  useEffect(() => {
    if (editingSession) {
      setForm({
        course_id: editingSession.course_id ?? "",
        session_date: editingSession.session_date ?? "",
        start_time: editingSession.start_time ?? "",
        end_time: editingSession.end_time ?? "",
        building_id: editingSession.building_id ?? "",
        room_id: editingSession.room_id ?? "",
        session_type: editingSession.session_type ?? "",
      });

      setTimeEditable(false);
      setDefaultTimes({
        start: editingSession.start_time ?? "",
        end: editingSession.end_time ?? "",
      });
      setSessionId("");
    } else {
      setForm(INITIAL_FORM_STATE);
      setTimeEditable(false);
      setDefaultTimes({ start: "", end: "" });
      setSessionId("");
    }
  }, [editingSession]);

  // ✅ Reset session when course changes (create mode only)
  useEffect(() => {
    if (!editingSession) {
      setSessionId("");
      setForm((prev) => ({
        ...prev,
        start_time: "",
        end_time: "",
      }));
      setTimeEditable(false);
      setDefaultTimes({ start: "", end: "" });
    }
  }, [form.course_id, editingSession]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setTimeEditable(false);
    setDefaultTimes({ start: "", end: "" });
    setSessionId("");
    setError(null);
    if (onCancel) onCancel();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Session selection -> set times
    if (name === "session_id") {
      const s = (sessionOptions || []).find((x) => x.id === value);
      if (s) {
        setSessionId(value);
        setForm((prev) => ({
          ...prev,
          start_time: s.start,
          end_time: s.end,
        }));
        setDefaultTimes({ start: s.start, end: s.end });
        setTimeEditable(false);
        setError(null);
        return;
      }
    }

    // Building change -> clear room
    if (name === "building_id") {
      setForm((prev) => ({
        ...prev,
        building_id: value,
        room_id: "",
      }));
      setError(null);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const toggleModifyTime = () => setTimeEditable((v) => !v);

  const resetTimeToDefault = () => {
    if (!defaultTimes.start || !defaultTimes.end) return;
    setForm((prev) => ({
      ...prev,
      start_time: defaultTimes.start,
      end_time: defaultTimes.end,
    }));
    setTimeEditable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        course_id: Number.parseInt(form.course_id, 10),
        session_date: form.session_date,
        start_time: form.start_time,
        end_time: form.end_time,
        room_id: form.room_id ? Number.parseInt(form.room_id, 10) : null,
        session_type: form.session_type || null,
      };

      if (!submitData.course_id || Number.isNaN(submitData.course_id)) {
        setError("Please select a course");
        setLoading(false);
        return;
      }

      if (!submitData.session_date) {
        setError("Please select a date");
        setLoading(false);
        return;
      }

      if (!submitData.start_time || !submitData.end_time) {
        setError("Session time is missing");
        setLoading(false);
        return;
      }

      if (submitData.end_time <= submitData.start_time) {
        setError("End time must be after start time");
        setLoading(false);
        return;
      }

      if (isEditMode) {
        await updateSession(editingSession.id, submitData);
      } else {
        await createSession(submitData);
      }

      resetForm();
      setSuccess(true);

      if (onSuccess) onSuccess();
      if (onUpdate) onUpdate();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "Failed to save session";
      if (err.response?.data) {
        const data = err.response.data;
        if (data.errors) errorMessage = Object.values(data.errors).flat().join(", ");
        else if (data.message) errorMessage = data.message;
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

      <Alert
        isOpen={success}
        type="success"
        message={`Session ${isEditMode ? "updated" : "created"} successfully!`}
        onClose={() => setSuccess(false)}
      />
      <Alert
        isOpen={!!error}
        type="error"
        message={error}
        onClose={() => setError(null)}
      />

      <FormSection
        isEditMode={isEditMode}
        onCancel={resetForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        loading={loading}
        courseOptions={courseOptions}
        shift={shift}
        sessionOptions={sessionOptions}
        sessionId={sessionId}
        buildingsList={buildingsList}
        rooms={rooms}
        roomsLoading={roomsLoading}
        handleChange={handleChange}
        timeEditable={timeEditable}
        toggleModifyTime={toggleModifyTime}
        resetTimeToDefault={resetTimeToDefault}
        defaultTimes={defaultTimes}
      />
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */



const FormSection = ({
  isEditMode,
  onCancel,
  onSubmit,
  form,
  setForm,
  loading,
  courseOptions,
  shift,
  sessionOptions,
  sessionId,
  buildingsList,
  rooms,
  roomsLoading,
  handleChange,
  timeEditable,
  toggleModifyTime,
  resetTimeToDefault,
  defaultTimes,
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-2xl bg-white border border-white shadow-lg p-5"
  >
    <FormHeader isEditMode={isEditMode} onCancel={onCancel} />

    <motion.form onSubmit={onSubmit} initial="hidden" animate="show" className="space-y-3">
      {/* COURSE */}
      <FieldSelect
        icon={BookOpen}
        name="course_id"
        value={form.course_id}
        onChange={handleChange}
        label="Select Course"
        placeholder="Choose a course for this session..."
        helpText="The subject this class belongs to"
        options={courseOptions}
        required
      />

      {/* SESSION DATE */}
      <FieldInput
        icon={Calendar}
        name="session_date"
        type="date"
        value={form.session_date}
        onChange={handleChange}
        label="Class Date"
        placeholder="Session Date"
        helpText="The day this specific class session occurs"
        required
      />

      {/* SHIFT INFO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:col-span-2"
      >
        {shift ? (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Automatic Shift Detection</p>
              <p className="text-xs text-blue-600 mt-0.5">
                This class is scheduled for the <b className="underline underline-offset-2">{shift}</b> shift. Standard sessions are 75 minutes.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-3 flex items-center gap-3">
            <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 italic">Select a course to see available time sessions</p>
          </div>
        )}
      </motion.div>

      {/* SESSION SELECT (optional - for quick time selection) */}
      <FieldSelect
        icon={Clock}
        name="session_id"
        value={sessionId}
        onChange={handleChange}
        label="Quick Time Pick"
        placeholder={shift ? `Standard ${shift} Sessions` : "Quick Select (Select Course first)"}
        helpText="Automatically fill start and end times"
        options={(Array.isArray(sessionOptions) ? sessionOptions : []).map((s) => ({ id: s.id, name: s.name }))}
        disabled={!Array.isArray(sessionOptions) || sessionOptions.length === 0}
      />

      {/* TIME FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldTime
          icon={Clock}
          name="start_time"
          value={form.start_time}
          onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))}
          label="Start Time"
          helpText="Format: HH:MM"
          disabled={!timeEditable}
          required
        />
        <FieldTime
          icon={Clock}
          name="end_time"
          value={form.end_time}
          onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))}
          label="End Time"
          helpText="Format: HH:MM"
          disabled={!timeEditable}
          required
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleModifyTime}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50/30 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-sm"
          disabled={!form.start_time || !form.end_time}
        >
          {timeEditable ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Pencil className="w-3.5 h-3.5" />
          )}
          {timeEditable ? "Lock Manual Time" : "Customize Time"}
        </button>

        <button
          type="button"
          onClick={resetTimeToDefault}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-sm"
          disabled={!defaultTimes?.start || !defaultTimes?.end || !timeEditable}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Standard
        </button>
      </div>

      {/* BUILDING */}
      <FieldSelect
        icon={Building2}
        name="building_id"
        value={form.building_id}
        onChange={handleChange}
        label="Building Location"
        placeholder="Select Building (Optional)"
        helpText="Campus building for this class"
        options={(Array.isArray(buildingsList) ? buildingsList : []).map((b) => ({
          id: b.id,
          name: b.label ?? `${b.code ?? b.building_code ?? ""} - ${b.name ?? b.building_name ?? ""}`.trim(),
        }))}
      />

      {/* ROOM */}
      <FieldSelect
        icon={DoorOpen}
        name="room_id"
        value={form.room_id}
        onChange={handleChange}
        label="Specific Room"
        placeholder={
          form.building_id ? (roomsLoading ? "Loading rooms..." : "Choose Room") : "Select building first"
        }
        helpText="Classroom number or name"
        options={(Array.isArray(rooms) ? rooms : []).map((r) => ({
          id: r.id,
          name: r.label ?? `${r.building_code ?? ""}-${r.room_number ?? ""}`.replace(/^-|-$/g, ""),
        }))}
        disabled={!form.building_id || roomsLoading}
      />

      {/* SESSION TYPE */}
      <FieldSelect
        icon={BookOpen}
        name="session_type"
        value={form.session_type}
        onChange={handleChange}
        label="Type of Session"
        placeholder="Select Type (Optional)"
        helpText="Lecture, Lab, Exam, etc."
        options={SESSION_TYPES}
      />

      <SubmitButton loading={loading} isEditMode={isEditMode} />
    </motion.form>
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditMode ? "Edit Class Session" : "Create New Class Session"}
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

const FieldSelect = ({
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  options,
  required,
  disabled,
  label,
  helpText,
}) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none z-10">
        <Icon className="w-4 h-4" />
      </div>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={!!required}
        disabled={!!disabled}
        className="w-full rounded-xl bg-gray-50/50 pl-10 pr-3 py-2.5 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        <option value="">{placeholder}</option>
        {(Array.isArray(options) ? options : []).map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
    {helpText && <p className="text-[10px] text-gray-500 ml-1 italic">{helpText}</p>}
  </div>
);

const FieldInput = ({
  icon: Icon,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  label,
  helpText,
  ...props
}) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none z-10">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={!!required}
        className="w-full rounded-xl bg-gray-50/50 pl-10 pr-3 py-2.5 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm"
        {...props}
      />
    </div>
    {helpText && <p className="text-[10px] text-gray-500 ml-1 italic">{helpText}</p>}
  </div>
);

const FieldTime = ({ icon: Icon, name, value, onChange, label, disabled, required, helpText }) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none z-10">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type="time"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        aria-label={label}
        disabled={!!disabled}
        required={!!required}
        className="w-full rounded-xl bg-gray-50/50 pl-10 pr-3 py-2.5 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      />
    </div>
    {helpText && <p className="text-[10px] text-gray-500 ml-1 italic">{helpText}</p>}
  </div>
);

const SubmitButton = ({ loading, isEditMode }) => (
  <motion.button
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
          {isEditMode ? "Updating Session..." : "Saving Session..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Session" : "Create Session"}
        </>
      )}
    </span>
  </motion.button>
);

export default ClassSessionForm;