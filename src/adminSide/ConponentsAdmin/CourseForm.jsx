import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  X,
  Building2,
  GraduationCap,
  BookOpen,
  User2,
  Calendar,
} from "lucide-react";

import {
  fetchDepartments,
  fetchMajorsByDepartment,
} from "../../api/department_api.jsx";
import { fetchMajorSubjects } from "../../api/major_subject_api.jsx";
import { fetchTeachers } from "../../api/teacher_api.jsx";
import { fetchAllClassGroups } from "../../api/class_group_api.jsx";

const empty = {
  department_id: "",
  major_id: "",
  major_subject_id: "",
  teacher_id: "",
  semester: "", // number-like string
  academic_year: "", // "YYYY-YYYY"
};

const normalizeArray = (res) => {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data;
  return Array.isArray(d) ? d : [];
};

/* ================= UI CLASSES (ONLY STYLE) ================= */

const labelCls = "text-xs font-semibold text-gray-700";
const baseField =
  "mt-1 w-full rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl px-4 py-3 " +
  "text-sm text-gray-800 shadow-sm outline-none transition-all " +
  "hover:border-white/80 focus:ring-2 focus:ring-blue-400/35 focus:border-blue-300 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const iconWrap =
  "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl " +
  "bg-white/70 border border-white/60 shadow-sm flex items-center justify-center";

const fieldWithIconPadding = "pl-14";

/* ================= ACADEMIC YEAR OPTIONS ================= */
/**
 * Current year based on user's timezone (Asia/Phnom_Penh)
 * Build 5 past + current + 5 future = 11 options
 * Format: "YYYY-YYYY"
 */
const buildAcademicYears = (past = 5, future = 5) => {
  const currentYear = new Date().getFullYear();
  const start = currentYear - past;
  const end = currentYear + future;

  const arr = [];
  for (let y = start; y <= end; y++) {
    arr.push(`${y}-${y + 1}`);
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

  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingMaj, setLoadingMaj] = useState(false);
  const [loadingMS, setLoadingMS] = useState(false);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  const [classGroups, setClassGroups] = useState([]);
  const [loadingCG, setLoadingCG] = useState(false);

  const classGroupsFiltered = useMemo(() => {
    if (!form.major_id) return [];
    return classGroups.filter((cg) => {
      const sameMajor = String(cg.major_id) === String(form.major_id);
      const sameYear = form.academic_year ? String(cg.academic_year) === String(form.academic_year) : true;
      const sameSem = form.semester ? String(cg.semester) === String(form.semester) : true;
      return sameMajor && sameYear && sameSem;
    });
  }, [classGroups, form.major_id, form.academic_year, form.semester]);


  const academicYearOptions = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => {
      const start = now - 5 + i;
      return {
        value: `${start}-${start + 1}`,
        label: `${start}-${start + 1}`,
      };
    });
  }, []);

  const handleChange = (key, value) => {
    setError("");
    setForm((p) => ({ ...p, [key]: value }));
  };

  // Prefill when editing
  useEffect(() => {
    if (editingCourse) {
      const ms =
        editingCourse?.majorSubject ?? editingCourse?.major_subject ?? null;
      const majorId =
        ms?.major_id ?? ms?.major?.id ?? editingCourse?.major_id ?? "";
      const deptId =
        ms?.major?.department_id ?? editingCourse?.department_id ?? "";

      const ay = editingCourse.academic_year
        ? String(editingCourse.academic_year)
        : "";

      setForm({
        department_id: deptId ? String(deptId) : "",
        major_id: majorId ? String(majorId) : "",
        major_subject_id: editingCourse.major_subject_id
          ? String(editingCourse.major_subject_id)
          : "",
        teacher_id: editingCourse.teacher_id
          ? String(editingCourse.teacher_id)
          : "",
        semester: editingCourse.semester ? String(editingCourse.semester) : "",
        academic_year: ay,
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
      setForm((p) => ({ ...p, major_id: "", major_subject_id: "" }));
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

  useEffect(() => {
    (async () => {
      try {
        setLoadingCG(true);
        const res = await fetchAllClassGroups();
        const data = res?.data?.data ?? res?.data ?? [];
        setClassGroups(Array.isArray(data) ? data : []);
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

  // Reset major_subject_id when major changes
  useEffect(() => {
    setForm((p) => ({ ...p, major_subject_id: "" }));
  }, [form.major_id]);

  // Filter major-subjects by selected major
  const majorSubjectsFiltered = useMemo(() => {
    if (!form.major_id) return [];
    const majorIdNum = Number(form.major_id);

    return majorSubjects.filter((ms) => {
      const msMajorId = ms.major_id ?? ms.major?.id;
      return Number(msMajorId) === majorIdNum;
    });
  }, [majorSubjects, form.major_id]);

  // ✅ EASY: auto-fill semester from major_subjects when selecting subject
  useEffect(() => {
    if (!form.major_subject_id) return;
    const ms = majorSubjectsFiltered.find(
      (x) => String(x.id) === String(form.major_subject_id)
    );
    const sem = ms?.semester ?? "";
    if (sem && !form.semester) {
      setForm((p) => ({ ...p, semester: String(sem) }));
    }
  }, [form.major_subject_id, majorSubjectsFiltered]);

  const majorLabel = useMemo(() => {
    const m = majors.find((x) => String(x.id) === String(form.major_id));
    return m?.major_name ?? m?.name ?? "";
  }, [majors, form.major_id]);

  const majorSubjectLabel = useMemo(() => {
    const ms = majorSubjectsFiltered.find(
      (x) => String(x.id) === String(form.major_subject_id)
    );
    return (
      ms?.subject?.subject_name ??
      ms?.subject_name ??
      ms?.subject?.name ??
      ""
    );
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

  // ✅ ensure editing course academic year appears even if outside 5 past/future
  const academicYearSelectOptions = useMemo(() => {
    const ay = String(form.academic_year || "");
    if (!ay) return academicYearOptions;
    const values = academicYearOptions.map((x) => x.value);
    if (values.includes(ay)) return academicYearOptions;
    return [{ value: ay, label: ay }, ...academicYearOptions];
  }, [academicYearOptions, form.academic_year]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-2xl shadow-[0_22px_70px_-30px_rgba(15,23,42,0.35)] p-6">
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">
            {editingCourse ? "Edit Course" : "Create Course"}
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Flow: Department → Major → Subject (major_subjects)
          </p>
        </div>

        {editingCourse && (
          <button
            type="button"
            onClick={() => {
              onCancel?.();
              setForm(empty);
              setError("");
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 border border-white/60 hover:bg-white transition shadow-sm"
          >
            <X size={16} className="text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">
              Cancel edit
            </span>
          </button>
        )}
      </div>

      {error && (
        <div className="relative mb-4 p-3 rounded-2xl bg-red-50/80 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Department */}
        <div className="md:col-span-1">
          <label className={labelCls}>Department *</label>
          <div className="relative">
            <div className={iconWrap}>
              <Building2 className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.department_id}
              onChange={(e) => handleChange("department_id", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
              disabled={loadingDept}
            >
              <option value="">
                {loadingDept ? "Loading..." : "Select department"}
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department_name ?? d.name ?? `Department #${d.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Major */}
        <div className="md:col-span-1">
          <label className={labelCls}>Major *</label>
          <div className="relative">
            <div className={iconWrap}>
              <GraduationCap className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.major_id}
              onChange={(e) => handleChange("major_id", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
              disabled={!form.department_id || loadingMaj}
            >
              <option value="">
                {!form.department_id
                  ? "Select department first"
                  : loadingMaj
                    ? "Loading..."
                    : "Select major"}
              </option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.major_name ?? m.name ?? `Major #${m.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Major Subject */}
        <div className="md:col-span-1">
          <label className={labelCls}>Subject *</label>
          <div className="relative">
            <div className={iconWrap}>
              <BookOpen className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.major_subject_id}
              onChange={(e) => handleChange("major_subject_id", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
              disabled={!form.major_id || loadingMS}
            >
              <option value="">
                {!form.major_id
                  ? "Select major first"
                  : loadingMS
                    ? "Loading..."
                    : "Select subject"}
              </option>

              {majorSubjectsFiltered.map((ms) => (
                <option key={ms.id} value={ms.id}>
                  {ms.subject?.subject_name ??
                    ms.subject_name ??
                    ms.subject?.name ??
                    `MajorSubject #${ms.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Teacher */}
        <div className="md:col-span-1">
          <label className={labelCls}>Teacher *</label>
          <div className="relative">
            <div className={iconWrap}>
              <User2 className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.teacher_id}
              onChange={(e) => handleChange("teacher_id", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
              disabled={loadingTeacher}
            >
              <option value="">
                {loadingTeacher ? "Loading..." : "Select teacher"}
              </option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name ?? t.full_name ?? t.teacher_name ?? `Teacher #${t.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Semester */}
        <div className="md:col-span-1">
          <label className={labelCls}>Semester *</label>
          <div className="relative">
            <div className={iconWrap}>
              <Calendar className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.semester}
              onChange={(e) => handleChange("semester", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
            >
              <option value="">Select semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
            </select>
          </div>
        </div>

        {/* Academic Year */}
        <div className="md:col-span-1">
          <label className={labelCls}>Academic Year *</label>
          <div className="relative">
            <div className={iconWrap}>
              <Calendar className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.academic_year}
              onChange={(e) => handleChange("academic_year", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
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

        {/* Class Group (optional) */}
        <div className="md:col-span-1">
          <label className={labelCls}>Class Group (optional)</label>
          <div className="relative">
            <div className={iconWrap}>
              <BookOpen className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.class_group_id}
              onChange={(e) => handleChange("class_group_id", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
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


        {/* Preview */}
        <div className="md:col-span-2">
          <div className="mt-6 rounded-2xl bg-white/70 border border-white/60 px-4 py-3 text-[12px] text-gray-700 shadow-sm">
            Preview:{" "}
            <span className="font-extrabold text-gray-900">
              {majorLabel || "Major"}
            </span>{" "}
            →{" "}
            <span className="font-extrabold text-gray-900">
              {majorSubjectLabel || "Subject"}
            </span>
            {form.academic_year ? (
              <span className="ml-2 text-gray-600">
                • <b>{form.academic_year}</b>
              </span>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-4 flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold shadow-[0_18px_45px_-25px_rgba(59,130,246,0.9)] hover:opacity-95 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : editingCourse ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
