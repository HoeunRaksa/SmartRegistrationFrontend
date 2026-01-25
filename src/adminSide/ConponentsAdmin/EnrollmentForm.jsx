/* ========================= EnrollmentForm.jsx (FULL) ========================= */
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { enrollStudent, updateEnrollmentStatus } from "../../api/admin_course_api.jsx";
import {
  BookOpen,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  GraduationCap,
  Search,
  Mail,
  Phone,
  MapPin,
  Lock,
  Hash,
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
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  },
  item: {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
  },
};

/* ================== SAFE LABEL HELPERS ================== */
const safeStr = (v) => (v === null || v === undefined ? "" : String(v));

const getStudentLabel = (s) => {
  const code = safeStr(s?.student_code);
  const name =
    safeStr(s?.student_name) ||
    safeStr(s?.full_name_en) ||
    safeStr(s?.full_name_kh) ||
    safeStr(s?.student_name_kh) ||
    safeStr(s?.name) ||
    safeStr(s?.full_name);

  if (code && name) return `${code} — ${name}`;
  if (name) return name;
  if (code) return code;
  return `Student #${s?.id ?? "-"}`;
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
  return [subj || "N/A Subject", cls, year, sem].filter(Boolean).join(" — ");
};

/* ================== MAJOR/DEPT HELPERS ================== */
const getStudentDeptId = (st) =>
  safeStr(st?.department_id ?? st?.registration?.department_id ?? st?.department?.id ?? "");

const getStudentMajorId = (st) =>
  safeStr(st?.major_id ?? st?.registration?.major_id ?? st?.major?.id ?? "");

const getCourseMajorId = (c) => safeStr(c?.majorSubject?.major?.id ?? c?.major_id ?? "");
const getCourseDeptId = (c) => safeStr(c?.majorSubject?.major?.department_id ?? c?.department_id ?? "");

/* ================== COURSE FULL DISPLAY (NO CUT) ================== */
const buildCourseFullText = (c) => {
  if (!c) return "";
  const subject =
    c?.majorSubject?.subject?.subject_name || c?.subject_name || "";
  const className =
    c?.classGroup?.class_name || c?.class_name || "";
  const teacher =
    c?.teacher?.full_name || c?.teacher_name || "";
  const year = c?.academic_year || "";
  const sem = c?.semester ? `Semester ${c.semester}` : "";

  const primary = c?.display_name || c?.course_name || "";
  const parts = [
    primary,
    subject ? `Subject: ${subject}` : "",
    className ? `Class: ${className}` : "",
    year ? `Year: ${year}` : "",
    sem ? sem : "",
    teacher ? `Teacher: ${teacher}` : "",
  ].filter(Boolean);

  return parts.join(" — ");
};

const CourseDetailsCard = ({ course }) => {
  if (!course) return null;

  const subject = course?.majorSubject?.subject?.subject_name || course?.subject_name || "N/A";
  const className = course?.classGroup?.class_name || course?.class_name || "N/A";
  const teacher = course?.teacher?.full_name || course?.teacher_name || "N/A";
  const year = course?.academic_year || "N/A";
  const sem = course?.semester ? `Semester ${course.semester}` : "N/A";

  const full = buildCourseFullText(course);

  return (
    <div className="mt-3 rounded-2xl border-2 border-white/60 bg-white/80 p-4 shadow-lg">
      <div className="text-xs font-black text-gray-700 uppercase tracking-wide mb-1">
        Selected course (full, no cut)
      </div>
      <div className="text-sm font-bold text-gray-900 break-words whitespace-normal">
        {full}
      </div>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        <div className="font-semibold text-gray-700 break-words whitespace-normal">Subject: {subject}</div>
        <div className="font-semibold text-gray-700 break-words whitespace-normal">Class: {className}</div>
        <div className="font-semibold text-gray-700 break-words whitespace-normal">Academic year: {year}</div>
        <div className="font-semibold text-gray-700 break-words whitespace-normal">Teacher: {teacher}</div>
        <div className="font-semibold text-gray-700 break-words whitespace-normal">Semester: {sem}</div>
      </div>
    </div>
  );
};

const EnrollmentForm = ({
  onUpdate,
  editingEnrollment,
  onCancel,
  students = [],
  courses = [],
  isAlreadyEnrolled, // function(studentId, courseId) => boolean
}) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingEnrollment;

  const studentOptions = useMemo(() => {
    const arr = Array.isArray(students) ? students : [];
    return arr.map((s) => ({
      id: String(s?.id ?? ""),
      label: getStudentLabel(s),
      original: s,
    }));
  }, [students]);

  /* ================== SELECTION VALIDATION ================== */
  const selectionError = useMemo(() => {
    if (isEditMode) return null;

    const selectedStudents = (form.student_ids || [])
      .map((id) => studentOptions.find((x) => String(x.id) === String(id))?.original)
      .filter(Boolean);

    if (selectedStudents.length <= 1) return null;

    const deptSet = new Set(selectedStudents.map(getStudentDeptId).filter(Boolean));
    const majorSet = new Set(selectedStudents.map(getStudentMajorId).filter(Boolean));

    if (deptSet.size !== 1) return "Selected students are from different departments. Please select same department students.";
    if (majorSet.size !== 1) return "Selected students are from different majors. Please select same major students.";
    return null;
  }, [form.student_ids, studentOptions, isEditMode]);

  /* ================== FILTER COURSE OPTIONS ================== */
  const courseOptions = useMemo(() => {
    const allCourses = Array.isArray(courses) ? courses : [];

    if (isEditMode) {
      return allCourses.map((c) => ({
        id: String(c?.id ?? ""),
        label: getCourseLabelShort(c),
        original: c,
      }));
    }

    const selectedStudents = (form.student_ids || [])
      .map((id) => studentOptions.find((x) => String(x.id) === String(id))?.original)
      .filter(Boolean);

    if (selectedStudents.length === 0) {
      return allCourses.map((c) => ({
        id: String(c?.id ?? ""),
        label: getCourseLabelShort(c),
        original: c,
      }));
    }

    const deptSet = new Set(selectedStudents.map(getStudentDeptId).filter(Boolean));
    const majorSet = new Set(selectedStudents.map(getStudentMajorId).filter(Boolean));

    if (deptSet.size !== 1 || majorSet.size !== 1) return [];

    const deptId = [...deptSet][0];
    const majorId = [...majorSet][0];

    const filtered = allCourses.filter((c) => {
      const cMajor = getCourseMajorId(c);
      const cDept = getCourseDeptId(c);
      if (!cMajor || !cDept) return false;
      return String(cMajor) === String(majorId) && String(cDept) === String(deptId);
    });

    return filtered.map((c) => ({
      id: String(c?.id ?? ""),
      label: getCourseLabelShort(c),
      original: c,
    }));
  }, [courses, isEditMode, form.student_ids, studentOptions]);

  useEffect(() => {
    if (isEditMode) return;
    if (!form.course_id) return;

    const stillValid = courseOptions.some((c) => String(c.id) === String(form.course_id));
    if (!stillValid) {
      setForm((p) => ({ ...p, course_id: "" }));
    }
  }, [courseOptions, form.course_id, isEditMode]);

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
        if (!form.student_ids || form.student_ids.length === 0) {
          throw new Error("Select at least 1 student.");
        }

        const courseIdNum = Number(form.course_id);
        const statusStr = String(form.status);

        const skipped = [];
        for (const sid of form.student_ids) {
          const already =
            typeof isAlreadyEnrolled === "function" &&
            isAlreadyEnrolled(sid, form.course_id);

          if (already) {
            skipped.push(sid);
            continue;
          }

          await enrollStudent({
            student_id: Number(sid),
            course_id: courseIdNum,
            status: statusStr,
          });
        }

        if (skipped.length) {
          throw new Error(`Skipped ${skipped.length} student(s): already enrolled in this course.`);
        }
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
    <div className="space-y-5">
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
        studentOptions={studentOptions}
        courseOptions={courseOptions}
        selectedCourse={selectedCourse}
        isAlreadyEnrolled={isAlreadyEnrolled}
      />
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */
const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -16, scale: 0.92 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
    className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 shadow-xl backdrop-blur-xl ${
      type === "success"
        ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-emerald-50/90 border-emerald-300/50"
        : "bg-gradient-to-r from-rose-50/90 via-red-50/90 to-rose-50/90 border-red-300/50"
    }`}
  >
    <div
      className={`p-2.5 rounded-xl shadow-md ${
        type === "success"
          ? "bg-gradient-to-br from-emerald-500 to-teal-600"
          : "bg-gradient-to-br from-red-500 to-rose-600"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
    </div>

    <p className={`flex-1 text-sm font-bold ${type === "success" ? "text-emerald-900" : "text-red-900"}`}>{message}</p>

    {onClose && (
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className={`p-1.5 rounded-lg transition-all shadow-sm ${
          type === "success" ? "hover:bg-emerald-200/70 text-emerald-700" : "hover:bg-red-200/70 text-red-700"
        }`}
        type="button"
      >
        <X className="w-4 h-4" />
      </motion.button>
    )}
  </motion.div>
);

const FormSection = ({
  isEditMode,
  onCancel,
  onSubmit,
  form,
  setForm,
  loading,
  studentOptions,
  courseOptions,
  selectedCourse,
  isAlreadyEnrolled,
}) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-blue-50/30 to-purple-50/30 backdrop-blur-2xl border-2 border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-8"
  >
    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-pink-400/15 via-orange-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/10 to-purple-200/10 rounded-full blur-3xl" />

    <div className="relative z-10">
      <FormHeader isEditMode={isEditMode} onCancel={onCancel} />

      <motion.form onSubmit={onSubmit} variants={animations.container} initial="hidden" animate="show" className="space-y-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MultiStudentSelect
            disabled={isEditMode}
            value={form.student_ids}
            onChange={(ids) => setForm((p) => ({ ...p, student_ids: ids }))}
            options={studentOptions}
            selectedCourseId={form.course_id}
            isAlreadyEnrolled={isAlreadyEnrolled}
          />

          <div className="lg:col-span-2">
            <SelectField
              icon={BookOpen}
              placeholder="Select Course"
              value={form.course_id}
              onChange={(v) => setForm((p) => ({ ...p, course_id: v }))}
              options={courseOptions}
              disabled={!isEditMode && (form.student_ids?.length ?? 0) === 0}
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
            disabled={false}
            name="status"
          />
        </div>

        <SubmitButton loading={loading} isEditMode={isEditMode} />
      </motion.form>
    </div>
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between pb-6 border-b-2 border-white/40">
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={{ rotate: 360, scale: 1.05 }}
        transition={{ duration: 0.6 }}
        className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl shadow-indigo-500/40"
      >
        <Sparkles className="w-7 h-7 text-white" />
      </motion.div>
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          {isEditMode ? "Update Enrollment" : "Enroll Students"}
        </h2>
        <p className="text-sm font-medium text-gray-600 mt-1">
          {isEditMode ? "Modify enrollment status for selected student" : "Add multiple students to a course in one go"}
        </p>
      </div>
    </div>

    {isEditMode && (
      <motion.button
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        type="button"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold transition-all duration-200 border-2 border-white/60 hover:border-red-300 shadow-lg hover:shadow-xl"
      >
        <X className="w-4.5 h-4.5" />
        Cancel
      </motion.button>
    )}
  </div>
);

/* ================== MULTI STUDENT SELECT ================== */
const MultiStudentSelect = ({ value = [], onChange, options = [], disabled, selectedCourseId, isAlreadyEnrolled }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((opt) => {
    const label = (opt.label || opt.name || "").toLowerCase();
    return label.includes(searchTerm.toLowerCase());
  });

  const canToggle = (studentId) => {
    if (!selectedCourseId) return true;
    if (typeof isAlreadyEnrolled !== "function") return true;
    return !isAlreadyEnrolled(studentId, selectedCourseId);
  };

  const toggleStudent = (studentId) => {
    if (disabled) return;

    // block selecting already-enrolled students for chosen course
    if (!canToggle(studentId) && !value.includes(studentId)) return;

    const newValue = value.includes(studentId)
      ? value.filter((id) => id !== studentId)
      : [...value, studentId];

    onChange(newValue);
  };

  const selectAll = () => {
    if (disabled) return;

    const allowed = filteredOptions
      .map((opt) => String(opt.id))
      .filter((sid) => canToggle(sid));

    onChange(allowed);
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <motion.div variants={animations.item} className="relative lg:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <User className="w-4.5 h-4.5 text-white" />
          </div>
          <label className="text-sm font-black text-gray-900">
            Students {!disabled && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>

        <div className="flex items-center gap-2">
          {!disabled && (
            <>
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={selectAll}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-all"
              >
                Select Allowed
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={clearAll}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold shadow-lg shadow-gray-500/30 transition-all"
              >
                Clear All
              </motion.button>
            </>
          )}

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black shadow-lg"
          >
            {value.length} selected
          </motion.div>
        </div>
      </div>

      {!disabled && (
        <div className="mb-4 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
            <Search className="w-4 h-4 text-blue-700" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, email, phone..."
            className="w-full pl-14 pr-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-xl text-sm font-medium text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md placeholder:text-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="border-2 border-white/60 rounded-2xl bg-white/70 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          {filteredOptions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-600">No students found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-white/60">
              {filteredOptions.map((opt) => {
                const studentData = opt.original || opt;
                const sid = String(opt.id);
                const isSelected = value.includes(sid);

                const name = studentData.student_name || studentData.full_name_en || studentData.name || "Unknown";
                const nameKh = studentData.student_name_kh || studentData.full_name_kh || "";
                const email = studentData.student_email || studentData.email || studentData.personal_email || "";
                const phone = studentData.student_phone || studentData.phone_number || studentData.phone || "";
                const address = studentData.student_address || studentData.address || "";
                const image = studentData.profile_picture_url || "";
                const code = studentData.student_code || "";

                const already =
                  !!selectedCourseId &&
                  typeof isAlreadyEnrolled === "function" &&
                  isAlreadyEnrolled(sid, selectedCourseId);

                return (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: isSelected ? "rgb(219 234 254)" : "rgb(239 246 255)" }}
                    className={`p-5 transition-all duration-200 ${
                      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    } ${isSelected ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm" : "hover:shadow-sm"} ${
                      already && !isSelected ? "opacity-70" : ""
                    }`}
                    onClick={() => !disabled && toggleStudent(sid)}
                    title={already ? "Already enrolled in selected course" : ""}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <motion.div
                          whileHover={{ scale: disabled ? 1 : 1.1 }}
                          whileTap={{ scale: disabled ? 1 : 0.9 }}
                          className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm ${
                            isSelected
                              ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-600 shadow-lg shadow-blue-500/30"
                              : already
                              ? "border-emerald-300 bg-emerald-50"
                              : "border-gray-300 bg-white hover:border-blue-400"
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : already ? (
                            <Lock className="w-4 h-4 text-emerald-700" />
                          ) : null}
                        </motion.div>
                      </div>

                      <div className="flex-shrink-0">
                        {image ? (
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={image}
                            alt={name}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                            onError={(e) => {
                              e.target.style.display = "none";
                              if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg ${
                            image ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-2xl font-black text-white">{String(name).charAt(0).toUpperCase()}</span>
                        </motion.div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-gray-900 mb-0.5 break-words whitespace-normal">{name}</h4>
                            {nameKh && <p className="text-xs font-medium text-gray-600 break-words whitespace-normal">{nameKh}</p>}
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {code && (
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black shadow-md"
                              >
                                {code}
                              </motion.span>
                            )}

                            {selectedCourseId && (
                              <span
                                className={`px-3 py-1 rounded-xl text-xs font-black border-2 ${
                                  already
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {already ? "Already enrolled" : "Not enrolled"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                          {email && (
                            <div className="flex items-center gap-2 text-xs text-gray-700 min-w-0">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 shadow-sm">
                                <Mail className="w-3.5 h-3.5 text-blue-700" />
                              </div>
                              <span className="truncate font-medium">{email}</span>
                            </div>
                          )}

                          {phone && (
                            <div className="flex items-center gap-2 text-xs text-gray-700 min-w-0">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex-shrink-0 shadow-sm">
                                <Phone className="w-3.5 h-3.5 text-green-700" />
                              </div>
                              <span className="font-medium break-words whitespace-normal">{phone}</span>
                            </div>
                          )}

                          {address && (
                            <div className="flex items-center gap-2 text-xs text-gray-700 min-w-0">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex-shrink-0 shadow-sm">
                                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                              </div>
                              <span className="truncate font-medium">{address}</span>
                            </div>
                          )}
                        </div>

                        {opt?.original?.enroll_count !== undefined && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/80 border-2 border-white/60 text-xs font-bold text-gray-700 shadow-sm">
                            <Hash className="w-4 h-4 text-gray-500" />
                            Total enrollments: {Number(opt.original.enroll_count || 0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {filteredOptions.length > 0 && (
        <div className="mt-3 text-xs font-semibold text-gray-600 text-center">
          Showing {filteredOptions.length} student{filteredOptions.length !== 1 ? "s" : ""}
        </div>
      )}
    </motion.div>
  );
};

const SelectField = ({ icon: Icon, placeholder, value, onChange, options = [], disabled, name }) => (
  <motion.div variants={animations.item} className="relative">
    <div className="mb-3 flex items-center gap-2.5">
      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <label className="text-sm font-black text-gray-900">
        {placeholder} <span className="text-red-500 ml-1">*</span>
      </label>
    </div>

    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      disabled={disabled}
      className="w-full rounded-2xl bg-white/80 backdrop-blur-xl px-5 py-3.5 text-sm font-semibold text-gray-900 border-2 border-white/60 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl appearance-none cursor-pointer"
      style={{
        backgroundImage:
          `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1.25rem center",
        paddingRight: "3.5rem",
      }}
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
  </motion.div>
);

const SubmitButton = ({ loading, isEditMode }) => (
  <motion.button
    variants={animations.item}
    whileHover={{ scale: 1.02, y: -3 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    type="submit"
    className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-4.5 text-base font-black text-white shadow-2xl shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all border-2 border-white/20 hover:shadow-purple-500/50"
  >
    {!loading && (
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
    )}

    <span className="relative z-10 flex items-center justify-center gap-3">
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
          />
          <span className="tracking-wide">{isEditMode ? "Updating..." : "Saving..."}</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-6 h-6" />
          <span className="tracking-wide">{isEditMode ? "Update Status" : "Enroll Students"}</span>
        </>
      )}
    </span>
  </motion.button>
);

export default EnrollmentForm;
