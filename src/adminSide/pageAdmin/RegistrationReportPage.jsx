// RegistrationReportPage.jsx (FULL NO CUT) ✅ NEW FLOW (semester-aware) + NEW DATA (student_academic_periods first) + SAFE OLD SUPPORT
import React, { useState, useEffect, useMemo, useCallback } from "react";
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

// ✅ detect semester/year fields safely (support new + old backend)
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

// ✅ MOST IMPORTANT: prefer period_payment_status first (new table), fallback old
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

// ✅ student code can be in many shapes depending on your joins
const getStudentCode = (reg) =>
  reg?.student_code ??
  reg?.student?.student_code ??
  reg?.student?.code ??
  reg?.code ??
  null;

/* ================== MAIN ================== */

const RegistrationReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [reportData, setReportData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  // ✅ default: empty filters (backend can ignore unsupported fields)
  const [filters, setFilters] = useState({
    department_id: "",
    major_id: "",
    payment_status: "",
    academic_year: "",
    shift: "",
    gender: "",
    date_from: "",
    date_to: "",
    semester: "", // ✅ semester-aware report
  });

  /* ================== OPTIONS ================== */

  const buildAcademicYears = (pastYears = 8, futureYears = 6) => {
    const now = new Date().getFullYear();
    const start = now - pastYears;
    const end = now + futureYears;

    const years = [];
    for (let y = start; y <= end; y++) years.push(`${y}-${y + 1}`);
    return years;
  };

  const academicYearOptions = useMemo(() => buildAcademicYears(5, 5), []);

  const selectedDeptId = useMemo(() => {
    const v = parseInt(filters.department_id, 10);
    return Number.isFinite(v) ? v : null;
  }, [filters.department_id]);

  // ✅ major dropdown auto filters by department if chosen
  const visibleMajors = useMemo(() => {
    if (!selectedDeptId) return majors;
    return majors.filter((m) => Number(m?.department_id) === Number(selectedDeptId));
  }, [majors, selectedDeptId]);

  /* ================== LOADERS ================== */

  const loadDepartments = useCallback(async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
      setDepartments([]);
    }
  }, []);

  const loadMajors = useCallback(async () => {
    try {
      const res = await fetchMajors();
      setMajors(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load majors:", err);
      setMajors([]);
    }
  }, []);

  // ✅ summary can be filtered by academic_year + semester (if backend supports)
  const loadSummary = useCallback(
    async (override = null) => {
      const payload = override || filters;

      setSummaryLoading(true);
      try {
        const res = await getRegistrationSummary({
          academic_year: payload.academic_year || "",
          semester: payload.semester || "",
        });
        setSummaryData(res.data?.data || null);
      } catch (err) {
        console.error("Failed to load summary:", err);
        setSummaryData(null);
      } finally {
        setSummaryLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    loadDepartments();
    loadMajors();
    loadSummary(); // optional on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ if user changes year/semester -> refresh summary automatically (small debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      loadSummary();
    }, 250);
    return () => clearTimeout(t);
  }, [filters.academic_year, filters.semester, loadSummary]);

  /* ================== HANDLERS ================== */

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      // ✅ if department changes, reset major (so invalid major won't stay selected)
      if (name === "department_id") {
        return { ...prev, department_id: value, major_id: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const buildCleanPayload = (f) => {
    // ✅ Remove empty keys so backend won't get noisy payload
    const payload = {};
    Object.entries(f || {}).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) payload[k] = v;
    });
    return payload;
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const payload = buildCleanPayload(filters);
      const res = await generateRegistrationReport(payload);
      setReportData(res.data?.data || null);
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert(err?.response?.data?.message || "Failed to generate report");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const payload = buildCleanPayload(filters);
      await generateAndDownloadReport(payload, `registration_report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      alert(err?.response?.data?.message || "Failed to download PDF report");
    }
  };

  const resetFilters = () => {
    const clean = {
      department_id: "",
      major_id: "",
      payment_status: "",
      academic_year: "",
      shift: "",
      gender: "",
      date_from: "",
      date_to: "",
      semester: "",
    };
    setFilters(clean);
    setReportData(null);
    setSummaryData(null);
  };

  /* ================== RENDER ================== */

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Registration Reports</h1>
            <p className="text-blue-100">
              Generate comprehensive reports on student registrations (semester-aware).
            </p>
          </div>
          <FileText className="w-12 h-12 text-white/30" />
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Quick Summary</h2>
          </div>

          <button
            onClick={() => loadSummary()}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Report Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-blue-500" />
              <select
                name="department_id"
                value={filters.department_id}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Major */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-orange-500" />
              <select
                name="major_id"
                value={filters.major_id}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Majors</option>
                {visibleMajors.map((major) => (
                  <option key={major.id} value={major.id}>
                    {major.major_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              name="payment_status"
              value={filters.payment_status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
            <select
              name="academic_year"
              value={filters.academic_year}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Academic Years</option>
              {academicYearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 w-4 h-4 text-indigo-500" />
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </div>

          {/* Shift */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
            <select
              name="shift"
              value={filters.shift}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="date"
                name="date_from"
                value={filters.date_from}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="date"
                name="date_to"
                value={filters.date_to}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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

      {/* Statistics + Table */}
      {reportData && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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

/* ================== UI SMALL COMPONENTS ================== */

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

/* ================== TABLE ================== */

const ReportTable = ({ registrations }) => {
  // ✅ normalize rows (works for old nested models OR new join flat rows)
  const rows = Array.isArray(registrations) ? registrations : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
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

              // department/major can be nested OR flat join
              const deptName = reg?.department?.name ?? reg?.department_name ?? null;
              const majorName = reg?.major?.major_name ?? reg?.major_name ?? null;

              return (
                <tr key={reg?.id || index} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {getSafe(getStudentCode(reg))}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">{getSafe(reg?.full_name_en)}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        reg?.gender === "Male"
                          ? "bg-blue-100 text-blue-600"
                          : reg?.gender === "Female"
                          ? "bg-pink-100 text-pink-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getSafe(reg?.gender)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{getSafe(deptName)}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">{getSafe(majorName)}</td>

                  <td className="px-6 py-4 text-sm text-gray-700">{getSafe(year)}</td>

                  <td className="px-6 py-4 text-sm text-gray-700">{sem ? `Sem ${sem}` : "N/A"}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        paid
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
};

export default RegistrationReportPage;
