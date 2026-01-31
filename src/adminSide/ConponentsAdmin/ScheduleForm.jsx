// ScheduleForm.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "../../gobalConponent/Alert.jsx";
import { createSchedule, updateSchedule } from "../../api/admin_course_api.jsx";
import { fetchRoomOptions } from "../../api/room_api.jsx";
import { fetchBuildingOptions } from '../../api/building_api.jsx';
import {
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Clock,
  MapPin,
  Pencil,
  RotateCcw,
  Building2,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  course_id: "",
  day_of_week: "",
  session_id: "",
  start_time: "",
  end_time: "",
  building_id: "",
  room_id: "",
  // Filters to find courses
  filter_academic_year: "",
  filter_semester: "",
};

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

const DAY_OPTIONS = [
  { id: "Monday", name: "Monday" },
  { id: "Tuesday", name: "Tuesday" },
  { id: "Wednesday", name: "Wednesday" },
  { id: "Thursday", name: "Thursday" },
  { id: "Friday", name: "Friday" },
  { id: "Saturday", name: "Saturday" },
  { id: "Sunday", name: "Sunday" },
];

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
  if (s.includes("morning") || ["am", "a", "shift1", "1", "shift 1", "shift-1"].includes(s)) return "morning";
  if (s.includes("afternoon") || ["pm", "b", "shift2", "2", "shift 2", "shift-2"].includes(s)) return "afternoon";
  if (s.includes("evening") || s.includes("night") || ["c", "shift3", "3", "shift 3", "shift-3"].includes(s)) return "evening";
  return s;
};

/* ================== COMPONENT ================== */

const ScheduleForm = ({ onUpdate, onSuccess, editingSchedule, onCancel, courses }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [timeEditable, setTimeEditable] = useState(false);
  const [defaultTimes, setDefaultTimes] = useState({ start: "", end: "" });

  // ✅ NEW: buildings + rooms state
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const isEditMode = !!editingSchedule;

  const courseOptions = useMemo(() => {
    const arr = Array.isArray(courses) ? courses : [];
    return arr
      .filter((c) => c && typeof c.id !== "undefined" && c.id !== null)
      .map((c) => ({ id: c.id, name: courseLabel(c) }));
  }, [courses]);

  const selectedCourse = useMemo(() => {
    const arr = Array.isArray(courses) ? courses : [];
    return arr.find((c) => String(c.id) === String(form.course_id));
  }, [courses, form.course_id]);

  // ✅ Computed filtered course options
  const filteredCourseOptions = useMemo(() => {
    const arr = Array.isArray(courses) ? courses : [];
    return arr
      .filter((c) => {
        if (!c) return false;
        const matchYear = form.filter_academic_year ? String(c.academic_year) === String(form.filter_academic_year) : true;
        const matchSem = form.filter_semester ? String(c.semester) === String(form.filter_semester) : true;
        return matchYear && matchSem;
      })
      .map((c) => ({ id: c.id, name: courseLabel(c) }));
  }, [courses, form.filter_academic_year, form.filter_semester]);

  const shift = useMemo(() => normalizeShift(selectedCourse?.shift), [selectedCourse?.shift]);

  const sessionOptions = useMemo(() => {
    if (!shift) return [];
    return SHIFT_SESSIONS[shift] || [];
  }, [shift]);

  // ✅ LOAD building options once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBuildingOptions();
        // expected: { success:true, data:[{id,label,code,name}] }
        setBuildings(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch {
        setBuildings([]);
      }
    })();
  }, []);

  // ✅ when building changes -> load rooms in that building
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
        // expected: { success:true, data:[{id,label,building_id,...}] }
        setRooms(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch {
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.building_id]);

  // ✅ prefill when edit
  useEffect(() => {
    if (editingSchedule) {
      // ✅ Prefill logic with nested safety
      const roomId = editingSchedule.room_id || editingSchedule.room?.id || "";
      const buildingId = editingSchedule.building_id || editingSchedule.room?.building_id || "";
      const course = editingSchedule.course || null;

      setForm({
        course_id: editingSchedule.course_id || "",
        day_of_week: editingSchedule.day_of_week || "",
        session_id: "",
        start_time: editingSchedule.start_time || "",
        end_time: editingSchedule.end_time || "",
        building_id: buildingId ? String(buildingId) : "",
        room_id: roomId ? String(roomId) : "",
        // Pre-fill filters if course exists to "auto-select" the right context
        filter_academic_year: course?.academic_year || "",
        filter_semester: course?.semester || "",
      });

      setTimeEditable(false);
      setDefaultTimes({
        start: editingSchedule.start_time ?? "",
        end: editingSchedule.end_time ?? "",
      });
    } else {
      setForm(INITIAL_FORM_STATE);
      setTimeEditable(false);
      setDefaultTimes({ start: "", end: "" });
    }
  }, [editingSchedule]);

  // ✅ when course changes: reset session and times (create mode only)
  useEffect(() => {
    if (!editingSchedule) {
      setForm((prev) => ({
        ...prev,
        session_id: "",
        start_time: "",
        end_time: "",
      }));
      setTimeEditable(false);
      setDefaultTimes({ start: "", end: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.course_id, editingSchedule]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setTimeEditable(false);
    setDefaultTimes({ start: "", end: "" });
    setError(null);
    if (onCancel) onCancel();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // session -> set default times and lock edit
    if (name === "session_id") {
      const s = (sessionOptions || []).find((x) => x.id === value);
      if (s) {
        setForm((prev) => ({
          ...prev,
          session_id: value,
          start_time: s.start,
          end_time: s.end,
        }));
        setDefaultTimes({ start: s.start, end: s.end });
        setTimeEditable(false);
        setError(null);
        return;
      }
    }

    // building change -> clear room_id immediately
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
        day_of_week: form.day_of_week,
        start_time: form.start_time,
        end_time: form.end_time,
        room_id: form.room_id ? Number.parseInt(form.room_id, 10) : null, // ✅ send FK
      };

      if (!submitData.course_id || Number.isNaN(submitData.course_id)) {
        setError("Please select a course");
        setLoading(false);
        return;
      }

      if (!submitData.day_of_week) {
        setError("Please select day of week");
        setLoading(false);
        return;
      }

      if (!form.session_id && !isEditMode) {
        setError("Please select a session");
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

      // optional: enforce room selection
      // if (!submitData.room_id) { setError("Please select a room"); ... }

      if (isEditMode) {
        await updateSchedule(editingSchedule.id, submitData);
      } else {
        await createSchedule(submitData);
      }

      resetForm();
      setSuccess(true);

      if (onSuccess) onSuccess();
      if (onUpdate) onUpdate();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "Failed to save schedule";
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
        message={`Schedule ${isEditMode ? "updated" : "created"} successfully!`}
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
        courseOptions={filteredCourseOptions} // Use filtered list
        shift={shift}
        sessionOptions={sessionOptions}
        buildings={buildings}
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
  buildings,
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

    {/* COURSE FILTERS SECTION */}
    <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Filter Courses</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Academic Year</label>
          <select
            name="filter_academic_year"
            value={form.filter_academic_year}
            onChange={handleChange}
            className="w-full rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Years</option>
            {/* Standard years - could be dynamic later */}
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Semester</label>
          <select
            name="filter_semester"
            value={form.filter_semester}
            onChange={handleChange}
            className="w-full rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
          </select>
        </div>
      </div>
    </div>

    <motion.form onSubmit={onSubmit} initial="hidden" animate="show" className="space-y-3">
      {/* COURSE */}
      <FieldSelect
        icon={BookOpen}
        name="course_id"
        value={form.course_id}
        onChange={handleChange}
        label="Course Selection"
        placeholder="Choose a course..."
        helpText="Select the subject or course for this schedule"
        options={courseOptions}
        required
        col="md:col-span-2"
      />

      {/* DAY */}
      <FieldSelect
        icon={Calendar}
        name="day_of_week"
        value={form.day_of_week}
        onChange={handleChange}
        label="Day of Week"
        placeholder="Select Day..."
        helpText="The day this class will be held every week"
        options={DAY_OPTIONS}
        required
        col="md:col-span-2"
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
                This class is scheduled for the <b className="underline underline-offset-2">{shift}</b> shift. Sessions are 75 minutes each.
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

      {/* SESSION */}
      <FieldSelect
        icon={Clock}
        name="session_id"
        value={form.session_id}
        onChange={handleChange}
        label="Class Session"
        placeholder={shift ? `Select ${shift} Session` : "Select Session"}
        helpText="Quickly pick a standard session time"
        options={(Array.isArray(sessionOptions) ? sessionOptions : []).map((s) => ({ id: s.id, name: s.name }))}
        required={!isEditMode}
        col="md:col-span-2"
        disabled={!Array.isArray(sessionOptions) || sessionOptions.length === 0}
      />

      {/* TIME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
        <FieldTime
          icon={Clock}
          name="start_time"
          value={form.start_time}
          onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))}
          label="Start Time"
          helpText="Format: HH:MM (e.g., 07:45)"
          disabled={!timeEditable}
          required
        />
        <FieldTime
          icon={Clock}
          name="end_time"
          value={form.end_time}
          onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))}
          label="End Time"
          helpText="Format: HH:MM (e.g., 09:00)"
          disabled={!timeEditable}
          required
        />
      </div>

      <div className="flex flex-wrap gap-2 md:col-span-2">
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
        label="Campus Building"
        placeholder="Select Building (Optional)"
        helpText="Where is this class located?"
        options={(Array.isArray(buildings) ? buildings : []).map((b) => ({
          id: b.id,
          name: b.label ?? `${b.code ?? b.building_code ?? ""} - ${b.name ?? b.building_name ?? ""}`.trim(),
        }))}
        col="md:col-span-2"
      />

      {/* ROOM (filtered by building) */}
      <FieldSelect
        icon={MapPin}
        name="room_id"
        value={form.room_id}
        onChange={handleChange}
        label="Classroom"
        placeholder={form.building_id ? (roomsLoading ? "Loading rooms..." : "Choose Room") : "Select building first"}
        helpText="Specific room number or name"
        options={(Array.isArray(rooms) ? rooms : []).map((r) => ({
          id: r.id,
          name: r.label ?? `${r.building_code ?? ""}-${r.room_number ?? ""}`.replace(/^-|-$/g, ""),
        }))}
        col="md:col-span-2"
        disabled={!form.building_id || roomsLoading}
      />

      <SubmitButton loading={loading} isEditMode={isEditMode} />
    </motion.form>
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">{isEditMode ? "Edit Schedule" : "Create New Schedule"}</h2>
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

const FieldSelect = ({ icon: Icon, name, value, onChange, placeholder, options, required, col, disabled, label, helpText }) => (
  <div className={`space-y-1.5 ${col || ""}`}>
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

const FieldTime = ({ icon: Icon, name, value, onChange, label, disabled, helpText, required }) => (
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
          {isEditMode ? "Updating Schedule..." : "Saving Schedule..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Schedule" : "Create Schedule"}
        </>
      )}
    </span>
  </motion.button>
);

export default ScheduleForm;
