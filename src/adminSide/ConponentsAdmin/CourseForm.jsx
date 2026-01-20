import React, { useEffect, useMemo, useState } from "react";
import { Save, X } from "lucide-react";

import { fetchDepartments, fetchMajorsByDepartment } from "../../api/department_api.jsx";
import { fetchMajorSubjects } from "../../api/major_subject_api.jsx";

// OPTIONAL (recommended) teacher dropdown
// If you don't have teacher api yet, comment these 2 lines and use teacher_id input instead.
//import { fetchTeachers } from "../../api/teacher_api.jsx";

const empty = {
  department_id: "",
  major_id: "",
  major_subject_id: "",
  teacher_id: "",
  semester: "",        // ✅ should be "1" or "2" (number-like string from select)
  academic_year: "",
};

const normalizeArray = (res) => {
  // supports:
  // { data: { data: [...] } } or { data: [...] } or { data: { success:true, data:[...] } }
  const d = res?.data?.data ?? res?.data?.data?.data ?? res?.data ?? [];
  if (Array.isArray(d)) return d;

  // handle {success:true, data:[...]}
  if (Array.isArray(res?.data?.data)) return res.data.data;

  return [];
};

const CourseForm = ({ editingCourse, onCancel, onCreate, onUpdate }) => {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [majorSubjects, setMajorSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]); // ✅ optional

  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingMaj, setLoadingMaj] = useState(false);
  const [loadingMS, setLoadingMS] = useState(false);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  const handleChange = (key, value) => {
    setError("");
    setForm((p) => ({ ...p, [key]: value }));
  };

  // Prefill when editing
  useEffect(() => {
    if (editingCourse) {
      // try to infer dept + major from majorSubject relationship
      const ms = editingCourse?.majorSubject ?? editingCourse?.major_subject ?? null;
      const majorId = ms?.major_id ?? ms?.major?.id ?? editingCourse?.major_id ?? "";
      const deptId = ms?.major?.department_id ?? editingCourse?.department_id ?? "";

      setForm({
        department_id: deptId ? String(deptId) : "",
        major_id: majorId ? String(majorId) : "",
        major_subject_id: editingCourse.major_subject_id ? String(editingCourse.major_subject_id) : "",
        teacher_id: editingCourse.teacher_id ? String(editingCourse.teacher_id) : "",
        semester: editingCourse.semester ? String(editingCourse.semester) : "",
        academic_year: editingCourse.academic_year ? String(editingCourse.academic_year) : "",
      });
    } else {
      setForm(empty);
    }
  }, [editingCourse]);

  // 1) Load departments once
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

  // 2) Load teachers once (optional)
  useEffect(() => {
    (async () => {
      try {
        setLoadingTeacher(true);
        const res = await fetchTeachers();
        setTeachers(normalizeArray(res));
      } catch (e) {
        console.warn("fetchTeachers not available or failed:", e);
        setTeachers([]);
      } finally {
        setLoadingTeacher(false);
      }
    })();
  }, []);

  // 3) Load majors when department changes
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

  // 4) Load major-subjects once
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

  // Labels
  const majorLabel = useMemo(() => {
    const m = majors.find((x) => String(x.id) === String(form.major_id));
    return m?.major_name ?? m?.name ?? "";
  }, [majors, form.major_id]);

  const majorSubjectLabel = useMemo(() => {
    const ms = majorSubjectsFiltered.find((x) => String(x.id) === String(form.major_subject_id));
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

    // ✅ required checks
    if (!form.department_id) return setError("Department is required.");
    if (!form.major_id) return setError("Major is required.");
    if (!form.major_subject_id) return setError("Subject is required.");
    if (!form.teacher_id) return setError("Teacher is required.");
    if (!form.semester) return setError("Semester is required.");
    if (!form.academic_year?.trim()) return setError("Academic year is required.");

    // ✅ FIX: semester should be number in DB (1/2/3...)
    const semesterNum = Number(form.semester);
    if (Number.isNaN(semesterNum)) return setError("Semester must be a number (1, 2, ...).");

    try {
      setSaving(true);

      const payload = {
        major_subject_id: Number(form.major_subject_id),
        teacher_id: Number(form.teacher_id),
        semester: semesterNum, // ✅ number (fixes your SQL error)
        academic_year: String(form.academic_year).trim(),
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

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {editingCourse ? "Edit Course" : "Create Course"}
        </h3>

        {editingCourse && (
          <button
            type="button"
            onClick={() => {
              onCancel?.();
              setForm(empty);
              setError("");
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/40 hover:bg-white transition"
          >
            <X size={16} />
            Cancel edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Department */}
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600">Department *</label>
          <select
            value={form.department_id}
            onChange={(e) => handleChange("department_id", e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-white/40 bg-white/70 outline-none"
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

        {/* Major */}
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600">Major *</label>
          <select
            value={form.major_id}
            onChange={(e) => handleChange("major_id", e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-white/40 bg-white/70 outline-none"
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

        {/* Major Subject */}
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600">Subject *</label>
          <select
            value={form.major_subject_id}
            onChange={(e) => handleChange("major_subject_id", e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-white/40 bg-white/70 outline-none"
            disabled={!form.major_id || loadingMS}
          >
            <option value="">
              {!form.major_id ? "Select major first" : loadingMS ? "Loading..." : "Select subject"}
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

        {/* Teacher */}
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600">Teacher *</label>

          {/* ✅ Teacher dropdown if API exists */}
          {teachers.length > 0 ? (
            <select
              value={form.teacher_id}
              onChange={(e) => handleChange("teacher_id", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-white/40 bg-white/70 outline-none"
              disabled={loadingTeacher}
            >
              <option value="">{loadingTeacher ? "Loading..." : "Select teacher"}</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name ?? t.full_name ?? t.teacher_name ?? `Teacher #${t.id}`}
                </option>
              ))}
            </select>
          ) : (
            // fallback input if no teacher api yet
            <input
              value={form.teacher_id}
              onChange={(e) => handleChange("teacher_id", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-white/40 bg-white/70 outline-none"
              placeholder="e.g. 2"
            />
          )}
        </div>

        {/* Semester (NUMBER) */}
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600">Semester *</label>
          <select
            value={form.semester}
            onChange={(e) => handleChange("semester", e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-white/40 bg-white/70 outline-none"
          >
            <option value="">Select semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
          </select>
        </div>

        {/* Academic Year */}
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600">Academic Year *</label>
          <input
            value={form.academic_year}
            onChange={(e) => handleChange("academic_year", e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-white/40 bg-white/70 outline-none"
            placeholder="e.g. 2025-2026"
          />
        </div>

        {/* Preview */}
        <div className="md:col-span-2">
          <div className="mt-6 text-[11px] text-gray-600 bg-white/70 border border-white/40 rounded-xl px-3 py-2">
            Preview: <b>{majorLabel || "Major"}</b> → <b>{majorSubjectLabel || "Subject"}</b>
          </div>
        </div>

        <div className="md:col-span-4 flex justify-end">
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:opacity-95 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : editingCourse ? "Update" : "Create"}
          </button>
        </div>
      </form>

      <p className="text-[11px] text-gray-500 mt-3">
        Flow: Department → Major → Subject (from major_subjects). Semester is numeric to match database.
      </p>
    </div>
  );
};

export default CourseForm;
