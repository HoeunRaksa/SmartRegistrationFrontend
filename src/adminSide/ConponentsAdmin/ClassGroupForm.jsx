// =====================================================
// src/adminSide/ConponentsAdmin/ClassGroupForm.jsx
// ✅ ENHANCED UI — All logic preserved
// =====================================================
import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  X,
  Building2,
  GraduationCap,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { fetchDepartments, fetchMajorsByDepartment } from "../../api/department_api.jsx";

const empty = {
  department_id: "",
  major_id: "",
  class_name: "",
  academic_year: "",
  semester: "",
  shift: "",
  capacity: "",
};

const normalizeArray = (res) => {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data;
  return Array.isArray(d) ? d : [];
};

const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2";
const baseField =
  "mt-1 w-full rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl px-4 py-3 " +
  "text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 " +
  "hover:border-blue-300/60 hover:shadow-md focus:ring-2 focus:ring-blue-400/35 focus:border-blue-400 focus:shadow-lg " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const iconWrap =
  "absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl " +
  "bg-gradient-to-br from-white/90 to-white/70 border border-white/80 shadow-md flex items-center justify-center " +
  "transition-all duration-200 group-hover:scale-105 group-focus-within:scale-105";

const fieldWithIconPadding = "pl-[3.25rem]";

const buildAcademicYears = (past = 5, future = 5) => {
  const currentYear = new Date().getFullYear();
  const start = currentYear - past;
  const end = currentYear + future;
  const arr = [];
  for (let y = start; y <= end; y++) arr.push(`${y}-${y + 1}`);
  return arr;
};

const SHIFT_OPTIONS = [
  { value: "", label: "No shift (optional)" },
  { value: "Morning", label: "🌅 Morning" },
  { value: "Afternoon", label: "☀️ Afternoon" },
  { value: "Evening", label: "🌆 Evening" },
  { value: "Weekend", label: "📅 Weekend" },
];

const ClassGroupForm = ({ editingGroup, onCancel, onCreate, onUpdate }) => {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingMaj, setLoadingMaj] = useState(false);

  const academicYears = useMemo(() => buildAcademicYears(5, 5), []);

  const setField = (key, value) => {
    setError("");
    setForm((p) => ({ ...p, [key]: value }));
  };

  const reset = () => {
    setForm(empty);
    setError("");
  };

  // Load departments once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingDept(true);
        const res = await fetchDepartments();
        if (!alive) return;
        setDepartments(normalizeArray(res));
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setDepartments([]);
      } finally {
        if (alive) setLoadingDept(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Prefill (edit mode)
  useEffect(() => {
    if (!editingGroup) {
      reset();
      return;
    }

    const deptId =
      editingGroup?.major?.department_id ??
      editingGroup?.department_id ??
      "";

    setForm({
      department_id: deptId ? String(deptId) : "",
      major_id: editingGroup?.major_id ? String(editingGroup.major_id) : "",
      class_name: editingGroup?.class_name ? String(editingGroup.class_name) : "",
      academic_year: editingGroup?.academic_year ? String(editingGroup.academic_year) : "",
      semester: editingGroup?.semester ? String(editingGroup.semester) : "",
      shift: editingGroup?.shift ? String(editingGroup.shift) : "",
      capacity:
        editingGroup?.capacity !== null && editingGroup?.capacity !== undefined
          ? String(editingGroup.capacity)
          : "",
    });

    if (deptId) {
      let alive = true;
      (async () => {
        try {
          setLoadingMaj(true);
          const res = await fetchMajorsByDepartment(deptId);
          if (!alive) return;
          setMajors(normalizeArray(res));
        } catch (e) {
          console.error(e);
          if (!alive) return;
          setMajors([]);
        } finally {
          if (alive) setLoadingMaj(false);
        }
      })();
      return () => {
        alive = false;
      };
    }
  }, [editingGroup]);

  // Load majors when department changes
  useEffect(() => {
    const deptId = form.department_id;

    if (!deptId) {
      setMajors([]);
      setForm((p) => ({ ...p, major_id: "" }));
      return;
    }

    let alive = true;
    (async () => {
      try {
        setLoadingMaj(true);
        const res = await fetchMajorsByDepartment(deptId);
        if (!alive) return;

        const arr = normalizeArray(res);
        setMajors(arr);

        const exists = arr.some((m) => String(m.id) === String(form.major_id));
        if (!exists) setForm((p) => ({ ...p, major_id: "" }));
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setMajors([]);
        setForm((p) => ({ ...p, major_id: "" }));
      } finally {
        if (alive) setLoadingMaj(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.department_id]);

  const departmentOptions = useMemo(() => {
    return departments.map((d) => ({
      value: String(d.id),
      label: d.department_name ?? d.name ?? `Department #${d.id}`,
    }));
  }, [departments]);

  const majorOptions = useMemo(() => {
    return majors.map((m) => ({
      value: String(m.id),
      label: m.major_name ?? m.name ?? `Major #${m.id}`,
    }));
  }, [majors]);

  const majorLabel = useMemo(() => {
    const m = majors.find((x) => String(x.id) === String(form.major_id));
    return m?.major_name ?? m?.name ?? "";
  }, [majors, form.major_id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.department_id) return setError("Department is required.");
    if (!form.major_id) return setError("Major is required.");
    if (!String(form.class_name || "").trim()) return setError("Class name is required.");
    if (!form.academic_year) return setError("Academic year is required.");
    if (!form.semester) return setError("Semester is required.");

    const sem = Number(form.semester);
    if (![1, 2].includes(sem)) return setError("Semester must be 1 or 2.");

    const shift = String(form.shift || "").trim();
    const cap = form.capacity === "" ? null : Number(form.capacity);

    if (cap !== null && (Number.isNaN(cap) || cap < 1)) {
      return setError("Capacity must be a number (>= 1) or empty.");
    }

    const payload = {
      class_name: String(form.class_name).trim(),
      major_id: Number(form.major_id),
      academic_year: String(form.academic_year).trim(),
      semester: sem,
      ...(shift ? { shift } : {}),
      ...(cap !== null ? { capacity: cap } : {}),
    };

    try {
      setSaving(true);
      if (editingGroup?.id) {
        await onUpdate(editingGroup.id, payload);
        onCancel?.();
      } else {
        await onCreate(payload);
      }
      reset();
    } catch (err) {
      console.error("Save class group error:", err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to save class group. Check backend logs.");
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const fields = ['department_id', 'major_id', 'class_name', 'academic_year', 'semester'];
    const filled = fields.filter(f => form[f]).length;
    return Math.round((filled / fields.length) * 100);
  }, [form]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-2xl shadow-[0_22px_70px_-30px_rgba(15,23,42,0.35)]">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full blur-3xl -ml-24 -mb-24" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                {editingGroup ? (
                  <GraduationCap className="w-5.5 h-5.5 text-white" />
                ) : (
                  <Sparkles className="w-5.5 h-5.5 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {editingGroup ? "Edit Class Group" : "Create New Class Group"}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Flow: Department → Major → Class Group Details
                </p>
              </div>
            </div>

            {/* Progress bar for new classes */}
            {!editingGroup && (
              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                    Form Completion
                  </span>
                  <span className="text-xs font-bold text-blue-600">{completionPercentage}%</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-white/60">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              editingGroup ? onCancel?.() : reset();
              reset();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 border border-white/60 hover:bg-white hover:shadow-md transition-all duration-200 ml-4"
          >
            <X size={16} className="text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">
              {editingGroup ? "Cancel" : "Clear"}
            </span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="relative mb-5 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <X className="w-3 h-3 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-0.5">Validation Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="relative space-y-5">
          {/* Row 1: Department, Major, Class Name */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {/* Department */}
            <div className="md:col-span-2 group">
              <label className={labelCls}>
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Department *
              </label>
              <div className="relative">
                <div className={iconWrap}>
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <select
                  value={form.department_id}
                  onChange={(e) => setField("department_id", e.target.value)}
                  className={`${baseField} ${fieldWithIconPadding}`}
                  disabled={loadingDept}
                >
                  <option value="">{loadingDept ? "Loading..." : "Select department"}</option>
                  {departmentOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Major */}
            <div className="md:col-span-2 group">
              <label className={labelCls}>
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                Major *
              </label>
              <div className="relative">
                <div className={iconWrap}>
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <select
                  value={form.major_id}
                  onChange={(e) => setField("major_id", e.target.value)}
                  className={`${baseField} ${fieldWithIconPadding}`}
                  disabled={!form.department_id || loadingMaj}
                >
                  <option value="">
                    {!form.department_id ? "Select department first" : loadingMaj ? "Loading..." : "Select major"}
                  </option>
                  {majorOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Class name */}
            <div className="md:col-span-2 group">
              <label className={labelCls}>
                <BookOpen className="w-3.5 h-3.5 text-pink-600" />
                Class Name *
              </label>
              <div className="relative">
                <div className={iconWrap}>
                  <BookOpen className="w-5 h-5 text-pink-600" />
                </div>
                <input
                  value={form.class_name}
                  onChange={(e) => setField("class_name", e.target.value)}
                  className={`${baseField} ${fieldWithIconPadding}`}
                  placeholder="e.g. A1, B2, SE-2026A"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Academic Year, Semester, Shift, Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {/* Academic year */}
            <div className="md:col-span-2 group">
              <label className={labelCls}>
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Academic Year *
              </label>
              <div className="relative">
                <div className={iconWrap}>
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <select
                  value={form.academic_year}
                  onChange={(e) => setField("academic_year", e.target.value)}
                  className={`${baseField} ${fieldWithIconPadding}`}
                >
                  <option value="">Select academic year</option>
                  {academicYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Semester */}
            <div className="md:col-span-2 group">
              <label className={labelCls}>
                <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                Semester *
              </label>
              <div className="relative">
                <div className={iconWrap}>
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <select
                  value={form.semester}
                  onChange={(e) => setField("semester", e.target.value)}
                  className={`${baseField} ${fieldWithIconPadding}`}
                >
                  <option value="">Select semester</option>
                  <option value="1">📚 Semester 1</option>
                  <option value="2">📖 Semester 2</option>
                </select>
              </div>
            </div>

            {/* Shift */}
            <div className="md:col-span-1 group">
              <label className={labelCls}>
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Shift
              </label>
              <div className="relative">
                <div className={iconWrap}>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <select
                  value={form.shift}
                  onChange={(e) => setField("shift", e.target.value)}
                  className={`${baseField} ${fieldWithIconPadding}`}
                >
                  {SHIFT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Capacity */}
            <div className="md:col-span-1 group">
              <label className={labelCls}>
                <Users className="w-3.5 h-3.5 text-green-600" />
                Capacity
              </label>
              <div className="relative">
                <div className={iconWrap}>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setField("capacity", e.target.value)}
                  className={`${baseField} ${fieldWithIconPadding}`}
                  placeholder="e.g. 40"
                />
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 border border-white/80 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Preview
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-extrabold text-purple-700">
                    {majorLabel || "Major"}
                  </span>
                  {" → "}
                  <span className="font-extrabold text-pink-700">
                    {form.class_name || "Class"}
                  </span>
                  {form.academic_year && (
                    <span className="ml-2 text-gray-600">
                      • <span className="font-semibold">{form.academic_year}</span>
                    </span>
                  )}
                  {form.semester && (
                    <span className="ml-2 text-gray-600">
                      • Semester <span className="font-semibold">{form.semester}</span>
                    </span>
                  )}
                  {form.shift ? (
                    <span className="ml-2 text-gray-600">
                      • <span className="font-semibold">{form.shift}</span>
                    </span>
                  ) : (
                    <span className="ml-2 text-gray-500">• No shift</span>
                  )}
                  {form.capacity ? (
                    <span className="ml-2 text-gray-600">
                      • Capacity <span className="font-semibold">{form.capacity}</span>
                    </span>
                  ) : (
                    <span className="ml-2 text-gray-500">• Default capacity</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold shadow-[0_20px_50px_-25px_rgba(59,130,246,0.9)] hover:shadow-[0_25px_60px_-20px_rgba(59,130,246,1)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Save size={18} className="transition-transform group-hover:rotate-12" />
              <span className="text-[15px]">
                {saving ? "Saving..." : editingGroup ? "Update Class Group" : "Create Class Group"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassGroupForm;