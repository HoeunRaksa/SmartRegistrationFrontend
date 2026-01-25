/* ========================= EnrollmentForm.jsx (GLASS iOS26, BIGGER UI, COURSE FILTER BY MAJOR) ========================= */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { enrollStudent, updateEnrollmentStatus } from "../../api/admin_course_api.jsx";
import {
  BookOpen,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Search,
  Lock,
  RefreshCw,
  ChevronDown,
  Filter,
} from "lucide-react";

/* ================== CONSTANTS ================== */
const INITIAL_FORM_STATE = {
  student_ids: [],
  course_id: "",
  status: "enrolled",
};

const STATUS_OPTIONS = [
  { id: "enrolled", name: "Enrolled" },
  { id: "dropped", name: "Dropped" },
  { id: "completed", name: "Completed" },
];

/* ================== ANIMATION VARIANTS ================== */
const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
  },
  item: {
    hidden: { opacity: 0, y: 10, scale: 0.985 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 26 } },
  },
};

/* ================== SAFE HELPERS ================== */
const safeStr = (v) => (v === null || v === undefined ? "" : String(v));

const pickStudentName = (s) =>
  safeStr(s?.student_name) ||
  safeStr(s?.full_name_en) ||
  safeStr(s?.full_name_kh) ||
  safeStr(s?.student_name_kh) ||
  safeStr(s?.name) ||
  safeStr(s?.full_name) ||
  "Unknown";

const pickStudentCode = (s) => safeStr(s?.student_code);
const pickEmail = (s) => safeStr(s?.email ?? s?.student_email ?? s?.user?.email);
const pickAvatar = (s) => safeStr(s?.profile_picture_url ?? s?.avatar_url ?? "");

/* ================== MAJOR/DEPT HELPERS ================== */
const getStudentDeptId = (st) =>
  safeStr(st?.department_id ?? st?.registration?.department_id ?? st?.department?.id ?? "");

const getStudentMajorId = (st) =>
  safeStr(st?.major_id ?? st?.registration?.major_id ?? st?.major?.id ?? "");

/* ================== COURSE HELPERS ================== */
const getCourseMajorId = (c) => {
  // Try multiple paths to get major_id from course
  return safeStr(
    c?.major_id ?? 
    c?.majorSubject?.major_id ?? 
    c?.majorSubject?.major?.id ?? 
    c?.classGroup?.major_id ?? 
    ""
  );
};

/* ================== COURSE LABELS ================== */
const getCourseLabelShort = (c) => {
  const courseName = safeStr(c?.course_name);
  const display = safeStr(c?.display_name);
  if (courseName) return courseName;
  if (display) return display;

  const subj =
    safeStr(c?.majorSubject?.subject?.subject_name) ||
    safeStr(c?.majorSubject?.subject?.name) ||
    safeStr(c?.subject_name);

  const cls = safeStr(c?.classGroup?.class_name) || safeStr(c?.class_group_name);
  const year = safeStr(c?.academic_year);
  const sem = c?.semester ? `Sem ${c.semester}` : "";
  return [subj || "N/A Subject", cls, year, sem].filter(Boolean).join(" — ");
};

const buildCourseFullText = (c) => {
  if (!c) return "";
  const subject = c?.majorSubject?.subject?.subject_name || c?.subject_name || "";
  const className = c?.classGroup?.class_name || c?.class_name || "";
  const teacher = c?.teacher?.full_name || c?.teacher_name || "";
  const year = c?.academic_year || "";
  const sem = c?.semester ? `Semester ${c.semester}` : "";
  const primary = c?.display_name || c?.course_name || "";
  const majorName = c?.majorSubject?.major?.major_name || c?.major_name || "";

  return [
    primary,
    subject ? `Subject: ${subject}` : "",
    className ? `Class: ${className}` : "",
    majorName ? `Major: ${majorName}` : "",
    year ? `Year: ${year}` : "",
    sem,
    teacher ? `Teacher: ${teacher}` : "",
  ]
    .filter(Boolean)
    .join(" — ");
};

/* ================== GLASS PRIMITIVES (BIGGER) ================== */
const GlassCard = ({ className = "", children }) => (
  <div
    className={[
      "rounded-3xl border border-white/30 bg-white/55 backdrop-blur-xl",
      "shadow-[0_14px_40px_-22px_rgba(0,0,0,0.50)]",
      "ring-1 ring-black/5",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const GlassPill = ({ className = "", children }) => (
  <span
    className={[
      "inline-flex items-center gap-1 rounded-full border border-white/35 bg-white/55 backdrop-blur-xl",
      "px-3 py-1 text-xs font-black text-gray-800",
      "shadow-[0_8px_22px_-16px_rgba(0,0,0,0.55)]",
      className,
    ].join(" ")}
  >
    {children}
  </span>
);

/* ================== COURSE DETAILS (BIGGER) ================== */
const CourseDetailsCard = ({ course }) => {
  if (!course) return null;
  const full = buildCourseFullText(course);

  return (
    <GlassCard className="mt-3 px-4 py-3">
      <div className="text-xs font-black text-gray-700 uppercase tracking-wide">Selected course</div>
      <div className="mt-1 text-sm font-semibold text-gray-900 break-words whitespace-normal leading-snug">
        {full}
      </div>
    </GlassCard>
  );
};

/* ================== COURSE FILTER INFO BANNER ================== */
const CourseFilterBanner = ({ selectedMajorId, majorName, totalCourses, filteredCourses }) => {
  if (!selectedMajorId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-3"
    >
      <GlassCard className="px-4 py-2">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-gray-700">
            Courses filtered by major:{" "}
            <span className="font-black text-indigo-800">{majorName || selectedMajorId}</span>
          </span>
          <span className="text-gray-500">
            ({filteredCourses} of {totalCourses} courses)
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
};

/* ================== STUDENT TABLE (SERVER MODE + FIX FILTER FLOW) ================== */
const StudentTableSelect = ({
  value = [],
  onChange,
  students = [],
  disabled,
  selectedCourseId,
  isAlreadyEnrolled,
  studentsLoading = false,
  onSearchStudents,
  onLoadMoreStudents,
  hasMoreStudents = false,
  filterSignature = "",
}) => {
  const [q, setQ] = useState("");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) return;
    setQ("");
    if (typeof onSearchStudents === "function") onSearchStudents("");
    onChange([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSignature]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (typeof onSearchStudents !== "function") return;
    const t = setTimeout(() => onSearchStudents(q), 350);
    return () => clearTimeout(t);
  }, [q, onSearchStudents]);

  useEffect(() => {
    const idsInList = new Set((Array.isArray(students) ? students : []).map((s) => String(s?.id ?? "")));
    const next = (Array.isArray(value) ? value : []).filter((sid) => idsInList.has(String(sid)));
    if (next.length !== (value || []).length) onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const canToggle = (sid) => {
    if (!selectedCourseId) return true;
    if (typeof isAlreadyEnrolled !== "function") return true;
    return !isAlreadyEnrolled(sid, selectedCourseId);
  };

  const toggle = (sid) => {
    if (disabled) return;
    if (!canToggle(sid) && !value.includes(sid)) return;
    onChange(value.includes(sid) ? value.filter((x) => x !== sid) : [...value, sid]);
  };

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    const arr = Array.isArray(students) ? students : [];
    if (!t) return arr;
    return arr.filter((s) => {
      const text = `${pickStudentCode(s)} ${pickStudentName(s)} ${pickEmail(s)}`.toLowerCase();
      return text.includes(t);
    });
  }, [q, students]);

  return (
    <motion.div variants={animations.item} className="lg:col-span-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-2xl bg-white/55 border border-white/35 backdrop-blur-xl flex items-center justify-center">
            <Search className="w-5 h-5 text-gray-700" />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search student code / name / email…"
            className={[
              "w-full h-9 px-3 text-sm rounded-2xl",
              "border border-white/35 bg-white/45 backdrop-blur-xl",
              "outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-white/40",
            ].join(" ")}
          />
        </div>

        <GlassPill>
          {studentsLoading ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              Loading
            </>
          ) : (
            value.length
          )}
        </GlassPill>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="max-h-[360px] overflow-y-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-white/55 backdrop-blur-xl">
              <tr className="h-10 text-sm text-gray-700 border-b border-white/20">
                <th className="w-10"></th>
                <th className="w-12"></th>
                <th className="text-left font-black px-3">Code</th>
                <th className="text-left font-black px-3">Name</th>
                <th className="text-left font-black px-3">Email</th>
                <th className="text-center font-black w-20 px-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {studentsLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-700 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                      Loading students…
                    </span>
                  </td>
                </tr>
              )}

              {!studentsLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-600 text-sm">
                    No students
                  </td>
                </tr>
              )}

              {filtered.map((s) => {
                const sid = String(s?.id ?? "");
                const selected = value.includes(sid);
                const already =
                  !!selectedCourseId &&
                  typeof isAlreadyEnrolled === "function" &&
                  isAlreadyEnrolled(sid, selectedCourseId);

                const code = pickStudentCode(s) || "-";
                const name = pickStudentName(s);
                const email = pickEmail(s) || "-";
                const avatar = pickAvatar(s);

                return (
                  <tr
                    key={sid}
                    onClick={() => toggle(sid)}
                    className={[
                      "h-12 border-t border-white/20",
                      disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                      selected ? "bg-white/55" : "hover:bg-white/40",
                      already && !selected ? "opacity-70" : "",
                    ].join(" ")}
                    title={already ? "Already enrolled in selected course" : ""}
                  >
                    <td className="text-center">
                      {selected ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-700" />
                      ) : already ? (
                        <Lock className="w-5 h-5 text-emerald-700" />
                      ) : null}
                    </td>

                    <td className="px-2">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-white/40"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/55 border border-white/35 backdrop-blur-xl flex items-center justify-center text-xs font-black text-gray-800">
                          {String(name).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    <td className="px-3 whitespace-nowrap">{code}</td>
                    <td className="px-3 truncate max-w-[220px]">{name}</td>
                    <td className="px-3 truncate max-w-[240px]">{email}</td>

                    <td className="px-3 text-center">
                      {already ? (
                        <span className="text-xs font-black text-emerald-800">ENR</span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-700">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/20 p-3 flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-700">
            Showing <span className="font-black text-gray-900">{filtered.length}</span>
          </div>

          {hasMoreStudents ? (
            <button
              type="button"
              onClick={onLoadMoreStudents}
              disabled={disabled || studentsLoading}
              className={[
                "h-9 px-4 rounded-2xl text-sm font-black",
                "border border-white/30 bg-white/55 backdrop-blur-xl",
                "shadow-[0_12px_34px_-22px_rgba(0,0,0,0.55)] ring-1 ring-black/5",
                "hover:bg-white/70 transition-all",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              <span className="inline-flex items-center gap-2">
                {studentsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                Load more
              </span>
            </button>
          ) : (
            <span className="text-xs font-bold text-gray-500">No more</span>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

/* ================== SELECT FIELD (BIGGER) ================== */
const SelectField = ({ icon: Icon, placeholder, value, onChange, options = [], disabled, name }) => (
  <motion.div variants={animations.item} className="relative">
    <div className="mb-2 flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-white/55 border border-white/35 backdrop-blur-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-800" />
      </div>
      <label className="text-sm font-black text-gray-900">
        {placeholder} <span className="text-red-500">*</span>
      </label>
    </div>

    <div className="relative">
      <select
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        className={[
          "w-full h-12 rounded-2xl px-4 pr-10 text-sm font-semibold text-gray-900",
          "border border-white/35 bg-white/45 backdrop-blur-xl",
          "outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-white/40",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "appearance-none cursor-pointer",
        ].join(" ")}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => {
          const id = opt?.id ?? opt?.value ?? "";
          const label = opt?.label ?? opt?.name ?? opt?.title ?? String(id || "");
          return (
            <option key={`${name}-${String(id)}-${idx}`} value={String(id)}>
              {label}
            </option>
          );
        })}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70">
        <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 9L1 4h10z" fill="#6b7280" />
        </svg>
      </div>
    </div>
  </motion.div>
);

/* ================== ALERT (BIGGER) ================== */
const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
    className={[
      "relative flex items-center gap-4 rounded-3xl border border-white/30 bg-white/55 backdrop-blur-xl",
      "px-4 py-3 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.50)] ring-1 ring-black/5",
    ].join(" ")}
  >
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/35 bg-white/55 backdrop-blur-xl">
      {type === "success" ? (
        <CheckCircle2 className="w-6 h-6 text-emerald-700" />
      ) : (
        <AlertCircle className="w-6 h-6 text-rose-700" />
      )}
    </div>

    <p className="flex-1 text-sm font-semibold text-gray-900 leading-snug">{message}</p>

    {onClose && (
      <button
        onClick={onClose}
        type="button"
        className="p-2 rounded-xl hover:bg-white/50 border border-transparent hover:border-white/30"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>
    )}
  </motion.div>
);

/* ================== SUBMIT BUTTON (BIGGER) ================== */
const SubmitButton = ({ loading, isEditMode }) => (
  <motion.button
    variants={animations.item}
    whileHover={{ scale: 1.01, y: -1 }}
    whileTap={{ scale: 0.99 }}
    disabled={loading}
    type="submit"
    className={[
      "w-full h-12 rounded-3xl",
      "border border-white/30 bg-white/55 backdrop-blur-xl",
      "text-sm font-black text-gray-900",
      "shadow-[0_16px_44px_-26px_rgba(0,0,0,0.60)] ring-1 ring-black/5",
      "disabled:opacity-60 disabled:cursor-not-allowed",
    ].join(" ")}
  >
    <span className="flex items-center justify-center gap-3">
      {loading ? (
        <>
          <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
          {isEditMode ? "Updating…" : "Saving…"}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5 text-indigo-700" />
          {isEditMode ? "Update Status" : "Enroll Students"}
        </>
      )}
    </span>
  </motion.button>
);

/* ================== HEADER (BIGGER) ================== */
const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between pb-3 border-b border-white/25">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-3xl bg-white/55 border border-white/35 backdrop-blur-xl flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-indigo-700" />
      </div>
      <div className="leading-tight">
        <h2 className="text-base font-black text-gray-900">{isEditMode ? "Update Enrollment" : "Enroll Students"}</h2>
        <p className="text-sm text-gray-700">{isEditMode ? "Change status" : "Server search + bulk enroll"}</p>
      </div>
    </div>

    {isEditMode && (
      <button
        onClick={onCancel}
        type="button"
        className="h-10 px-4 rounded-2xl border border-white/30 bg-white/55 backdrop-blur-xl text-sm font-black text-gray-900"
      >
        Cancel
      </button>
    )}
  </div>
);

/* ================== FORM SECTION ================== */
const FormSection = ({
  isEditMode,
  onCancel,
  onSubmit,
  form,
  setForm,
  loading,

  studentRows,
  selectedCourseId,
  isAlreadyEnrolled,

  studentsLoading,
  onSearchStudents,
  onLoadMoreStudents,
  hasMoreStudents,
  filterSignature,

  courseOptions,
  selectedCourse,
  selectedMajorId,
  selectedMajorName,
  totalCourses,
}) => (
  <motion.div variants={animations.fadeUp} initial="hidden" animate="show" className="relative">
    <GlassCard className="p-5">
      <FormHeader isEditMode={isEditMode} onCancel={onCancel} />

      <motion.form
        onSubmit={onSubmit}
        variants={animations.container}
        initial="hidden"
        animate="show"
        className="space-y-5 mt-5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <StudentTableSelect
            disabled={isEditMode || loading}
            value={form.student_ids}
            onChange={(ids) => setForm((p) => ({ ...p, student_ids: ids }))}
            students={studentRows}
            selectedCourseId={selectedCourseId}
            isAlreadyEnrolled={isAlreadyEnrolled}
            studentsLoading={studentsLoading}
            onSearchStudents={onSearchStudents}
            onLoadMoreStudents={onLoadMoreStudents}
            hasMoreStudents={hasMoreStudents}
            filterSignature={filterSignature}
          />

          <div className="lg:col-span-2 space-y-3">
            {/* ✅ COURSE FILTER INFO BANNER */}
            <AnimatePresence>
              <CourseFilterBanner
                selectedMajorId={selectedMajorId}
                majorName={selectedMajorName}
                totalCourses={totalCourses}
                filteredCourses={courseOptions.length}
              />
            </AnimatePresence>

            <SelectField
              icon={BookOpen}
              placeholder="Select Course"
              value={form.course_id}
              onChange={(v) => setForm((p) => ({ ...p, course_id: v }))}
              options={courseOptions}
              disabled={loading}
              name="course_id"
            />
            <CourseDetailsCard course={selectedCourse} />
          </div>

          <SelectField
            icon={GraduationCap}
            placeholder="Status"
            value={form.status}
            onChange={(v) => setForm((p) => ({ ...p, status: v }))}
            options={STATUS_OPTIONS.map((x) => ({ id: x.id, label: x.name }))}
            disabled={loading}
            name="status"
          />
        </div>

        <SubmitButton loading={loading} isEditMode={isEditMode} />
      </motion.form>
    </GlassCard>
  </motion.div>
);

/* ================== MAIN ================== */
const EnrollmentForm = ({
  onUpdate,
  editingEnrollment,
  onCancel,

  students = [],
  courses = [],

  isAlreadyEnrolled,

  studentsLoading = false,
  onSearchStudents,
  onLoadMoreStudents,
  hasMoreStudents = false,

  filterSignature = "",
}) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingEnrollment;

  const studentRows = useMemo(() => (Array.isArray(students) ? students : []), [students]);

  useEffect(() => {
    if (isEditMode) return;
    setForm((p) => ({ ...p, student_ids: [] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSignature]);

  const selectionError = useMemo(() => {
    if (isEditMode) return null;

    const selectedStudents = (form.student_ids || [])
      .map((id) => studentRows.find((x) => String(x?.id) === String(id)))
      .filter(Boolean);

    if (selectedStudents.length <= 1) return null;

    const deptSet = new Set(selectedStudents.map(getStudentDeptId).filter(Boolean));
    const majorSet = new Set(selectedStudents.map(getStudentMajorId).filter(Boolean));

    if (deptSet.size !== 1) return "Selected students are from different departments.";
    if (majorSet.size !== 1) return "Selected students are from different majors.";
    return null;
  }, [form.student_ids, studentRows, isEditMode]);

  // ✅ GET SELECTED STUDENTS' MAJOR
  const selectedMajorInfo = useMemo(() => {
    if (isEditMode || !form.student_ids || form.student_ids.length === 0) {
      return { majorId: null, majorName: null };
    }

    const selectedStudents = (form.student_ids || [])
      .map((id) => studentRows.find((x) => String(x?.id) === String(id)))
      .filter(Boolean);

    if (selectedStudents.length === 0) return { majorId: null, majorName: null };

    // Get major from first student
    const firstStudent = selectedStudents[0];
    const majorId = getStudentMajorId(firstStudent);
    const majorName = firstStudent?.registration?.major?.major_name || "";

    return { majorId, majorName };
  }, [form.student_ids, studentRows, isEditMode]);

  // ✅ FILTER COURSES BY SELECTED STUDENTS' MAJOR
  const courseOptions = useMemo(() => {
    const all = Array.isArray(courses) ? courses : [];
    const { majorId } = selectedMajorInfo;

    // If no students selected or in edit mode, show all courses
    if (!majorId) {
      return all.map((c) => ({
        id: String(c?.id ?? ""),
        label: getCourseLabelShort(c),
        original: c,
      }));
    }

    // Filter courses by major
    const filtered = all.filter((c) => {
      const courseMajorId = getCourseMajorId(c);
      
      // If course has no major_id, include it (backward compatibility)
      if (!courseMajorId) return true;
      
      // Otherwise, match by major
      return courseMajorId === majorId;
    });

    // ✅ DEBUG: Log if filtering results in no courses
    if (filtered.length === 0) {
      console.warn('No courses found for major:', majorId);
      console.log('Sample course structure:', all[0]);
      console.log('Total courses:', all.length);
    }

    return filtered.map((c) => ({
      id: String(c?.id ?? ""),
      label: getCourseLabelShort(c),
      original: c,
    }));
  }, [courses, selectedMajorInfo]);

  // ✅ CLEAR COURSE SELECTION WHEN MAJOR CHANGES
  useEffect(() => {
    if (isEditMode) return;
    
    const { majorId } = selectedMajorInfo;
    if (!majorId) {
      // No students selected, allow any course
      return;
    }

    // Check if current course belongs to the selected major
    if (form.course_id) {
      const currentCourse = courses.find((c) => String(c?.id) === String(form.course_id));
      if (currentCourse) {
        const courseMajorId = getCourseMajorId(currentCourse);
        if (courseMajorId !== majorId) {
          // Current course doesn't match major, clear it
          setForm((p) => ({ ...p, course_id: "" }));
        }
      }
    }
  }, [selectedMajorInfo, form.course_id, courses, isEditMode]);

  useEffect(() => {
    if (editingEnrollment) {
      setForm({
        student_ids: editingEnrollment.student_id ? [String(editingEnrollment.student_id)] : [],
        course_id: editingEnrollment.course_id ? String(editingEnrollment.course_id) : "",
        status: editingEnrollment.status || "enrolled",
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingEnrollment]);

  const selectedCourse = useMemo(() => {
    const id = String(form.course_id || "");
    return courseOptions.find((c) => String(c.id) === id)?.original || null;
  }, [form.course_id, courseOptions]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    onCancel?.();
  };

  useEffect(() => {
    setForm(INITIAL_FORM_STATE);
  }, [filterSignature]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (selectionError) throw new Error(selectionError);
      if (!form.course_id) throw new Error("Course is required.");
      if (!form.status) throw new Error("Status is required.");

      if (isEditMode) {
        await updateEnrollmentStatus(editingEnrollment.id, { status: String(form.status) });
      } else {
        if (!form.student_ids || form.student_ids.length === 0) throw new Error("Select at least 1 student.");

        const studentIds = (form.student_ids || [])
          .map((x) => Number(x))
          .filter((n) => Number.isFinite(n) && n > 0);

        const toSend = [];
        const skippedLocal = [];

        for (const sid of studentIds) {
          const already =
            typeof isAlreadyEnrolled === "function" &&
            isAlreadyEnrolled(String(sid), String(form.course_id));
          if (already) skippedLocal.push(sid);
          else toSend.push(sid);
        }

        if (toSend.length === 0) {
          throw new Error(`All selected students are already enrolled. (${skippedLocal.length})`);
        }

        await enrollStudent({
          student_ids: toSend,
          course_id: Number(form.course_id),
          status: String(form.status),
        });
      }

      resetForm();
      setSuccess(true);
      onUpdate?.();
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      let errorMessage = "Failed to save enrollment";
      if (err?.response?.data) {
        const data = err.response.data;
        if (data.errors) errorMessage = Object.values(data.errors).flat().join(", ");
        else if (data.message) errorMessage = data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {success && <Alert type="success" message={`Enrollment ${isEditMode ? "updated" : "created"} successfully!`} />}
        {selectionError && <Alert type="error" message={selectionError} onClose={null} />}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      </AnimatePresence>

      <FormSection
        isEditMode={isEditMode}
        onCancel={resetForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        loading={loading}
        studentRows={studentRows}
        selectedCourseId={form.course_id}
        isAlreadyEnrolled={isAlreadyEnrolled}
        studentsLoading={studentsLoading}
        onSearchStudents={onSearchStudents}
        onLoadMoreStudents={onLoadMoreStudents}
        hasMoreStudents={hasMoreStudents}
        filterSignature={filterSignature}
        courseOptions={courseOptions}
        selectedCourse={selectedCourse}
        selectedMajorId={selectedMajorInfo.majorId}
        selectedMajorName={selectedMajorInfo.majorName}
        totalCourses={Array.isArray(courses) ? courses.length : 0}
      />
    </div>
  );
};

export default EnrollmentForm;