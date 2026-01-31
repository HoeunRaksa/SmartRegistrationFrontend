
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Filter,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
  RefreshCw,
  Calendar,
  Building2,
  GraduationCap,
  Clock,
  XCircle,
} from "lucide-react";

import {
  generateRegistrationReport,
  generateAndDownloadReport,
  getRegistrationSummary,
} from "../../api/registration_api";

import { fetchDepartments } from "../../api/department_api";
import { fetchMajors } from "../../api/major_api";
import Alert from "../../gobalConponent/Alert.jsx";
import { AnimatePresence } from "framer-motion";

/* ================== SAFE HELPERS ================== */

const safeNum = (v, fallback = 0) => {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeStatus = (raw) => String(raw || "PENDING").trim().toUpperCase();

const isPaidStatus = (raw) => {
  const s = normalizeStatus(raw);
  return ["PAID", "COMPLETED", "SUCCESS", "APPROVED", "DONE"].includes(s);
};

const isPendingStatus = (raw) => {
  const s = normalizeStatus(raw);
  return ["PENDING", "UNPAID", "NEW", "INIT", "PROCESSING"].includes(s);
};

const getSafe = (v, fallback = "N/A") =>
  v === null || v === undefined || v === "" ? fallback : v;

// ✅ new + old
const getSemester = (reg) =>
  reg?.period_semester ??
  reg?.semester ??
  reg?.current_semester ??
  reg?.academic_semester ??
  null;

const getAcademicYear = (reg) =>
  reg?.period_academic_year ??
  reg?.academic_year ??
  reg?.current_academic_year ??
  reg?.academicYear ??
  null;

// ✅ MOST IMPORTANT: new table first
const getPaymentStatus = (reg) =>
  reg?.period_payment_status ??
  reg?.academic_payment_status ??
  reg?.payment_status ??
  "PENDING";

const getAmount = (reg) =>
  reg?.period_tuition_amount ??
  reg?.tuition_amount ??
  reg?.payment_amount ??
  reg?.registration_fee ??
  reg?.amount ??
  0;

const getPaymentLabel = (reg) => {
  const status = normalizeStatus(getPaymentStatus(reg));
  const sem = getSemester(reg);
  const year = getAcademicYear(reg);

  const semText = sem ? `Sem ${sem}` : null;
  const yearText = year ? `${year}` : null;
  const suffix = [yearText, semText].filter(Boolean).join(" • ");

  if (isPaidStatus(status)) return suffix ? `Paid (${suffix})` : "Paid";
  if (status === "FAILED") return suffix ? `Failed (${suffix})` : "Failed";
  return suffix ? `Pending (${suffix})` : "Pending";
};

const getStudentCode = (reg) =>
  reg?.student_code ??
  reg?.student?.student_code ??
  reg?.student?.code ??
  reg?.code ??
  null;

// ✅ safest dept/major name (your API sometimes uses department_name not name)
const getDeptName = (reg) =>
  reg?.department?.department_name ??
  reg?.department?.name ??
  reg?.department_name ??
  reg?.dept_name ??
  null;

const getMajorName = (reg) =>
  reg?.major?.major_name ??
  reg?.major_name ??
  reg?.majorName ??
  null;

/* ================== MAIN ================== */

const RegistrationReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [reportData, setReportData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  const [filters, setFilters] = useState({
    department_id: "",
    major_id: "",
    payment_status: "",
    academic_year: "",
    shift: "",
    gender: "",
    date_from: "",
    date_to: "",
    semester: "", // ✅ semester-aware
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  // ✅ FIX 429: prevent overlapping + duplicate summary calls
  const summaryInFlightRef = useRef(false);
  const summaryLastKeyRef = useRef("");
  const summaryTimerRef = useRef(null);

  /* ================== OPTIONS ================== */

  const academicYearOptions = useMemo(() => {
    const now = new Date().getFullYear();
    const pastYears = 5;
    const futureYears = 5;

    const start = now - pastYears;
    const end = now + futureYears;

    const years = [];
    for (let y = start; y <= end; y++) years.push(`${y}-${y + 1}`);
    return years;
  }, []);

  const selectedDeptId = useMemo(() => {
    const v = parseInt(filters.department_id, 10);
    return Number.isFinite(v) ? v : null;
  }, [filters.department_id]);

  const visibleMajors = useMemo(() => {
    const arr = Array.isArray(majors) ? majors : [];
    if (!selectedDeptId) return arr;
    return arr.filter((m) => Number(m?.department_id) === Number(selectedDeptId));
  }, [majors, selectedDeptId]);

  /* ================== LOADERS ================== */

  const loadDepartments = useCallback(async () => {
    try {
      const res = await fetchDepartments();
      const d = res?.data?.data ?? res?.data ?? [];
      setDepartments(Array.isArray(d) ? d : []);
    } catch (err) {
      console.error("Failed to load departments:", err);
      setDepartments([]);
    }
  }, []);

  const loadMajors = useCallback(async () => {
    try {
      const res = await fetchMajors();
      const d = res?.data?.data ?? res?.data ?? [];
      setMajors(Array.isArray(d) ? d : []);
    } catch (err) {
      console.error("Failed to load majors:", err);
      setMajors([]);
    }
  }, []);

  const buildCleanPayload = useCallback((f) => {
    const payload = {};
    Object.entries(f || {}).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) payload[k] = v;
    });
    return payload;
  }, []);

  // ✅ SUMMARY payload: only send what summary endpoint needs
  const buildSummaryPayload = useCallback((f) => {
    const payload = {};
    const ay = f?.academic_year ?? "";
    const sem = f?.semester ?? "";

    if (ay !== "" && ay !== null && ay !== undefined) payload.academic_year = ay;
    if (sem !== "" && sem !== null && sem !== undefined) payload.semester = sem;

    // (optional) if later you want date range in summary, you can add here safely
    // if (f?.date_from) payload.date_from = f.date_from;
    // if (f?.date_to) payload.date_to = f.date_to;

    return payload;
  }, []);

  /**
   * ✅ loadSummary
   * - dedupe: skip if same key and not forced
   * - in-flight lock: skip overlap (prevents spam)
   * - safe empty params
   */
  const loadSummary = useCallback(
    async (overrideFilters = null, options = {}) => {
      const { force = false } = options || {};
      const base = overrideFilters || filters;

      const payload = buildSummaryPayload(base);

      // ✅ build dedupe key from payload (not from whole filters)
      const key = JSON.stringify(payload);

      if (!force && summaryLastKeyRef.current === key) return; // ✅ same params -> skip
      if (!force && summaryInFlightRef.current) return; // ✅ already calling -> skip

      summaryLastKeyRef.current = key;
      summaryInFlightRef.current = true;
      setSummaryLoading(true);

      try {
        const res = await getRegistrationSummary(payload);
        setSummaryData(res?.data?.data ?? res?.data ?? null);
      } catch (err) {
        console.error("Failed to load summary:", err);
        setSummaryData(null);
      } finally {
        summaryInFlightRef.current = false;
        setSummaryLoading(false);
      }
    },
    [filters, buildSummaryPayload]
  );

  // ✅ load base options only
  useEffect(() => {
    loadDepartments();
    loadMajors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * ✅ SINGLE debounce for summary
   * - only react to academic_year + semester (cheap, stable)
   * - clears previous timer
   * - prevents request spam (429)
   */
  useEffect(() => {
    if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current);

    summaryTimerRef.current = setTimeout(() => {
      loadSummary();
    }, 450);

    return () => {
      if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current);
    };
  }, [filters.academic_year, filters.semester, loadSummary]);

  /* ================== HANDLERS ================== */

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      if (name === "department_id") {
        return { ...prev, department_id: value, major_id: "" };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      const payload = buildCleanPayload(filters);
      const res = await generateRegistrationReport(payload);
      setReportData(res?.data?.data ?? res?.data ?? null);
    } catch (err) {
      console.error("Failed to generate report:", err);
      setAlert({ show: true, message: err?.response?.data?.message || "Failed to generate report", type: "error" });
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [buildCleanPayload, filters]);

  const downloadPDF = useCallback(async () => {
    try {
      const payload = buildCleanPayload(filters);
      await generateAndDownloadReport(payload, `registration_report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      setAlert({ show: true, message: err?.response?.data?.message || "Failed to download PDF report", type: "error" });
    }
  }, [buildCleanPayload, filters]);

  const resetFilters = useCallback(() => {
    setFilters({
      department_id: "",
      major_id: "",
      payment_status: "",
      academic_year: "",
      shift: "",
      gender: "",
      date_from: "",
      date_to: "",
      semester: "",
    });
    setReportData(null);
    setSummaryData(null);

    // ✅ reset dedupe so user can refresh again after reset
    summaryLastKeyRef.current = "";
    summaryInFlightRef.current = false;

    if (summaryTimerRef.current) {
      clearTimeout(summaryTimerRef.current);
      summaryTimerRef.current = null;
    }
  }, []);

  /* ================== RENDER ================== */

  return (
    <div className="min-h-screen space-y-6">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Registration Reports</h1>
            <p className="text-blue-100">Semester-aware reports (new payment flow + safe fallback).</p>
          </div>
          <FileText className="w-12 h-12 text-white/30" />
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Quick Summary</h2>
          </div>

          <button
            onClick={() => loadSummary(null, { force: true })}
            disabled={summaryLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/70 border border-gray-200 text-sm font-medium text-gray-800 hover:bg-white transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${summaryLoading ? "animate-spin" : ""}`} />
            Refresh Summary
          </button>
        </div>

        {summaryLoading ? (
          <div className="mt-4 text-sm text-gray-600">Loading summary...</div>
        ) : summaryData ? (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniCard icon={Users} label="Total" value={summaryData.total_registrations ?? 0} />
            <MiniCard
              icon={Users}
              label="Male / Female"
              value={`${summaryData.by_gender?.male ?? 0} / ${summaryData.by_gender?.female ?? 0}`}
            />
            <MiniCard
              icon={Clock}
              label="Pending / Completed"
              value={`${summaryData.by_payment_status?.pending ?? 0} / ${summaryData.by_payment_status?.completed ?? 0}`}
            />
            <MiniCard
              icon={DollarSign}
              label="Paid / Pending Amount"
              value={`$${safeNum(summaryData.financial?.paid_amount, 0).toFixed(2)} / $${safeNum(
                summaryData.financial?.pending_amount,
                0
              ).toFixed(2)}`}
            />
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-600">No summary data yet. Click “Refresh Summary”.</div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Report Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Department */}
          <FilterSelect
            label="Department"
            icon={<Building2 className="absolute left-3 top-2.5 w-4 h-4 text-blue-500" />}
            name="department_id"
            value={filters.department_id}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Departments" },
              ...departments.map((d) => ({
                value: d.id,
                label: d.department_name ?? d.name ?? `Department #${d.id}`,
              })),
            ]}
          />

          {/* Major */}
          <FilterSelect
            label="Major"
            icon={<GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-orange-500" />}
            name="major_id"
            value={filters.major_id}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Majors" },
              ...visibleMajors.map((m) => ({
                value: m.id,
                label: m.major_name ?? m.name ?? `Major #${m.id}`,
              })),
            ]}
          />

          {/* Payment Status */}
          <FilterSelect
            label="Payment Status"
            name="payment_status"
            value={filters.payment_status}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Status" },
              { value: "PENDING", label: "Pending" },
              { value: "COMPLETED", label: "Completed" },
              { value: "PAID", label: "Paid" },
              { value: "FAILED", label: "Failed" },
            ]}
          />

          {/* Gender */}
          <FilterSelect
            label="Gender"
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Genders" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
          />

          {/* Academic Year */}
          <FilterSelect
            label="Academic Year"
            name="academic_year"
            value={filters.academic_year}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Academic Years" },
              ...academicYearOptions.map((y) => ({ value: y, label: y })),
            ]}
          />

          {/* Semester */}
          <FilterSelect
            label="Semester"
            icon={<Clock className="absolute left-3 top-2.5 w-4 h-4 text-indigo-500" />}
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Semesters" },
              { value: "1", label: "Semester 1" },
              { value: "2", label: "Semester 2" },
            ]}
          />

          {/* Shift */}
          <FilterSelect
            label="Shift"
            name="shift"
            value={filters.shift}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Shifts" },
              { value: "Morning", label: "Morning" },
              { value: "Afternoon", label: "Afternoon" },
              { value: "Evening", label: "Evening" },
            ]}
          />

          {/* Date From */}
          <FilterDate label="Date From" name="date_from" value={filters.date_from} onChange={handleFilterChange} />

          {/* Date To */}
          <FilterDate label="Date To" name="date_to" value={filters.date_to} onChange={handleFilterChange} />
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PieChart className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Report"}
          </button>

          {reportData && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          )}

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
          >
            <XCircle className="w-4 h-4" />
            Reset
          </button>
        </div>
      </motion.div>

      {/* Stats + Table */}
      {reportData && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              icon={Users}
              label="Total Registrations"
              value={reportData.statistics?.total_registrations ?? 0}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Users}
              label="Male / Female"
              value={`${reportData.statistics?.total_male ?? 0} / ${reportData.statistics?.total_female ?? 0}`}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              icon={DollarSign}
              label="Total Amount"
              value={`$${safeNum(reportData.statistics?.total_amount, 0).toFixed(2)}`}
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Paid Amount"
              value={`$${safeNum(reportData.statistics?.paid_amount, 0).toFixed(2)}`}
              color="from-orange-500 to-orange-600"
            />
          </motion.div>

          <ReportTable registrations={reportData.registrations || []} />
        </>
      )}
    </div>
  );
};

/* ================== SMALL UI ================== */

const MiniCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white/70 rounded-xl p-4 border border-white/40 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-lg bg-blue-100">
        <Icon className="w-5 h-5 text-blue-700" />
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/40 shadow-md">
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  </div>
);

const FilterSelect = ({ label, icon, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {icon}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500`}
      >
        {options.map((o) => (
          <option key={`${name}-${o.value}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const FilterDate = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

/* ================== TABLE ================== */

const ReportTable = React.memo(function ReportTable({ registrations }) {
  const rows = Array.isArray(registrations) ? registrations : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden"
    >
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
          {rows.length} {rows.length === 1 ? "Row" : "Rows"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Major</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Academic Year</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {rows.map((reg, index) => {
              const status = normalizeStatus(getPaymentStatus(reg));
              const paid = isPaidStatus(status);
              const pending = isPendingStatus(status);

              const year = getAcademicYear(reg);
              const sem = getSemester(reg);

              const deptName = getDeptName(reg);
              const majorName = getMajorName(reg);

              const genderRaw = String(reg?.gender ?? "").trim();
              const gender =
                genderRaw.toLowerCase() === "male"
                  ? "Male"
                  : genderRaw.toLowerCase() === "female"
                    ? "Female"
                    : genderRaw || "N/A";

              return (
                <tr key={reg?.id ?? `${index}`} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{getSafe(getStudentCode(reg))}</td>

                  <td className="px-6 py-4 text-sm text-gray-900">{getSafe(reg?.full_name_en ?? reg?.full_name)}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${gender === "Male"
                        ? "bg-blue-100 text-blue-600"
                        : gender === "Female"
                          ? "bg-pink-100 text-pink-600"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {gender}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{getSafe(deptName)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{getSafe(majorName)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{getSafe(year)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {sem ? `Sem ${sem}` : "Both(1,2)"}
                  </td>


                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${paid
                        ? "bg-green-100 text-green-700"
                        : pending
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {getPaymentLabel(reg)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    ${safeNum(getAmount(reg), 0).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});

export default RegistrationReportPage;
