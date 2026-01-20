import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Save, X, Link2 } from "lucide-react";
import { fetchMajors } from "../../api/major_api.jsx";
import { fetchSubjects } from "../../api/subject_api.jsx";
import { fetchDepartments } from "../../api/department_api.jsx";
import { createMajorSubjectsBulk } from "../../api/major_subject_api.jsx";

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

/* ================= COMPONENT ================= */

const MajorSubjectsForm = ({ onSuccess }) => {
    const [departments, setDepartments] = useState([]);
    const [majors, setMajors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    /* ================= LOAD DATA ================= */

    useEffect(() => {
        (async () => {
            try {
                const [dRes, mRes, sRes] = await Promise.all([
                    fetchDepartments(),
                    fetchMajors(),
                    fetchSubjects(),
                ]);

                setDepartments(normalizeArray(dRes));
                setMajors(normalizeArray(mRes));
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
        return majors.filter(
            (m) => String(m.department_id) === String(form.department_id)
        );
    }, [majors, form.department_id]);

    const filteredSubjects = useMemo(() => {
        if (!form.department_id) return [];

        if (subjectHasDepartmentId) {
            return subjects.filter(
                (s) => String(s.department_id) === String(form.department_id)
            );
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
                return {
                    ...empty,
                    department_id: value,
                };
            }

            if (key === "major_id") {
                return {
                    ...prev,
                    major_id: value,
                    subject_ids: [],
                };
            }

            return { ...prev, [key]: value };
        });

        setError("");
    };

    const toggleSubject = (id) => {
        setForm((prev) => ({
            ...prev,
            subject_ids: prev.subject_ids.includes(id)
                ? prev.subject_ids.filter((x) => x !== id)
                : [...prev.subject_ids, id],
        }));
        setError("");
    };

    const clearForm = () => {
        setForm(empty);
        setError("");
    };

    /* ================= SUBMIT ================= */

    const submit = async (e) => {
        e.preventDefault();

        if (!form.department_id) {
            setError("Department is required.");
            return;
        }

        if (!form.major_id) {
            setError("Major is required.");
            return;
        }

        if (!form.subject_ids || form.subject_ids.length === 0) {
            setError("Select at least one subject.");
            return;
        }

        // ✅ IMPORTANT: year_level should be number or null, semester string or null
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
            setError(msg);
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
            className="rounded-2xl bg-white/40 backdrop-blur-sm border border-white/40 shadow-lg p-6"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                        <Link2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Assign Subjects to Major
                        </h2>
                        <p className="text-xs text-gray-600">
                            Department → Major → Subjects (+ Year / Semester / Required)
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={clearForm}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* WARNING */}
            {form.department_id && !subjectHasDepartmentId && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    ⚠️ Your Subjects data has no <b>department_id</b>, so subjects cannot be
                    filtered by department. (Showing all subjects)
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* DEPARTMENT */}
                <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <select
                        value={form.department_id}
                        onChange={(e) => change("department_id", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border"
                    >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.department_name || d.name || `Department #${d.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* MAJOR */}
                <div>
                    <label className="block text-sm font-medium mb-2">Major *</label>
                    <select
                        value={form.major_id}
                        onChange={(e) => change("major_id", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border"
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
                </div>

                {/* YEAR / SEMESTER / REQUIRED (FORM DATA FIELDS YOU ASKED) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={form.year_level}
                            onChange={(e) => change("year_level", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border"
                            placeholder="e.g. 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Semester</label>
                        <select
                            value={form.semester}
                            onChange={(e) => change("semester", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border"
                        >
                            <option value="">Select Semester</option>
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 pt-8">
                        <input
                            id="is_required"
                            type="checkbox"
                            checked={form.is_required}
                            onChange={(e) => change("is_required", e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="is_required" className="text-sm text-gray-700">
                            Required
                        </label>
                    </div>
                </div>

                {/* SUBJECTS */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Subjects * ({form.subject_ids.length} selected)
                    </label>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-auto border rounded-lg p-3 bg-white">
                        {!form.department_id ? (
                            <div className="text-sm text-gray-500">
                                Select a department to show subjects.
                            </div>
                        ) : filteredSubjects.length === 0 ? (
                            <div className="text-sm text-gray-500">
                                No subjects found for this department.
                            </div>
                        ) : (
                            filteredSubjects.map((s) => (
                                <label
                                    key={s.id}
                                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${form.subject_ids.includes(s.id)
                                            ? "bg-blue-50 border-blue-300"
                                            : "bg-white border-gray-200"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.subject_ids.includes(s.id)}
                                        onChange={() => toggleSubject(s.id)}
                                    />
                                    <span className="text-sm">
                                        {s.subject_name || s.name || `Subject #${s.id}`}
                                    </span>
                                </label>
                            ))
                        )}
                    </div>
                </div>

                {/* PREVIEW */}
                {(majorLabel || selectedSubjectsLabel) && (
                    <div className="text-xs bg-white/60 border rounded-lg p-3">
                        <div>
                            <b>Major:</b> {majorLabel || "?"}
                        </div>
                        <div>
                            <b>Subjects:</b> {selectedSubjectsLabel || "?"}
                        </div>
                        <div>
                            <b>Year:</b> {form.year_level || "-"} | <b>Semester:</b>{" "}
                            {form.semester || "-"} | <b>Required:</b>{" "}
                            {form.is_required ? "Yes" : "No"}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Create MajorSubjects"}
                </button>
            </form>
        </motion.div>
    );
};

export default MajorSubjectsForm;
