import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  X,
  Building2,
  GraduationCap,
  BookOpen,
  User2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  fetchDepartments,
  fetchMajorsByDepartment,
} from "../../api/department_api.jsx";
import { fetchMajorSubjects } from "../../api/major_subject_api.jsx";
import { fetchTeachers } from "../../api/teacher_api.jsx";
import { fetchAllClassGroups } from "../../api/class_group_api.jsx";

/* ================= DEFAULT STATE ================= */

const empty = {
  department_id: "",
  major_id: "",
  major_subject_id: "",
  teacher_id: "",
  semester: "",
  academic_year: "",
  class_group_id: "",
};

const normalizeArray = (res) => {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data;
  return Array.isArray(d) ? d : [];
};

/* ================= ACADEMIC YEAR OPTIONS ================= */
const buildAcademicYears = (past = 5, future = 5) => {
  const currentYear = new Date().getFullYear();
  const start = currentYear - past;
  const end = currentYear + future;

  const arr = [];
  for (let y = start; y <= end; y++) {
    arr.push({ value: `${y}-${y + 1}`, label: `${y}-${y + 1}` });
  }
  return arr;
};

const CourseForm = ({ editingCourse, onCancel, onCreate, onUpdate }) => {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [majorSubjects, setMajorSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classGroups, setClassGroups] = useState([]);

  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingMaj, setLoadingMaj] = useState(false);
  const [loadingMS, setLoadingMS] = useState(false);
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const [loadingCG, setLoadingCG] = useState(false);

  const academicYearOptions = useMemo(() => buildAcademicYears(5, 5), []);

  const handleChange = (key, value) => {
    setError("");
    setForm((p) => {
      const updated = { ...p, [key]: value };

      // Manual resets only when user interacts
      if (key === "department_id") {
        updated.major_id = "";
        updated.major_subject_id = "";
        updated.class_group_id = "";
      } else if (key === "major_id") {
        updated.major_subject_id = "";
        updated.class_group_id = "";
      }

      return updated;
    });
  };

  // Prefill when editing
  useEffect(() => {
    if (editingCourse) {
      // ✅ Handle various backend naming conventions
      const ms = editingCourse?.majorSubject ?? editingCourse?.major_subject ?? null;
      const major = ms?.major ?? editingCourse?.major ?? null;

      const majorId = ms?.major_id ?? major?.id ?? editingCourse?.major_id ?? "";
      const deptId = major?.department_id ?? editingCourse?.department_id ?? "";

      const ay = editingCourse?.academic_year ? String(editingCourse.academic_year) : "";

      setForm({
        department_id: deptId ? String(deptId) : "",
        major_id: majorId ? String(majorId) : "",
        major_subject_id: editingCourse?.major_subject_id ? String(editingCourse.major_subject_id) : "",
        teacher_id: editingCourse?.teacher_id ? String(editingCourse.teacher_id) : "",
        semester: editingCourse?.semester ? String(editingCourse.semester) : "",
        academic_year: ay,
        class_group_id: editingCourse?.class_group_id ? String(editingCourse.class_group_id) : "",
      });
    } else {
      setForm(empty);
    }
  }, [editingCourse]);

  // Load departments
  useEffect(() => {
    (async () => {
      try {
        setLoadingDept(true);
        const res = await fetchDepartments();
        setDepartments(normalizeArray(res));
      } catch (e) {
        console.error("fetchDepartments error:", e);
        setDepartments([]);
      } finally {
        setLoadingDept(false);
      }
    })();
  }, []);

  // Load teachers
  useEffect(() => {
    (async () => {
      try {
        setLoadingTeacher(true);
        const res = await fetchTeachers();
        setTeachers(normalizeArray(res));
      } catch (e) {
        console.warn("fetchTeachers failed:", e);
        setTeachers([]);
      } finally {
        setLoadingTeacher(false);
      }
    })();
  }, []);

  // Load majors when department changes
  useEffect(() => {
    const deptId = form.department_id;

    if (!deptId) {
      setMajors([]);
      return;
    }

    (async () => {
      try {
        setLoadingMaj(true);
        const res = await fetchMajorsByDepartment(deptId);
        setMajors(normalizeArray(res));
      } catch (e) {
        console.error("fetchMajorsByDepartment error:", e);
        setMajors([]);
      } finally {
        setLoadingMaj(false);
      }
    })();
  }, [form.department_id]);

  // Load class groups once
  useEffect(() => {
    (async () => {
      try {
        setLoadingCG(true);
        const res = await fetchAllClassGroups();
        setClassGroups(normalizeArray(res));
      } catch (e) {
        console.error("fetchAllClassGroups error:", e);
        setClassGroups([]);
      } finally {
        setLoadingCG(false);
      }
    })();
  }, []);

  // Load major-subjects once
  useEffect(() => {
    (async () => {
      try {
        setLoadingMS(true);
        const res = await fetchMajorSubjects();
        setMajorSubjects(normalizeArray(res));
      } catch (e) {
        console.error("fetchMajorSubjects error:", e);
        setMajorSubjects([]);
      } finally {
        setLoadingMS(false);
      }
    })();
  }, []);

  // Filter major-subjects by selected major
  const majorSubjectsFiltered = useMemo(() => {
    if (!form.major_id) return [];
    const majorIdNum = Number(form.major_id);
    return majorSubjects.filter((ms) => {
      const msMajorId = ms.major_id ?? ms.major?.id;
      return Number(msMajorId) === majorIdNum;
    });
  }, [majorSubjects, form.major_id]);

  // Filter class groups
  const classGroupsFiltered = useMemo(() => {
    if (!form.major_id) return [];
    return classGroups.filter((cg) => {
      const sameMajor = String(cg.major_id) === String(form.major_id);
      const sameYear = form.academic_year ? String(cg.academic_year) === String(form.academic_year) : true;
      const sameSem = form.semester ? String(cg.semester) === String(form.semester) : true;
      return sameMajor && sameYear && sameSem;
    });
  }, [classGroups, form.major_id, form.academic_year, form.semester]);

  // Auto-fill semester
  useEffect(() => {
    if (!form.major_subject_id) return;
    const ms = majorSubjectsFiltered.find((x) => String(x.id) === String(form.major_subject_id));
    const sem = ms?.semester ?? "";
    if (sem && !form.semester) {
      setForm((p) => ({ ...p, semester: String(sem) }));
    }
  }, [form.major_subject_id, majorSubjectsFiltered, form.semester]);

  const majorLabel = useMemo(() => {
    const m = majors.find((x) => String(x.id) === String(form.major_id));
    return m?.major_name ?? m?.name ?? "";
  }, [majors, form.major_id]);

  const majorSubjectLabel = useMemo(() => {
    const ms = majorSubjectsFiltered.find((x) => String(x.id) === String(form.major_subject_id));
    return ms?.subject?.subject_name ?? ms?.subject_name ?? ms?.subject?.name ?? "";
  }, [majorSubjectsFiltered, form.major_subject_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.department_id) return setError("Department is required.");
    if (!form.major_id) return setError("Major is required.");
    if (!form.major_subject_id) return setError("Subject is required.");
    if (!form.teacher_id) return setError("Teacher is required.");
    if (!form.semester) return setError("Semester is required.");
    if (!form.academic_year) return setError("Academic year is required.");

    try {
      setSaving(true);

      const payload = {
        major_subject_id: Number(form.major_subject_id),
        teacher_id: Number(form.teacher_id),
        semester: Number(form.semester),
        academic_year: String(form.academic_year).trim(),
        class_group_id: form.class_group_id ? Number(form.class_group_id) : null,
      };

      if (editingCourse?.id) {
        await onUpdate(editingCourse.id, payload);
      } else {
        await onCreate(payload);
      }

      setForm(empty);
    } catch (err) {
      console.error("Save course error:", err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to save course. Check backend logs.");
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const academicYearSelectOptions = useMemo(() => {
    const ay = String(form.academic_year || "");
    if (!ay) return academicYearOptions;
    const values = academicYearOptions.map((x) => x.value);
    if (values.includes(ay)) return academicYearOptions;
    return [{ value: ay, label: ay }, ...academicYearOptions];
  }, [academicYearOptions, form.academic_year]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-white border border-white shadow-lg p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Department → Major → Subject (major_subjects)
            </p>
          </div>
        </div>

        {editingCourse && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => {
              onCancel?.();
              setForm(empty);
              setError("");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 border border-purple-200/60 text-sm text-gray-700 hover:bg-white transition-all"
          >
            <X className="w-4 h-4" />
            Cancel
          </motion.button>
        )}
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 p-4 mb-4 rounded-2xl bg-red-50 border border-red-200 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Department, Major, Subject, Teacher */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Department */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Department <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <select
                value={form.department_id}
                onChange={(e) => handleChange("department_id", e.target.value)}
                className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loadingDept}
              >
                <option value="">{loadingDept ? "Loading..." : "Select department"}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.department_name ?? d.name ?? `Department #${d.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Major */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              Major <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <select
                value={form.major_id}
                onChange={(e) => handleChange("major_id", e.target.value)}
                className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!form.department_id || loadingMaj}
              >
                <option value="">
                  {!form.department_id ? "Select department first" : loadingMaj ? "Loading..." : "Select major"}
                </option>
                {majors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.major_name ?? m.name ?? `Major #${m.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Subject <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <select
                value={form.major_subject_id}
                onChange={(e) => handleChange("major_subject_id", e.target.value)}
                className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!form.major_id || loadingMS}
              >
                <option value="">
                  {!form.major_id ? "Select major first" : loadingMS ? "Loading..." : "Select subject"}
                </option>
                {majorSubjectsFiltered.map((ms) => (
                  <option key={ms.id} value={ms.id}>
                    {ms.subject?.subject_name ?? ms.subject_name ?? ms.subject?.name ?? `MajorSubject #${ms.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <User2 className="w-3 h-3" />
              Teacher <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <User2 className="w-3.5 h-3.5" />
              </div>
              <select
                value={form.teacher_id}
                onChange={(e) => handleChange("teacher_id", e.target.value)}
                className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loadingTeacher}
              >
                <option value="">{loadingTeacher ? "Loading..." : "Select teacher"}</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name ?? t.full_name ?? t.teacher_name ?? `Teacher #${t.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Semester, Academic Year, Class Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Semester */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Semester <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <select
                value={form.semester}
                onChange={(e) => handleChange("semester", e.target.value)}
                className="w-full rounded-xl bg-white pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
              >
                <option value="">Select semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
              </select>
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Academic Year <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <select
                value={form.academic_year}
                onChange={(e) => handleChange("academic_year", e.target.value)}
                className="w-full rounded-xl bg-white pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
              >
                <option value="">Select academic year</option>
                {academicYearSelectOptions.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class Group */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Class Group (optional)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <select
                value={form.class_group_id}
                onChange={(e) => handleChange("class_group_id", e.target.value)}
                className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!form.major_id || loadingCG}
              >
                <option value="">
                  {!form.major_id ? "Select major first" : loadingCG ? "Loading..." : "No class group / General"}
                </option>
                {classGroupsFiltered.map((cg) => (
                  <option key={cg.id} value={cg.id}>
                    {cg.class_name} • {cg.shift ?? "-"} • Sem {cg.semester} • {cg.academic_year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 px-4 py-3"
        >
          <p className="text-xs text-gray-600 mb-1 font-medium">Preview:</p>
          <p className="text-sm">
            <span className="font-bold text-blue-700">{majorLabel || "Major"}</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="font-bold text-purple-700">{majorSubjectLabel || "Subject"}</span>
            {form.academic_year && (
              <span className="ml-2 text-gray-600">
                • <b>{form.academic_year}</b>
              </span>
            )}
          </p>
        </motion.div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="w-full md:w-auto relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {!saving && (
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {editingCourse ? "Update Course" : "Create Course"}
                </>
              )}
            </span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CourseForm;