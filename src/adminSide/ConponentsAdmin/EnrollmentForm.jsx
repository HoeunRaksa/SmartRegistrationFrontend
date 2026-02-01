import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { enrollStudent, updateEnrollmentStatus } from "../../api/admin_course_api.jsx";
import {
  BookOpen,
  X,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Search,
  Lock,
  RefreshCw,
  ChevronDown,
  Filter,
  Users,
  Mail,
  Hash,
  User,
  Info,
  Zap,
  AlertCircle
} from "lucide-react";
import Alert from "../../gobalConponent/Alert.jsx";

/* ================== CONSTANTS ================== */
const INITIAL_FORM_STATE = {
  student_ids: [],
  course_id: "",
  status: "enrolled",
};

const STATUS_OPTIONS = [
  { id: "enrolled", name: "Enrolled", icon: CheckCircle2, color: "emerald" },
  { id: "dropped", name: "Dropped", icon: X, color: "rose" },
  { id: "completed", name: "Completed", icon: GraduationCap, color: "blue" },
];

/* ================== ANIMATION VARIANTS ================== */
const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 20 } },
  },
  scaleIn: {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
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
  return safeStr(
    c?.major_id ??
    c?.majorSubject?.major_id ??
    c?.majorSubject?.major?.id ??
    c?.classGroup?.major_id ??
    ""
  );
};

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
  return [subj || "Course", cls, year, sem].filter(Boolean).join(" • ");
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
    subject ? `📚 ${subject}` : "",
    className ? `🏫 ${className}` : "",
    majorName ? `🎓 ${majorName}` : "",
    year ? `📅 ${year}` : "",
    sem,
    teacher ? `👨‍🏫 ${teacher}` : "",
  ]
    .filter(Boolean)
    .join(" • ");
};

/* ================== GLASS PRIMITIVES ================== */
const GlassCard = ({ className = "", children }) => (
  <div
    className={[
      "relative overflow-hidden rounded-3xl",
      "border-2 border-white/40 bg-white/70 backdrop-blur-2xl",
      "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]",
      className,
    ].join(" ")}
  >
    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
    <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-3xl -ml-24 -mb-24" />
    <div className="relative">{children}</div>
  </div>
);

const GlassPill = ({ className = "", children, variant = "default" }) => {
  const variants = {
    default: "bg-white/60 border-white/40 text-gray-800",
    primary: "bg-blue-100/60 border-blue-200/40 text-blue-800",
    success: "bg-emerald-100/60 border-emerald-200/40 text-emerald-800",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border-2 backdrop-blur-xl",
        "px-3 py-1.5 text-xs font-black",
        "shadow-lg",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
};

/* ================== COURSE DETAILS CARD ================== */
const CourseDetailsCard = ({ course }) => {
  if (!course) return null;
  const full = buildCourseFullText(course);

  return (
    <motion.div variants={animations.scaleIn} initial="hidden" animate="show">
      <GlassCard className="p-5">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-1">Selected Course</p>
            <p className="text-sm font-bold text-gray-900 leading-relaxed break-words">{full}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

/* ================== COURSE FILTER BANNER ================== */
const CourseFilterBanner = ({ selectedMajorId, majorName, totalCourses, filteredCourses }) => {
  if (!selectedMajorId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -10 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-600 mb-0.5">Courses Filtered by Major</p>
            <p className="text-sm font-black text-indigo-900">{majorName || selectedMajorId}</p>
          </div>
          <GlassPill variant="primary">
            <Zap className="w-3 h-3" />
            {filteredCourses} / {totalCourses}
          </GlassPill>
        </div>
      </div>
    </motion.div>
  );
};

/* ================== STUDENT TABLE ================== */
const StudentTableSelect = ({
  value = [],
  onChange,
  students = [],
  disabled,
  isEditMode,
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
    if (isEditMode) return;
    setQ("");
    if (typeof onSearchStudents === "function") onSearchStudents("");
    onChange([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSignature, isEditMode]);

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
    if (isEditMode) return;
    const idsInList = new Set((Array.isArray(students) ? students : []).map((s) => String(s?.id ?? "")));
    const next = (Array.isArray(value) ? value : []).filter((sid) => idsInList.has(String(sid)));
    if (next.length !== (value || []).length) onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, isEditMode]);

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

    // Deduplicate students by ID to ensure no same student appears twice
    const uniqueMap = new Map();
    arr.forEach(s => {
      if (s?.id) uniqueMap.set(String(s.id), s);
    });
    const uniqueArr = Array.from(uniqueMap.values());

    if (!t) return uniqueArr;
    return uniqueArr.filter((s) => {
      const text = `${pickStudentCode(s)} ${pickStudentName(s)} ${pickEmail(s)}`.toLowerCase();
      return text.includes(t);
    });
  }, [q, students]);

  return (
    <motion.div variants={animations.item} className="lg:col-span-2">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900">Select Students</h3>
            <p className="text-xs font-semibold text-gray-600">Click to select multiple students</p>
          </div>
        </div>

        <GlassPill variant={value.length > 0 ? "success" : "default"}>
          {studentsLoading ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              Loading
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {value.length} Selected
            </>
          )}
        </GlassPill>
      </div>

      {/* Search */}
      <div className="mb-3 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
          <Search className="w-4 h-4 text-blue-700" />
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search student code / name / email…"
          className={[
            "w-full pl-14 pr-4 py-3.5 rounded-2xl text-sm font-medium",
            "border-2 border-white/60 bg-white/80 backdrop-blur-xl",
            "outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500",
            "transition-all shadow-sm hover:shadow-md placeholder:text-gray-500",
          ].join(" ")}
        />
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-xl z-10">
              <tr className="border-b-2 border-white/60">
                <th className="w-12 py-3"></th>
                <th className="w-14 py-3"></th>
                <th className="text-left font-black text-xs text-gray-700 uppercase tracking-wide px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    Code
                  </div>
                </th>
                <th className="text-left font-black text-xs text-gray-700 uppercase tracking-wide px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Name
                  </div>
                </th>
                <th className="text-left font-black text-xs text-gray-700 uppercase tracking-wide px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </div>
                </th>
                <th className="text-center font-black text-xs text-gray-700 uppercase tracking-wide w-20 px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/60">
              {studentsLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                      <p className="text-sm font-bold text-gray-600">Loading students…</p>
                    </div>
                  </td>
                </tr>
              )}

              {!studentsLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">No students found</p>
                      <p className="text-xs text-gray-600">Try adjusting your search or filters</p>
                    </div>
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
                  <motion.tr
                    key={sid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => toggle(sid)}
                    className={[
                      "h-16 transition-all",
                      disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                      selected ? "bg-blue-50/60" : "hover:bg-white/60",
                      already && !selected ? "opacity-70" : "",
                    ].join(" ")}
                    title={already ? "Already enrolled in selected course" : "Click to select"}
                  >
                    <td className="text-center">
                      {selected ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </motion.div>
                      ) : already ? (
                        <Lock className="w-5 h-5 text-amber-600" />
                      ) : null}
                    </td>

                    <td className="px-2">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt=""
                          className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center shadow-sm">
                          <span className="text-sm font-black text-white">
                            {String(name).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-4">
                      <span className="text-sm font-bold text-gray-900">{code}</span>
                    </td>
                    <td className="px-4">
                      <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px] block">{name}</span>
                    </td>
                    <td className="px-4">
                      <span className="text-sm font-medium text-gray-600 truncate max-w-[220px] block">{email}</span>
                    </td>

                    <td className="px-4 text-center">
                      {already ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span className="text-xs font-black text-amber-800">Enrolled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span className="text-xs font-black text-emerald-800">Available</span>
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-white/60 bg-white/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-bold text-gray-700">
              Showing <span className="text-gray-900">{filtered.length}</span> students
            </span>
          </div>

          {hasMoreStudents ? (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onLoadMoreStudents}
              disabled={disabled || studentsLoading}
              className={[
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm",
                "bg-white/80 border-2 border-white/60 hover:border-blue-300",
                "shadow-lg hover:shadow-xl transition-all",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {studentsLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Load More
            </motion.button>
          ) : (
            <span className="text-xs font-bold text-gray-500">No more students</span>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

/* ================== SELECT FIELD ================== */
const SelectField = ({ icon: Icon, placeholder, value, onChange, options = [], disabled, name, gradient = "from-blue-500 to-purple-600" }) => (
  <motion.div variants={animations.item}>
    <div className="mb-3 flex items-center gap-3">
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <label className="text-base font-black text-gray-900">
        {placeholder} <span className="text-rose-500">*</span>
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
          "w-full h-14 rounded-2xl px-5 pr-12 text-sm font-semibold text-gray-900",
          "border-2 border-white/60 bg-white/80 backdrop-blur-xl",
          "outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "appearance-none cursor-pointer transition-all shadow-sm hover:shadow-md",
        ].join(" ")}
      >
        <option value="">Select {placeholder}</option>
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

      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  </motion.div>
);

/* ================== ALERT ================== */


/* ================== SUBMIT BUTTON ================== */
const SubmitButton = ({ loading, isEditMode }) => (
  <motion.button
    variants={animations.item}
    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
    whileTap={{ scale: loading ? 1 : 0.98 }}
    disabled={loading}
    type="submit"
    className={[
      "w-full h-14 rounded-2xl font-black text-base",
      "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
      "text-white shadow-xl shadow-blue-500/30",
      "hover:shadow-2xl hover:shadow-blue-500/40",
      "disabled:opacity-60 disabled:cursor-not-allowed",
      "transition-all duration-300",
    ].join(" ")}
  >
    <span className="flex items-center justify-center gap-3">
      {loading ? (
        <>
          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          {isEditMode ? "Updating…" : "Processing…"}
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          {isEditMode ? "Update Enrollment" : "Enroll Students"}
        </>
      )}
    </span>
  </motion.button>
);

/* ================== HEADER ================== */
const FormHeader = ({ isEditMode, onCancel, editingEnrollment }) => (
  <div className="flex items-center justify-between pb-5 border-b-2 border-white/60">
    <div className="flex items-center gap-4">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl">
        <Sparkles className="w-7 h-7 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-black text-gray-900">{isEditMode ? "Update Enrollment" : "Enroll Students"}</h2>
        <p className="text-sm font-semibold text-gray-600 mt-0.5">
          {isEditMode ? `Updating enrollment for ${editingEnrollment?.student_name || 'Student'}` : "Select students and course to enroll"}
        </p>
      </div>
    </div>

    {isEditMode && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        type="button"
        className="px-4 py-2.5 rounded-xl border-2 border-white/60 bg-white/80 backdrop-blur-xl text-sm font-bold text-gray-900 hover:border-red-300 transition-all shadow-lg"
      >
        Cancel
      </motion.button>
    )}
  </div>
);

/* ================== INFO BOX ================== */
const InfoBox = ({ message }) => (
  <motion.div variants={animations.scaleIn} initial="hidden" animate="show">
    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/60 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
          <Info className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm font-semibold text-gray-700 leading-relaxed">{message}</p>
      </div>
    </div>
  </motion.div>
);

/* ================== FORM SECTION ================== */
const FormSection = ({
  isEditMode,
  editingEnrollment,
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
  <motion.div variants={animations.fadeUp} initial="hidden" animate="show">
    <GlassCard className="p-6">
      <FormHeader isEditMode={isEditMode} onCancel={onCancel} editingEnrollment={editingEnrollment} />

      <motion.form
        onSubmit={onSubmit}
        variants={animations.container}
        initial="hidden"
        animate="show"
        className="space-y-6 mt-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentTableSelect
            isEditMode={isEditMode}
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

          <div className="lg:col-span-2 space-y-4">
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
              placeholder="Course"
              value={form.course_id}
              onChange={(v) => setForm((p) => ({ ...p, course_id: v }))}
              options={courseOptions}
              disabled={isEditMode || loading}
              name="course_id"
              gradient="from-blue-500 to-indigo-600"
            />

            {selectedCourse && <CourseDetailsCard course={selectedCourse} />}

            {!isEditMode && form.student_ids.length > 0 && (
              <InfoBox
                message={`You have selected ${form.student_ids.length} student${form.student_ids.length > 1 ? "s" : ""
                  }. All selected students must be from the same major to enroll in a course.`}
              />
            )}
          </div>

          <SelectField
            icon={GraduationCap}
            placeholder="Status"
            value={form.status}
            onChange={(v) => setForm((p) => ({ ...p, status: v }))}
            options={STATUS_OPTIONS.map((x) => ({ id: x.id, label: x.name }))}
            disabled={loading}
            name="status"
            gradient="from-emerald-500 to-teal-600"
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

  const selectionError = useMemo(() => {
    if (isEditMode) return null;

    const selectedStudents = (form.student_ids || [])
      .map((id) => studentRows.find((x) => String(x?.id) === String(id)))
      .filter(Boolean);

    if (selectedStudents.length <= 1) return null;

    const deptSet = new Set(selectedStudents.map(getStudentDeptId).filter(Boolean));
    const majorSet = new Set(selectedStudents.map(getStudentMajorId).filter(Boolean));

    if (deptSet.size !== 1) return "⚠️ Selected students are from different departments. Please select students from the same department.";
    if (majorSet.size !== 1) return "⚠️ Selected students are from different majors. Please select students from the same major.";
    return null;
  }, [form.student_ids, studentRows, isEditMode]);

  const selectedMajorInfo = useMemo(() => {
    if (isEditMode || !form.student_ids || form.student_ids.length === 0) {
      return { majorId: null, majorName: null };
    }

    const selectedStudents = (form.student_ids || [])
      .map((id) => studentRows.find((x) => String(x?.id) === String(id)))
      .filter(Boolean);

    if (selectedStudents.length === 0) return { majorId: null, majorName: null };

    const firstStudent = selectedStudents[0];
    const majorId = getStudentMajorId(firstStudent);
    const majorName = firstStudent?.registration?.major?.major_name || "";

    return { majorId, majorName };
  }, [form.student_ids, studentRows, isEditMode]);

  const courseOptions = useMemo(() => {
    const all = Array.isArray(courses) ? courses : [];
    const { majorId } = selectedMajorInfo;

    let filtered = all;
    if (majorId) {
      filtered = all.filter((c) => {
        const courseMajorId = getCourseMajorId(c);
        // Direct major match OR general course (no major)
        return courseMajorId === majorId || !courseMajorId;
      });

      // Fallback: if even after filtering we have NOTHING, show all so user isn't stuck
      if (filtered.length === 0) {
        filtered = all;
      }
    }

    return filtered.map((c) => ({
      id: String(c?.id ?? ""),
      label: getCourseLabelShort(c),
      original: c,
    }));
  }, [courses, selectedMajorInfo.majorId]);

  useEffect(() => {
    if (isEditMode) return;

    const { majorId } = selectedMajorInfo;
    // Only enforce major matching if BOTH a student major is identified AND a course is selected
    if (!majorId || !form.course_id) return;

    const currentCourse = courses.find((c) => String(c?.id) === String(form.course_id));
    if (currentCourse) {
      const courseMajorId = getCourseMajorId(currentCourse);

      // Enforce ONLY if the course is explicitly tied to a major
      // If courseMajorId is empty, it's considered a general course and allowed for any major
      if (courseMajorId && courseMajorId !== majorId) {
        setForm((p) => ({ ...p, course_id: "" }));
      }
    }
  }, [selectedMajorInfo.majorId, form.course_id, courses, isEditMode]);

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
    if (!isEditMode) {
      setForm(INITIAL_FORM_STATE);
    }
  }, [filterSignature, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (selectionError) throw new Error(selectionError);
      if (!form.course_id) throw new Error("Please select a course.");
      if (!form.status) throw new Error("Please select a status.");

      if (isEditMode) {
        const enrollmentId =
          editingEnrollment?.id ??
          editingEnrollment?.enrollment_id ??
          editingEnrollment?.course_enrollment_id ??
          null;

        if (!enrollmentId) {
          throw new Error("Enrollment ID is missing. Please refresh and try again.");
        }

        await updateEnrollmentStatus(enrollmentId, {
          status: String(form.status),
          student_id: editingEnrollment?.student_id,
          course_id: editingEnrollment?.course_id,
        });
      } else {
        if (!form.student_ids || form.student_ids.length === 0) throw new Error("Please select at least one student.");

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
          throw new Error(`All ${skippedLocal.length} selected student${skippedLocal.length > 1 ? 's are' : ' is'} already enrolled in this course.`);
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
      setTimeout(() => setSuccess(false), 3000);
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
    <div className="space-y-4">

      <Alert
        isOpen={success}
        type="success"
        message={`🎉 Enrollment ${isEditMode ? "updated" : "created"} successfully!`}
        onClose={() => setSuccess(false)}
      />
      <Alert
        isOpen={!!selectionError}
        type="error"
        message={selectionError}
        onClose={() => { }} // selectionError is computed, maybe just empty onClose
      />
      <Alert
        isOpen={!!error}
        type="error"
        message={error}
        onClose={() => setError(null)}
      />

      <FormSection
        isEditMode={isEditMode}
        editingEnrollment={editingEnrollment}
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
