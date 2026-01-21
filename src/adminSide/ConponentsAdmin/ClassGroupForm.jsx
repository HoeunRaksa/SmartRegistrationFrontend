// src/adminSide/ConponentsAdmin/ClassGroupForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Save, X, Building2, GraduationCap, Calendar, Clock, Users, BookOpen } from "lucide-react";
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

const buildAcademicYears = (past = 5, future = 5) => {
  const currentYear = new Date().getFullYear();
  const start = currentYear - past;
  const end = currentYear + future;
  const arr = [];
  for (let y = start; y <= end; y++) arr.push(`${y}-${y + 1}`);
  return arr;
};

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

  // Prefill
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
      (async () => {
        try {
          setLoadingMaj(true);
          const res = await fetchMajorsByDepartment(deptId);
          setMajors(normalizeArray(res));
        } catch (e) {
          console.error(e);
          setMajors([]);
        } finally {
          setLoadingMaj(false);
        }
      })();
    }
  }, [editingGroup]);

  // Load departments once
  useEffect(() => {
    (async () => {
      try {
        setLoadingDept(true);
        const res = await fetchDepartments();
        setDepartments(normalizeArray(res));
      } catch (e) {
        console.error(e);
        setDepartments([]);
      } finally {
        setLoadingDept(false);
      }
    })();
  }, []);

  // Load majors when department changes
  useEffect(() => {
    const deptId = form.department_id;

    if (!deptId) {
      setMajors([]);
      setForm((p) => ({ ...p, major_id: "" }));
      return;
    }

    (async () => {
      try {
        setLoadingMaj(true);
        const res = await fetchMajorsByDepartment(deptId);
        setMajors(normalizeArray(res));
      } catch (e) {
        console.error(e);
        setMajors([]);
      } finally {
        setLoadingMaj(false);
      }
    })();
  }, [form.department_id]);

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
    if (!String(form.shift || "").trim()) return setError("Shift is required.");

    const cap = form.capacity === "" ? null : Number(form.capacity);
    if (cap !== null && (Number.isNaN(cap) || cap < 1)) {
      return setError("Capacity must be a number (>= 1) or empty.");
    }

    const payload = {
      class_name: String(form.class_name).trim(),
      major_id: Number(form.major_id),
      academic_year: String(form.academic_year).trim(),
      semester: Number(form.semester),
      shift: String(form.shift).trim(),
      capacity: cap,
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

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-2xl shadow-[0_22px_70px_-30px_rgba(15,23,42,0.35)] p-6">
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">
            {editingGroup ? "Edit Class Group" : "Create Class Group"}
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Flow: Department → Major → Class Group
          </p>
        </div>

        {editingGroup ? (
          <button
            type="button"
            onClick={() => {
              onCancel?.();
              reset();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 border border-white/60 hover:bg-white transition shadow-sm"
          >
            <X size={16} className="text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">Cancel</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 border border-white/60 hover:bg-white transition shadow-sm"
          >
            <X size={16} className="text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">Clear</span>
          </button>
        )}
      </div>

      {error && (
        <div className="relative mb-4 p-3 rounded-2xl bg-red-50/80 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="relative grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Department */}
        <div className="md:col-span-2">
          <label className={labelCls}>Department *</label>
          <div className="relative">
            <div className={iconWrap}>
              <Building2 className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.department_id}
              onChange={(e) => setField("department_id", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
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
        <div className="md:col-span-2">
          <label className={labelCls}>Major *</label>
          <div className="relative">
            <div className={iconWrap}>
              <GraduationCap className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.major_id}
              onChange={(e) => setField("major_id", e.target.value)}
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

        {/* Class name */}
        <div className="md:col-span-2">
          <label className={labelCls}>Class Name *</label>
          <div className="relative">
            <div className={iconWrap}>
              <BookOpen className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <input
              value={form.class_name}
              onChange={(e) => setField("class_name", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
              placeholder="e.g. A1, B2, SE-2026A"
            />
          </div>
        </div>

        {/* Academic year */}
        <div className="md:col-span-2">
          <label className={labelCls}>Academic Year *</label>
          <div className="relative">
            <div className={iconWrap}>
              <Calendar className="w-4.5 h-4.5 text-gray-600" />
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
        <div className="md:col-span-2">
          <label className={labelCls}>Semester *</label>
          <div className="relative">
            <div className={iconWrap}>
              <Calendar className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.semester}
              onChange={(e) => setField("semester", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
            >
              <option value="">Select semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
            </select>
          </div>
        </div>

        {/* Shift */}
        <div className="md:col-span-1">
          <label className={labelCls}>Shift *</label>
          <div className="relative">
            <div className={iconWrap}>
              <Clock className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <select
              value={form.shift}
              onChange={(e) => setField("shift", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
            >
              <option value="">Select shift</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>

        {/* Capacity */}
        <div className="md:col-span-1">
          <label className={labelCls}>Capacity</label>
          <div className="relative">
            <div className={iconWrap}>
              <Users className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setField("capacity", e.target.value)}
              className={`${baseField} ${fieldWithIconPadding}`}
              placeholder="e.g. 30"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="md:col-span-4">
          <div className="mt-6 rounded-2xl bg-white/70 border border-white/60 px-4 py-3 text-[12px] text-gray-700 shadow-sm">
            Preview:{" "}
            <span className="font-extrabold text-gray-900">{majorLabel || "Major"}</span>{" "}
            → <span className="font-extrabold text-gray-900">{form.class_name || "Class"}</span>
            {form.academic_year ? (
              <span className="ml-2 text-gray-600">
                • <b>{form.academic_year}</b>
              </span>
            ) : null}
            {form.semester ? (
              <span className="ml-2 text-gray-600">
                • Semester <b>{form.semester}</b>
              </span>
            ) : null}
            {form.shift ? (
              <span className="ml-2 text-gray-600">
                • <b>{form.shift}</b>
              </span>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end items-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold shadow-[0_18px_45px_-25px_rgba(59,130,246,0.9)] hover:opacity-95 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : editingGroup ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassGroupForm;
