// ✅ FULL NO CUT — MajorQuotasPage.jsx
// 3 parts in ONE page:
// 1) Create / Upsert Major Quota (POST /major-quotas)
// 2) Edit Major Quota (PUT /major-quotas/{id}) via modal
// 3) Table/List with filters + pagination + delete (DELETE /major-quotas/{id})
//
// Uses:
// - fetchMajorQuotas, createMajorQuota, updateMajorQuota, deleteMajorQuota
// - fetchDepartments, fetchMajors
//
// Tailwind + framer-motion + lucide-react style similar to your Students pages.

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { fetchDepartments } from "../../../src/api/department_api.jsx";
import { fetchMajors } from "../../../src/api/major_api.jsx";

import {
  fetchMajorQuotas,
  createMajorQuota,
  updateMajorQuota,
  deleteMajorQuota,
} from "../../../src/api/major_quota_api.jsx";

import {
  GraduationCap,
  Building2,
  Calendar,
  Hash,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Loader,
  CheckCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Lock,
} from "lucide-react";

/* ================== HELPERS ================== */
const buildAcademicYears = (count = 12) => {
  const y = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => `${y + i}-${y + i + 1}`);
};

const toDateTimeLocal = (val) => {
  if (!val) return "";
  // accepts "2026-01-23 10:00:00" or ISO
  const s = String(val);
  if (s.includes("T")) return s.slice(0, 16);
  if (s.includes(" ")) {
    const [d, t] = s.split(" ");
    const hhmm = (t || "").slice(0, 5);
    return `${d}T${hhmm}`;
  }
  // date only
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00`;
  return "";
};

const fromDateTimeLocal = (val) => {
  // convert "2026-01-23T10:30" => "2026-01-23 10:30:00" (Laravel date)
  if (!val) return null;
  const s = String(val);
  if (!s.includes("T")) return s;
  const [d, t] = s.split("T");
  if (!d || !t) return null;
  return `${d} ${t}:00`;
};

const safeArray = (v) => (Array.isArray(v) ? v : []);

/* ================== ANIMATIONS ================== */
const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  },
  item: {
    hidden: { opacity: 0, y: 10, scale: 0.99 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
  },
};

/* ================== UI PARTS ================== */
const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.98 }}
    className={`flex items-start gap-3 p-4 rounded-2xl border shadow-sm ${
      type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    }`}
  >
    {type === "success" ? (
      <div className="p-1 bg-green-100 rounded-full mt-0.5">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>
    ) : (
      <div className="p-1 bg-red-100 rounded-full mt-0.5">
        <AlertCircle className="w-5 h-5 text-red-600" />
      </div>
    )}

    <div className="flex-1">
      <p className={`text-sm font-medium ${type === "success" ? "text-green-800" : "text-red-800"}`}>{message}</p>
    </div>

    {onClose && (
      <button onClick={onClose} className="text-gray-500 hover:text-gray-800" type="button">
        <X className="w-5 h-5" />
      </button>
    )}
  </motion.div>
);

const FieldShell = ({ label, icon: Icon, children, col = "" }) => (
  <div className={`space-y-1 ${col}`}>
    <label className="text-xs font-semibold text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon className="w-4 h-4" />
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ value, onChange, placeholder = "", type = "text" }) => (
  <input
    type={type}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
  />
);

const Select = ({ value, onChange, options = [], placeholder = "Select", disabled = false }) => (
  <select
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all appearance-none cursor-pointer disabled:opacity-60"
  >
    <option value="">{placeholder}</option>
    {options.map((op) => (
      <option key={String(op.value)} value={op.value}>
        {op.label}
      </option>
    ))}
  </select>
);

const PrimaryButton = ({ children, onClick, disabled, icon: Icon, className = "", type = "button" }) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
      bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg
      disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {Icon ? <Icon className="w-4 h-4" /> : null}
    {children}
  </motion.button>
);

const GhostButton = ({ children, onClick, disabled, icon: Icon, className = "" }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
      bg-white/70 border border-white/70 text-gray-800 hover:bg-white shadow-sm
      disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {Icon ? <Icon className="w-4 h-4" /> : null}
    {children}
  </motion.button>
);

/* ================== MODALS ================== */
const ConfirmModal = ({ show, title, message, confirmText = "Confirm", onConfirm, onCancel, loading }) => {
  if (!show) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={!loading ? onCancel : undefined}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-white/60"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
            <button onClick={onCancel} disabled={loading} className="text-gray-500 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const EditQuotaModal = ({
  show,
  quota,
  onClose,
  onSaved,
  majorsLookup,
  departmentsLookup,
  academicYears,
}) => {
  const [limit, setLimit] = useState("");
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show || !quota) return;
    setLimit(String(quota.limit ?? ""));
    setOpensAt(toDateTimeLocal(quota.opens_at));
    setClosesAt(toDateTimeLocal(quota.closes_at));
    setSaving(false);
    setError(null);
  }, [show, quota]);

  if (!show || !quota) return null;

  const major = majorsLookup.get(String(quota.major_id));
  const dept = major ? departmentsLookup.get(String(major.department_id)) : null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        limit: Number(limit),
        opens_at: opensAt ? fromDateTimeLocal(opensAt) : null,
        closes_at: closesAt ? fromDateTimeLocal(closesAt) : null,
      };

      await updateMajorQuota(quota.id, payload);
      onSaved?.();
      onClose?.();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update quota");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={!saving ? onClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full border border-white/60"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Edit Major Quota</h3>
              <p className="text-xs text-gray-500 mt-1">
                {dept?.name ? `${dept.name} • ` : ""}
                {major?.major_name ? major.major_name : `Major #${quota.major_id}`} • {quota.academic_year}
              </p>
            </div>
            <button onClick={onClose} disabled={saving} className="text-gray-500 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <Alert type="error" message={error} onClose={() => setError(null)} />
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <FieldShell label="Limit" icon={Hash}>
              <Input value={limit} onChange={setLimit} placeholder="e.g. 200" type="number" />
            </FieldShell>

            <FieldShell label="Opens At" icon={Clock} col="md:col-span-2">
              <Input value={opensAt} onChange={setOpensAt} type="datetime-local" />
            </FieldShell>

            <FieldShell label="Closes At" icon={Lock} col="md:col-span-2">
              <Input value={closesAt} onChange={setClosesAt} type="datetime-local" />
            </FieldShell>

            <FieldShell label="Academic Year" icon={Calendar}>
              <Select value={quota.academic_year} onChange={() => {}} options={academicYears.map((y) => ({ value: y, label: y }))} disabled />
            </FieldShell>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <GhostButton onClick={onClose} disabled={saving}>
              Cancel
            </GhostButton>
            <PrimaryButton onClick={handleSave} disabled={saving || !limit} icon={saving ? Loader : CheckCircle}>
              {saving ? "Saving..." : "Save Changes"}
            </PrimaryButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ================== MAIN PAGE ================== */
const MajorQuotasPage = () => {
  // master data
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  // quotas list
  const [quotas, setQuotas] = useState([]);
  const [loading, setLoading] = useState(true);

  // alerts
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [filterDepartmentId, setFilterDepartmentId] = useState("");
  const [filterMajorId, setFilterMajorId] = useState("");
  const [filterAcademicYear, setFilterAcademicYear] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // create/upsert form
  const academicYearOptions = useMemo(() => buildAcademicYears(12), []);
  const [createDepartmentId, setCreateDepartmentId] = useState("");
  const [createMajorId, setCreateMajorId] = useState("");
  const [createAcademicYear, setCreateAcademicYear] = useState(academicYearOptions[0] || "");
  const [createLimit, setCreateLimit] = useState("");
  const [createOpensAt, setCreateOpensAt] = useState("");
  const [createClosesAt, setCreateClosesAt] = useState("");
  const [creating, setCreating] = useState(false);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingQuota, setEditingQuota] = useState(null);

  // delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [quotaToDelete, setQuotaToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ============== LOOKUP MAPS ============== */
  const departmentsLookup = useMemo(() => {
    const m = new Map();
    safeArray(departments).forEach((d) => m.set(String(d.id), d));
    return m;
  }, [departments]);

  const majorsLookup = useMemo(() => {
    const m = new Map();
    safeArray(majors).forEach((x) => m.set(String(x.id), x));
    return m;
  }, [majors]);

  const majorsByDepartment = useMemo(() => {
    const depId = String(createDepartmentId || filterDepartmentId || "");
    if (!depId) return safeArray(majors);
    return safeArray(majors).filter((m) => String(m.department_id) === depId);
  }, [majors, createDepartmentId, filterDepartmentId]);

  const departmentOptions = useMemo(
    () => safeArray(departments).map((d) => ({ value: String(d.id), label: d.name })),
    [departments]
  );

  const majorOptionsForCreate = useMemo(() => {
    if (!createDepartmentId) return safeArray(majors).map((m) => ({ value: String(m.id), label: m.major_name }));
    return safeArray(majors)
      .filter((m) => String(m.department_id) === String(createDepartmentId))
      .map((m) => ({ value: String(m.id), label: m.major_name }));
  }, [majors, createDepartmentId]);

  const majorOptionsForFilter = useMemo(() => {
    if (!filterDepartmentId) return safeArray(majors).map((m) => ({ value: String(m.id), label: m.major_name }));
    return safeArray(majors)
      .filter((m) => String(m.department_id) === String(filterDepartmentId))
      .map((m) => ({ value: String(m.id), label: m.major_name }));
  }, [majors, filterDepartmentId]);

  /* ============== LOADERS ============== */
  const loadMasterData = useCallback(async () => {
    try {
      const [depRes, majorRes] = await Promise.all([fetchDepartments(), fetchMajors()]);
      setDepartments(safeArray(depRes?.data?.data ?? depRes?.data));
      setMajors(safeArray(majorRes?.data?.data ?? majorRes?.data));
    } catch (e) {
      console.error(e);
      setDepartments([]);
      setMajors([]);
    }
  }, []);

  const loadQuotas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMajorQuotas({});
      const list = safeArray(res?.data?.data ?? res?.data);
      setQuotas(list);
    } catch (e) {
      console.error(e);
      setQuotas([]);
      setError(e.response?.data?.message || "Failed to load major quotas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadMasterData();
      await loadQuotas();
    })();
  }, [loadMasterData, loadQuotas]);

  /* ============== FILTERED LIST ============== */
  const filteredQuotas = useMemo(() => {
    const q = safeArray(quotas);

    const s = String(search || "").trim().toLowerCase();
    const depId = String(filterDepartmentId || "");
    const majorId = String(filterMajorId || "");
    const ay = String(filterAcademicYear || "");

    return q.filter((row) => {
      const major = majorsLookup.get(String(row.major_id));
      const dept = major ? departmentsLookup.get(String(major.department_id)) : null;

      if (depId && String(major?.department_id) !== depId) return false;
      if (majorId && String(row.major_id) !== majorId) return false;
      if (ay && String(row.academic_year) !== ay) return false;

      if (!s) return true;

      const hay = [
        String(row.id ?? ""),
        String(row.academic_year ?? ""),
        String(row.limit ?? ""),
        String(row.major_id ?? ""),
        String(major?.major_name ?? ""),
        String(dept?.name ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(s);
    });
  }, [quotas, search, filterDepartmentId, filterMajorId, filterAcademicYear, majorsLookup, departmentsLookup]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDepartmentId, filterMajorId, filterAcademicYear]);

  /* ============== PAGINATION ============== */
  const totalPages = useMemo(() => Math.ceil(filteredQuotas.length / itemsPerPage) || 1, [filteredQuotas.length, itemsPerPage]);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuotas.slice(start, start + itemsPerPage);
  }, [filteredQuotas, currentPage, itemsPerPage]);

  /* ============== CREATE / UPSERT ============== */
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!createMajorId || !createAcademicYear || !createLimit) {
      setError("Please select Major, Academic Year, and enter Limit.");
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        major_id: Number(createMajorId),
        academic_year: String(createAcademicYear).trim(),
        limit: Number(createLimit),
        opens_at: createOpensAt ? fromDateTimeLocal(createOpensAt) : null,
        closes_at: createClosesAt ? fromDateTimeLocal(createClosesAt) : null,
      };

      await createMajorQuota(payload);

      setSuccess("Major quota saved successfully (create/update).");
      setCreateLimit("");
      setCreateOpensAt("");
      setCreateClosesAt("");

      await loadQuotas();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e2) {
      setError(e2.response?.data?.message || "Failed to save quota");
    } finally {
      setCreating(false);
    }
  };

  /* ============== EDIT ============== */
  const openEdit = (row) => {
    setEditingQuota(row);
    setEditOpen(true);
  };

  /* ============== DELETE ============== */
  const openDelete = (row) => {
    setQuotaToDelete(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!quotaToDelete?.id) return;
    setDeleting(true);

    try {
      await deleteMajorQuota(quotaToDelete.id);
      setSuccess("Quota deleted successfully.");
      setDeleteOpen(false);
      setQuotaToDelete(null);
      await loadQuotas();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete quota");
    } finally {
      setDeleting(false);
    }
  };

  /* ============== QUICK STATS ============== */
  const stats = useMemo(() => {
    const total = filteredQuotas.length;
    const totalAll = quotas.length;
    const uniqMajors = new Set(filteredQuotas.map((x) => String(x.major_id))).size;
    return [
      { label: "All Quotas", value: totalAll, color: "from-blue-500 to-cyan-500" },
      { label: "Filtered", value: total, color: "from-purple-500 to-pink-500" },
      { label: "Majors", value: uniqMajors, color: "from-green-500 to-emerald-500" },
    ];
  }, [filteredQuotas, quotas]);

  return (
    <div className="min-h-screen space-y-6">
      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color}`}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-600">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ALERTS ================= */}
      <AnimatePresence>
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      </AnimatePresence>

      {/* ================= CREATE / UPSERT FORM ================= */}
      <motion.div variants={animations.fadeUp} initial="hidden" animate="show" className="rounded-2xl bg-white/90 border border-white shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Create / Update Major Quota</h2>
          </div>

          <div className="flex gap-2">
            <GhostButton
              icon={RefreshCw}
              onClick={async () => {
                setError(null);
                setSuccess(null);
                await loadQuotas();
              }}
              disabled={loading}
            >
              Refresh
            </GhostButton>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FieldShell label="Department" icon={Building2}>
              <Select
                value={createDepartmentId}
                onChange={(v) => {
                  setCreateDepartmentId(v);
                  setCreateMajorId("");
                }}
                options={departmentOptions}
                placeholder="Select Department"
              />
            </FieldShell>

            <FieldShell label="Major" icon={GraduationCap}>
              <Select
                value={createMajorId}
                onChange={setCreateMajorId}
                options={majorOptionsForCreate}
                placeholder="Select Major"
                disabled={!createDepartmentId && majors.length === 0}
              />
            </FieldShell>

            <FieldShell label="Academic Year" icon={Calendar}>
              <Select
                value={createAcademicYear}
                onChange={setCreateAcademicYear}
                options={academicYearOptions.map((y) => ({ value: y, label: y }))}
                placeholder="Select Academic Year"
              />
            </FieldShell>

            <FieldShell label="Limit" icon={Hash}>
              <Input value={createLimit} onChange={setCreateLimit} placeholder="e.g. 200" type="number" />
            </FieldShell>

            <FieldShell label="Opens At (optional)" icon={Clock} col="md:col-span-1">
              <Input value={createOpensAt} onChange={setCreateOpensAt} type="datetime-local" />
            </FieldShell>

            <FieldShell label="Closes At (optional)" icon={Lock} col="md:col-span-1">
              <Input value={createClosesAt} onChange={setCreateClosesAt} type="datetime-local" />
            </FieldShell>
          </div>

          <div className="flex justify-end gap-2">
            <GhostButton
              onClick={() => {
                setCreateLimit("");
                setCreateOpensAt("");
                setCreateClosesAt("");
              }}
              disabled={creating}
            >
              Clear Time
            </GhostButton>

            <PrimaryButton type="submit" disabled={creating} icon={creating ? Loader : CheckCircle}>
              {creating ? "Saving..." : "Save Quota"}
            </PrimaryButton>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-600 bg-blue-50/60 border border-blue-200/50 rounded-xl p-3 flex items-start gap-2">
          <Filter className="w-4 h-4 text-blue-700 mt-0.5" />
          <p>
            This form uses <b>POST /major-quotas</b> and your controller does <b>updateOrCreate</b>, so it will create or
            overwrite the quota for the same <b>(major_id + academic_year)</b>.
          </p>
        </div>
      </motion.div>

      {/* ================= FILTER BAR ================= */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by department, major, academic year, limit..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/80"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Building2 className="w-4 h-4" />
              </div>
              <select
                value={filterDepartmentId}
                onChange={(e) => {
                  setFilterDepartmentId(e.target.value);
                  setFilterMajorId("");
                }}
                className="w-full rounded-xl bg-white/80 pl-10 pr-3 py-3 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Departments</option>
                {departmentOptions.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                value={filterMajorId}
                onChange={(e) => setFilterMajorId(e.target.value)}
                className="w-full rounded-xl bg-white/80 pl-10 pr-3 py-3 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Majors</option>
                {majorOptionsForFilter.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
              <select
                value={filterAcademicYear}
                onChange={(e) => setFilterAcademicYear(e.target.value)}
                className="w-full rounded-xl bg-white/80 pl-10 pr-3 py-3 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Academic Years</option>
                {academicYearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= TABLE / LIST ================= */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-white/50"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/60 bg-white/40">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-gray-900">Major Quotas</h3>
            <span className="text-xs text-gray-500">
              ({filteredQuotas.length} found / {quotas.length} total)
            </span>
          </div>

          <GhostButton
            icon={RefreshCw}
            onClick={async () => {
              setError(null);
              setSuccess(null);
              await loadQuotas();
            }}
            disabled={loading}
          >
            Reload
          </GhostButton>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader className="w-12 h-12 text-blue-600" />
            </motion.div>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
              <GraduationCap className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No quotas found</h3>
            <p className="text-gray-500">Try changing filters or create a quota above.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Major</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Academic Year</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Limit</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Opens</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Closes</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {pageItems.map((row, idx) => {
                    const major = majorsLookup.get(String(row.major_id));
                    const dept = major ? departmentsLookup.get(String(major.department_id)) : null;

                    return (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.id}</td>

                        <td className="px-6 py-4 text-sm text-gray-700">{dept?.name || "-"}</td>

                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{major?.major_name || `Major #${row.major_id}`}</div>
                          <div className="text-xs text-gray-500">major_id: {row.major_id}</div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">{row.academic_year}</td>

                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {row.limit}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-gray-600">{row.opens_at ? String(row.opens_at) : "-"}</td>
                        <td className="px-6 py-4 text-xs text-gray-600">{row.closes_at ? String(row.closes_at) : "-"}</td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEdit(row)}
                              className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openDelete(row)}
                              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                <p className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> /{" "}
                  <span className="font-semibold">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>

                  {[...Array(totalPages)].map((_, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow-lg"
                          : "border border-gray-200 hover:bg-gray-50 bg-white"
                      }`}
                    >
                      {i + 1}
                    </motion.button>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* ================= EDIT MODAL ================= */}
      <EditQuotaModal
        show={editOpen}
        quota={editingQuota}
        onClose={() => {
          setEditOpen(false);
          setEditingQuota(null);
        }}
        onSaved={async () => {
          setSuccess("Quota updated successfully.");
          await loadQuotas();
          setTimeout(() => setSuccess(null), 3000);
        }}
        majorsLookup={majorsLookup}
        departmentsLookup={departmentsLookup}
        academicYears={academicYearOptions}
      />

      {/* ================= DELETE MODAL ================= */}
      <ConfirmModal
        show={deleteOpen}
        title="Delete Major Quota"
        message={`Are you sure you want to delete quota ID ${quotaToDelete?.id ?? ""}? This cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setQuotaToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};

export default MajorQuotasPage;
