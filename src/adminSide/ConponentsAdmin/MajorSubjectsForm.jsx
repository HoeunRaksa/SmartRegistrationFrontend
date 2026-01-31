import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Link2,
  Building2,
  GraduationCap,
  BookOpen,
  Hash,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { fetchMajors } from "../../api/major_api.jsx";
import { fetchSubjects } from "../../api/subject_api.jsx";
import { fetchDepartments } from "../../api/department_api.jsx";
import { createMajorSubjectsBulk } from "../../api/major_subject_api.jsx";
import { getCachedDepartments, getCachedMajors, getCachedSubjects } from "../../utils/dataCache";
import Alert from "../../gobalConponent/Alert.jsx";
import { AnimatePresence } from "framer-motion";

/* ================= ANIMATION ================= */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
};

/* ================= INITIAL STATE ================= */

const empty = {
  department_id: "",
  major_id: "",
  subject_ids: [],
  year_level: "",
  semester: "",
  is_required: true,
};

const normalizeArray = (res) => {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data;
  return Array.isArray(d) ? d : [];
};

/* ================= SMALL UI HELPERS ================= */

const baseInput =
  "w-full px-4 py-3 rounded-2xl bg-white/80 border border-white/60 shadow-sm outline-none transition-all " +
  "focus:ring-2 focus:ring-blue-400/40 focus:border-blue-300 hover:border-white/80";

const baseSelect =
  "w-full px-4 py-3 rounded-2xl bg-white/80 border border-white/60 shadow-sm outline-none transition-all " +
  "focus:ring-2 focus:ring-blue-400/40 focus:border-blue-300 hover:border-white/80";

const Label = ({ children, required = false }) => (
  <label className="block text-sm font-semibold text-gray-800 mb-2">
    {children} {required ? <span className="text-red-500">*</span> : null}
  </label>
);

const FieldWrap = ({ icon: Icon, children }) => (
  <div className="relative">
    {Icon ? (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    ) : null}
    <div className={Icon ? "pl-10" : ""}>{children}</div>
  </div>
);

/* ================= COMPONENT ================= */

const MajorSubjectsForm = ({ onSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  /* ================= LOAD DATA (FIXED: Sequential with caching) ================= */

  useEffect(() => {
    (async () => {
      try {
        // ✅ FIXED: Sequential calls with delays + caching to prevent 429 errors
        const dRes = await getCachedDepartments(fetchDepartments);
        setDepartments(normalizeArray(dRes));

        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

        const mRes = await getCachedMajors(fetchMajors);
        setMajors(normalizeArray(mRes));

        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

        const sRes = await getCachedSubjects(fetchSubjects);
        setSubjects(normalizeArray(sRes));
      } catch (err) {
        console.error(err);
        setDepartments([]);
        setMajors([]);
        setSubjects([]);
      }
    })();
  }, []);

  /* ================= HELPERS ================= */

  const subjectHasDepartmentId = useMemo(() => {
    return subjects.some(
      (s) => s && s.department_id !== undefined && s.department_id !== null
    );
  }, [subjects]);

  /* ================= FILTERED DATA ================= */

  const filteredMajors = useMemo(() => {
    if (!form.department_id) return [];
    return majors.filter((m) => String(m.department_id) === String(form.department_id));
  }, [majors, form.department_id]);

  const filteredSubjects = useMemo(() => {
    if (!form.department_id) return [];
    if (subjectHasDepartmentId) {
      return subjects.filter((s) => String(s.department_id) === String(form.department_id));
    }
    return subjects;
  }, [subjects, form.department_id, subjectHasDepartmentId]);

  const majorLabel = useMemo(() => {
    const m = majors.find((x) => String(x.id) === String(form.major_id));
    return m?.major_name ?? "";
  }, [majors, form.major_id]);

  const selectedSubjectsLabel = useMemo(() => {
    const map = new Map(subjects.map((s) => [String(s.id), s]));
    return (form.subject_ids || [])
      .map((id) => map.get(String(id))?.subject_name || `#${id}`)
      .join(", ");
  }, [subjects, form.subject_ids]);

  /* ================= HANDLERS ================= */

  const change = (key, value) => {
    setForm((prev) => {
      if (key === "department_id") {
        return { ...empty, department_id: value };
      }
      if (key === "major_id") {
        return { ...prev, major_id: value, subject_ids: [] };
      }
      return { ...prev, [key]: value };
    });
    setAlert({ show: false, message: "", type: "error" });
  };

  const toggleSubject = (id) => {
    setForm((prev) => ({
      ...prev,
      subject_ids: prev.subject_ids.includes(id)
        ? prev.subject_ids.filter((x) => x !== id)
        : [...prev.subject_ids, id],
    }));
    setAlert({ show: false, message: "", type: "error" });
  };

  const clearForm = () => {
    setForm(empty);
    setAlert({ show: false, message: "", type: "error" });
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    if (!form.department_id) return setAlert({ show: true, message: "Department is required.", type: "error" });
    if (!form.major_id) return setAlert({ show: true, message: "Major is required.", type: "error" });
    if (!form.subject_ids || form.subject_ids.length === 0)
      return setAlert({ show: true, message: "Select at least one subject.", type: "error" });

    const payload = {
      major_id: Number(form.major_id),
      subject_ids: form.subject_ids.map(Number),
      year_level: form.year_level === "" ? null : Number(form.year_level),
      semester: form.semester === "" ? null : String(form.semester).trim(),
      is_required: Boolean(form.is_required),
    };

    try {
      setSaving(true);
      await createMajorSubjectsBulk(payload);
      clearForm();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to assign subjects to major");
      setAlert({ show: true, message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <motion.div
      variants={animations.fadeUp}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-2xl shadow-[0_22px_70px_-30px_rgba(15,23,42,0.35)] p-6 md:p-7"
    >


      {/* HEADER */}
      <div className="relative flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Assign Subjects to Major
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Department → Major → Subjects (+ Year / Semester / Required)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearForm}
          className="p-2.5 rounded-2xl border border-white/60 bg-white/60 hover:bg-white/80 transition-all shadow-sm"
          aria-label="Clear form"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* WARNING */}
      {form.department_id && !subjectHasDepartmentId && (
        <div className="relative mb-4 p-3 rounded-2xl bg-yellow-50/80 border border-yellow-200 text-sm text-yellow-800">
          ⚠️ Your Subjects data has no <b>department_id</b>, so subjects cannot be
          filtered by department. (Showing all subjects)
        </div>
      )}

      {alert.show && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}

      <form onSubmit={submit} className="relative space-y-5">
        {/* DEPARTMENT */}
        <div>
          <Label required>Department</Label>
          <FieldWrap icon={Building2}>
            <select
              value={form.department_id}
              onChange={(e) => change("department_id", e.target.value)}
              className={`${baseSelect} pl-10`}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department_name || d.name || `Department #${d.id}`}
                </option>
              ))}
            </select>
          </FieldWrap>
        </div>

        {/* MAJOR */}
        <div>
          <Label required>Major</Label>
          <FieldWrap icon={GraduationCap}>
            <select
              value={form.major_id}
              onChange={(e) => change("major_id", e.target.value)}
              className={`${baseSelect} pl-10 disabled:opacity-60 disabled:cursor-not-allowed`}
              disabled={!form.department_id}
            >
              <option value="">Select Major</option>
              {filteredMajors.length === 0 && form.department_id ? (
                <option value="" disabled>
                  No majors found in this department
                </option>
              ) : null}
              {filteredMajors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.major_name || `Major #${m.id}`}
                </option>
              ))}
            </select>
          </FieldWrap>
        </div>

        {/* YEAR / SEMESTER / REQUIRED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Year</Label>
            <FieldWrap icon={Hash}>
              <input
                type="number"
                min="1"
                max="10"
                value={form.year_level}
                onChange={(e) => change("year_level", e.target.value)}
                className={`${baseInput} pl-10`}
                placeholder="e.g. 1"
              />
            </FieldWrap>
          </div>

          <div>
            <Label>Semester</Label>
            <FieldWrap icon={Calendar}>
              <select
                value={form.semester}
                onChange={(e) => change("semester", e.target.value)}
                className={`${baseSelect} pl-10`}
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </FieldWrap>
          </div>

          <div className="flex items-center gap-3 md:pt-9 pt-2">
            <input
              id="is_required"
              type="checkbox"
              checked={form.is_required}
              onChange={(e) => change("is_required", e.target.checked)}
              className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-400/40"
            />
            <label htmlFor="is_required" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-gray-500" />
              Required
            </label>
          </div>
        </div>

        {/* SUBJECTS */}
        <div>
          <Label required>
            Subjects <span className="text-gray-500 font-semibold">({form.subject_ids.length} selected)</span>
          </Label>

          <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-sm p-3">
            <div className="max-h-60 overflow-auto pr-1">
              {!form.department_id ? (
                <div className="text-sm text-gray-500 p-3">
                  Select a department to show subjects.
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-sm text-gray-500 p-3">
                  No subjects found for this department.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredSubjects.map((s) => {
                    const checked = form.subject_ids.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSubject(s.id)}
                        className={`text-left flex items-start gap-3 p-3 rounded-2xl border transition-all ${checked
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm"
                          : "bg-white/80 border-gray-200 hover:bg-white"
                          }`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border ${checked
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-300 text-transparent"
                            }`}
                        >
                          ✓
                        </span>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {s.subject_name || s.name || `Subject #${s.id}`}
                          </p>
                          {s.code ? (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              Code: {s.code}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        {(majorLabel || selectedSubjectsLabel) && (
          <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-sm p-4 text-xs text-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <p className="font-extrabold">Preview</p>
            </div>
            <div className="space-y-1.5">
              <div>
                <b>Major:</b> {majorLabel || "?"}
              </div>
              <div className="line-clamp-3">
                <b>Subjects:</b> {selectedSubjectsLabel || "?"}
              </div>
              <div>
                <b>Year:</b> {form.year_level || "-"} | <b>Semester:</b>{" "}
                {form.semester || "-"} | <b>Required:</b>{" "}
                {form.is_required ? "Yes" : "No"}
              </div>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold flex items-center justify-center gap-2 shadow-[0_18px_45px_-25px_rgba(59,130,246,0.9)] hover:shadow-[0_22px_55px_-28px_rgba(59,130,246,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Create MajorSubjects"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default MajorSubjectsForm;
