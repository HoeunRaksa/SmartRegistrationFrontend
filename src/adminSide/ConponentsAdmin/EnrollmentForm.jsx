/* ========================= EnrollmentForm.jsx ========================= */
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { enrollStudent, updateEnrollmentStatus } from "../../api/admin_course_api.jsx";
import { BookOpen, X, CheckCircle2, AlertCircle, Sparkles, User, GraduationCap, Search } from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  student_ids: [], // ✅ multi select
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

const getCourseLabel = (c) => {
  const courseName = safeStr(c?.course_name);
  const display = safeStr(c?.display_name);
  const subj =
    safeStr(c?.majorSubject?.subject?.subject_name) ||
    safeStr(c?.majorSubject?.subject?.name) ||
    safeStr(c?.subject_name);

  const cls = safeStr(c?.classGroup?.class_name) || safeStr(c?.class_group_name);
  const year = safeStr(c?.academic_year);
  const sem = c?.semester ? `Sem ${c.semester}` : "";

  if (courseName) return courseName;
  if (display) return display;

  const parts = [subj || "N/A Subject", cls, year, sem].filter(Boolean);
  return parts.join(" — ");
};

/* ================== MAJOR/DEPT HELPERS (via registration) ================== */
const getStudentDeptId = (st) =>
  safeStr(st?.department_id ?? st?.registration?.department_id ?? st?.department?.id ?? "");

const getStudentMajorId = (st) =>
  safeStr(st?.major_id ?? st?.registration?.major_id ?? st?.major?.id ?? "");

/**
 * Course major/department (preferred path):
 *   course.majorSubject.major.id
 *   course.majorSubject.major.department_id
 * Fallbacks:
 *   course.major_id / course.department_id (if your API includes them)
 */
const getCourseMajorId = (c) => safeStr(c?.majorSubject?.major?.id ?? c?.major_id ?? "");
const getCourseDeptId = (c) => safeStr(c?.majorSubject?.major?.department_id ?? c?.department_id ?? "");

const EnrollmentForm = ({ onUpdate, editingEnrollment, onCancel, students = [], courses = [] }) => {
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
      original: s, // Pass full student object
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

  /* ================== FILTER COURSE OPTIONS BY SELECTED STUDENTS ================== */
  const courseOptions = useMemo(() => {
    const allCourses = Array.isArray(courses) ? courses : [];

    // ✅ Edit mode: keep all courses (or backend will show the current course anyway)
    if (isEditMode) {
      return allCourses.map((c) => ({
        id: String(c?.id ?? ""),
        label: getCourseLabel(c),
        original: c,
      }));
    }

    const selectedStudents = (form.student_ids || [])
      .map((id) => studentOptions.find((x) => String(x.id) === String(id))?.original)
      .filter(Boolean);

    // No students picked -> show all courses (you can change to [] if you prefer)
    if (selectedStudents.length === 0) {
      return allCourses.map((c) => ({
        id: String(c?.id ?? ""),
        label: getCourseLabel(c),
        original: c,
      }));
    }

    const deptSet = new Set(selectedStudents.map(getStudentDeptId).filter(Boolean));
    const majorSet = new Set(selectedStudents.map(getStudentMajorId).filter(Boolean));

    // Mixed dept/major -> show no courses
    if (deptSet.size !== 1 || majorSet.size !== 1) return [];

    const deptId = [...deptSet][0];
    const majorId = [...majorSet][0];

    const filtered = allCourses.filter((c) => {
      const cMajor = getCourseMajorId(c);
      const cDept = getCourseDeptId(c);

      // if course doesn't have major/dept info, exclude it (prevents wrong enroll)
      if (!cMajor || !cDept) return false;

      return String(cMajor) === String(majorId) && String(cDept) === String(deptId);
    });

    return filtered.map((c) => ({
      id: String(c?.id ?? ""),
      label: getCourseLabel(c),
      original: c,
    }));
  }, [courses, isEditMode, form.student_ids, studentOptions]);

  // ✅ If selected course becomes invalid after changing students -> clear it
  useEffect(() => {
    if (isEditMode) return;
    if (!form.course_id) return;

    const stillValid = courseOptions.some((c) => String(c.id) === String(form.course_id));
    if (!stillValid) {
      setForm((p) => ({ ...p, course_id: "" }));
    }
  }, [courseOptions, form.course_id, isEditMode]);

  // ✅ Populate form when editingEnrollment changes
  useEffect(() => {
    if (editingEnrollment) {
      // edit only one enrollment
      setForm({
        student_ids: editingEnrollment.student_id ? [String(editingEnrollment.student_id)] : [],
        course_id: editingEnrollment.course_id ? String(editingEnrollment.course_id) : "",
        status: editingEnrollment.status || "enrolled",
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingEnrollment]);

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
      // ✅ block mixed dept/major selection
      if (selectionError) throw new Error(selectionError);

      if (!form.course_id) throw new Error("Course is required.");
      if (!form.status) throw new Error("Status is required.");

      if (isEditMode) {
        // edit: only update status
        await updateEnrollmentStatus(editingEnrollment.id, { status: String(form.status) });
      } else {
        // create: allow multiple students
        if (!form.student_ids || form.student_ids.length === 0) {
          throw new Error("Select at least 1 student.");
        }

        // easiest: loop client-side (no backend change needed)
        const courseIdNum = Number(form.course_id);
        const statusStr = String(form.status);

        for (const sid of form.student_ids) {
          await enrollStudent({
            student_id: Number(sid),
            course_id: courseIdNum,
            status: statusStr,
          });
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
        {success && (
          <Alert
            type="success"
            message={`Enrollment ${isEditMode ? "updated" : "created"} successfully!`}
          />
        )}
        {selectionError && (
          <Alert type="error" message={selectionError} onClose={null} />
        )}
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
    className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 shadow-lg backdrop-blur-sm ${
      type === "success"
        ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
        : "bg-gradient-to-r from-rose-50 to-red-50 border-red-300"
    }`}
  >
    <div
      className={`p-2 rounded-xl ${
        type === "success" ? "bg-emerald-100" : "bg-red-100"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
      ) : (
        <AlertCircle className="w-6 h-6 text-red-600" />
      )}
    </div>

    <p
      className={`flex-1 text-sm font-semibold ${
        type === "success" ? "text-emerald-900" : "text-red-900"
      }`}
    >
      {message}
    </p>

    {onClose && (
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className={`p-1.5 rounded-lg transition-colors ${
          type === "success"
            ? "hover:bg-emerald-200 text-emerald-700"
            : "hover:bg-red-200 text-red-700"
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
}) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 border-2 border-gray-200 shadow-2xl shadow-gray-200/50 p-8"
  >
    {/* Decorative corner elements */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100/30 to-orange-100/30 rounded-full blur-3xl" />

    <div className="relative z-10">
      <FormHeader isEditMode={isEditMode} onCancel={onCancel} />

      <motion.form
        onSubmit={onSubmit}
        variants={animations.container}
        initial="hidden"
        animate="show"
        className="space-y-6 mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MultiStudentSelect
            disabled={isEditMode}
            value={form.student_ids}
            onChange={(ids) => setForm((p) => ({ ...p, student_ids: ids }))}
            options={studentOptions}
          />

          <SelectField
            icon={BookOpen}
            placeholder="Select Course"
            value={form.course_id}
            onChange={(v) => setForm((p) => ({ ...p, course_id: v }))}
            options={courseOptions}
            disabled={!isEditMode && (form.student_ids?.length ?? 0) === 0}
            name="course_id"
          />

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
  <div className="flex items-center justify-between pb-6 border-b-2 border-gray-200">
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isEditMode ? "Update Enrollment" : "Enroll Students"}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {isEditMode ? "Modify enrollment status" : "Add students to a course"}
        </p>
      </div>
    </div>

    {isEditMode && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        type="button"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-medium transition-all duration-200 border-2 border-transparent hover:border-red-200"
      >
        <X className="w-4 h-4" />
        Cancel
      </motion.button>
    )}
  </div>
);

/* ================== MULTI STUDENT SELECT WITH CHECKBOXES ================== */
const MultiStudentSelect = ({ value = [], onChange, options = [], disabled }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((opt) => {
    const label = (opt.label || opt.name || "").toLowerCase();
    return label.includes(searchTerm.toLowerCase());
  });

  const toggleStudent = (studentId) => {
    if (disabled) return;

    const newValue = value.includes(studentId)
      ? value.filter((id) => id !== studentId)
      : [...value, studentId];

    onChange(newValue);
  };

  const selectAll = () => {
    if (disabled) return;
    onChange(filteredOptions.map((opt) => String(opt.id)));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <motion.div variants={animations.item} className="relative lg:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <label className="text-sm font-bold text-gray-800">
            Students {!disabled && <span className="text-red-500">*</span>}
          </label>
        </div>
        <div className="flex items-center gap-2">
          {!disabled && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={selectAll}
                className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
              >
                Select All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={clearAll}
                className="px-3 py-1 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold transition-colors"
              >
                Clear All
              </motion.button>
            </>
          )}
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            {value.length} selected
          </span>
        </div>
      </div>

      {/* Search Box */}
      {!disabled && (
        <div className="mb-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, email, phone..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      )}

      {/* Students List with Checkboxes */}
      <div className="border-2 border-gray-300 rounded-2xl bg-white overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No students found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOptions.map((opt) => {
                const studentData = opt.original || opt;
                const isSelected = value.includes(String(opt.id));

                const name =
                  studentData.student_name ||
                  studentData.full_name_en ||
                  studentData.name ||
                  "Unknown";
                const nameKh = studentData.student_name_kh || studentData.full_name_kh || "";
                const email = studentData.student_email || studentData.email || studentData.personal_email || "";
                const phone = studentData.student_phone || studentData.phone || "";
                const address = studentData.student_address || studentData.address || "";
                const image = studentData.profile_picture_url || "";
                const code = studentData.student_code || "";

                return (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !disabled && toggleStudent(String(opt.id))}
                  >
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                        </div>
                      </div>

                      {/* Student Image */}
                      <div className="flex-shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                              console.log(image);
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
                            image ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-xl font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{name}</h4>
                            {nameKh && <p className="text-xs text-gray-600">{nameKh}</p>}
                          </div>
                          {code && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-semibold">
                              {code}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                          {email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <div className="p-1 rounded bg-blue-100 flex-shrink-0">
                                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="truncate">{email}</span>
                            </div>
                          )}

                          {phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <div className="p-1 rounded bg-green-100 flex-shrink-0">
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              </div>
                              <span>{phone}</span>
                            </div>
                          )}

                          {address && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <div className="p-1 rounded bg-purple-100 flex-shrink-0">
                                <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <span className="truncate">{address}</span>
                            </div>
                          )}
                        </div>
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
        <div className="mt-2 text-xs text-gray-500 text-center">
          Showing {filteredOptions.length} student{filteredOptions.length !== 1 ? "s" : ""}
        </div>
      )}
    </motion.div>
  );
};

const SelectField = ({ icon: Icon, placeholder, value, onChange, options = [], disabled, name }) => (
  <motion.div variants={animations.item} className="relative lg:col-span-2">
    <div className="mb-3 flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
        <Icon className="w-4 h-4 text-purple-600" />
      </div>
      <label className="text-sm font-bold text-gray-800">
        {placeholder} <span className="text-red-500">*</span>
      </label>
    </div>

    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      disabled={disabled}
      className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-gray-900 border-2 border-gray-300 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md appearance-none cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        paddingRight: "3rem",
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
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    type="submit"
    className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-4 text-base font-bold text-white shadow-2xl shadow-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all border-2 border-white/20"
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
