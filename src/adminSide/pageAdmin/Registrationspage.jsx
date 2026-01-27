// RegistrationPage.jsx (FULL NO CUT) ✅ + ADD CASH PAY OPTIONS (SEM1 / SEM2 / YEAR) WITHOUT CHANGING ENDPOINTS
import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
  useDeferredValue,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchRegistrations,
  adminGenerateQr,
  markPaidCash,
} from "../../api/registration_api";
import { fetchDepartments } from "../../api/department_api";
import { fetchMajors } from "../../api/major_api";
import RegistrationReportPage from "./RegistrationReportPage";
import PaymentForm from "../../Components/payment/PaymentForm.jsx";
import { ToastContext } from "../../Components/Context/ToastProvider.jsx";
import { staggeredRequests } from "../../utils/apiThrottle";
import { getCachedDepartments, getCachedMajors } from "../../utils/dataCache";
import { createPortal } from "react-dom";

import {
  Users,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Grid3x3,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  X,
  DollarSign,
  Search,
  FileText,
  RefreshCw,
  QrCode,
  Eye,
  CalendarDays,
  Layers,
} from "lucide-react";

/* ================== SAFE HELPERS (NEW DATA + OLD DATA SUPPORT) ================== */

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

// ✅ Detect semester/year fields safely (support old/new backend)
const getSemester = (reg) =>
  reg?.period_semester ??
  reg?.semester ??
  reg?.current_semester ??
  reg?.academic_semester ??
  null;

const getAcademicYear = (reg) =>
  reg?.academic_year ??
  reg?.period_academic_year ??
  reg?.current_academic_year ??
  reg?.academicYear ??
  null;

// ✅ MOST IMPORTANT: prefer period_payment_status first (new table), fallback old table
const getPaymentStatus = (reg) =>
  reg?.period_payment_status ??
  reg?.academic_payment_status ??
  reg?.payment_status ??
  "PENDING";

const getPaidAt = (reg) =>
  reg?.period_paid_at ?? reg?.paid_at ?? reg?.payment_date ?? null;

// ✅ Amount should show period tuition first, fallback to major fee, etc.
const getAmount = (reg) =>
  reg?.period_tuition_amount ??
  reg?.tuition_amount ??
  reg?.payment_amount ??
  reg?.registration_fee ??
  reg?.amount ??
  0;

// ✅ Pretty label: Paid (2026-2027 • Sem 1)
const getPaymentLabel = (reg) => {
  const status = normalizeStatus(getPaymentStatus(reg));
  const sem = getSemester(reg);
  const year = getAcademicYear(reg);

  const semText = sem ? `Sem ${sem}` : null;
  const yearText = year ? `${year}` : null;
  const suffix = [yearText, semText].filter(Boolean).join(" • ");

  if (isPaidStatus(status)) return suffix ? `Paid (${suffix})` : "Paid";
  return suffix ? `Pending (${suffix})` : "Pending";
};

// ✅ image helper
const getProfileImage = (reg) =>
  reg?.profile_picture_url ||
  reg?.profile_picture_path ||
  reg?.profile_picture ||
  null;

// ✅ SHOW REAL AXIOS ERROR (IMPORTANT)
const extractAxiosError = (e) => {
  // No response => network / CORS / DNS / wrong baseURL
  if (!e?.response) {
    return {
      status: null,
      msg: e?.message || "No response (Network/CORS/baseURL issue)",
      details: e?.code || "",
      raw: {
        message: e?.message,
        code: e?.code,
        config_url: e?.config?.url,
        config_baseURL: e?.config?.baseURL,
        method: e?.config?.method,
      },
    };
  }

  const status = e.response.status;
  const data = e.response.data;

  let msg =
    data?.message ||
    data?.error ||
    (typeof data === "string" ? data : null) ||
    e.message ||
    "Request failed";

  let details = "";
  if (data?.errors && typeof data.errors === "object") {
    const flat = Object.values(data.errors).flat().filter(Boolean).join(" | ");
    if (flat) details = flat;
  }

  return { status, msg, details, raw: data };
};

/* ================== CASH PAYMENT OPTIONS HELPERS ================== */

const CASH_OPTIONS = {
  SEM1: { label: "Pay Semester 1", semesters: [1] },
  SEM2: { label: "Pay Semester 2", semesters: [2] },
  YEAR: { label: "Pay Full Year (Sem 1 + Sem 2)", semesters: [1, 2] },
};

// Mark paid cash for chosen option WITHOUT changing endpoints.
// If backend returns 409 "already paid", we treat as OK and continue.
const markPaidCashByOption = async ({ registrationId, optionKey }) => {
  const opt = CASH_OPTIONS[optionKey] || CASH_OPTIONS.SEM1;
  const semesters = opt.semesters;

  const results = [];
  for (const sem of semesters) {
    try {
      const res = await markPaidCash(registrationId, sem);
      results.push({ sem, ok: true, res });
    } catch (e) {
      const err = extractAxiosError(e);

      // if already paid, treat as ok
      if (err.status === 409) {
        results.push({ sem, ok: true, already: true, err });
        continue;
      }

      // real failure stops (so admin sees error)
      results.push({ sem, ok: false, err });
      throw { optionKey, sem, err, results };
    }
  }

  return results;
};

/* ================== COMPONENT ================== */

const RegistrationPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filter, setFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const [showReportModal, setShowReportModal] = useState(false);

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");

  // dropdown data
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  // QR modal
  const [showAdminQr, setShowAdminQr] = useState(false);
  const [adminQrReg, setAdminQrReg] = useState(null);

  // ✅ semester selector (admin list view)
  const [selectedSemester, setSelectedSemester] = useState("1");

  const toast = useContext(ToastContext);

  /* ================== PERFORMANCE CORE ================== */

  // cache registrations by semester so switching is instant
  const semesterCacheRef = useRef(new Map()); // key: "1" | "2" => array
  const latestReqIdRef = useRef(0);

  const selectedDeptId = useMemo(() => {
    const v = parseInt(selectedDepartment, 10);
    return Number.isFinite(v) ? v : null;
  }, [selectedDepartment]);

  const selectedMajorId = useMemo(() => {
    const v = parseInt(selectedMajor, 10);
    return Number.isFinite(v) ? v : null;
  }, [selectedMajor]);

  const selectedSemesterInt = useMemo(() => {
    const v = parseInt(selectedSemester, 10);
    return Number.isFinite(v) ? v : 1;
  }, [selectedSemester]);

  const loadRegistrationsOnly = useCallback(
    async (opts = { preferCache: true }) => {
      const semKey = String(selectedSemesterInt);

      // instant from cache
      if (opts?.preferCache && semesterCacheRef.current.has(semKey)) {
        setRegistrations(semesterCacheRef.current.get(semKey) || []);
        setLoading(false);
      } else {
        setLoading(true);
      }

      const reqId = ++latestReqIdRef.current;

      try {
        const regRes = await fetchRegistrations({ semester: selectedSemesterInt });
        if (reqId !== latestReqIdRef.current) return;

        const regData = regRes.data?.data || regRes.data || [];
        const arr = Array.isArray(regData) ? regData : [];

        semesterCacheRef.current.set(semKey, arr);
        setRegistrations(arr);
      } catch (error) {
        if (reqId !== latestReqIdRef.current) return;
        console.error("Failed to load registrations:", error);
        setRegistrations([]);
        toast?.error?.("Failed to load registrations");
      } finally {
        if (reqId === latestReqIdRef.current) setLoading(false);
      }
    },
    [selectedSemesterInt, toast]
  );

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);

      const semKey = String(selectedSemesterInt);

      // ✅ FIXED: Staggered requests instead of Promise.all (prevents 429)
      // Registrations load first, then departments/majors with delays + caching
      const [regRes, deptRes, majorRes] = await staggeredRequests([
        () => fetchRegistrations({ semester: selectedSemesterInt }),
        () => getCachedDepartments(fetchDepartments),
        () => getCachedMajors(fetchMajors),
      ], 150); // 150ms delay between each request

      const regData = regRes.data?.data || regRes.data || [];
      const deptData = deptRes.data?.data || deptRes.data || [];
      const majorData = majorRes.data?.data || majorRes.data || [];

      const regArr = Array.isArray(regData) ? regData : [];
      semesterCacheRef.current.set(semKey, regArr);

      setRegistrations(regArr);
      setDepartments(Array.isArray(deptData) ? deptData : []);
      setMajors(Array.isArray(majorData) ? majorData : []);
    } catch (error) {
      console.error("Failed to load data:", error);
      setRegistrations([]);
      setDepartments([]);
      setMajors([]);
      toast?.error?.("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [selectedSemesterInt, toast]);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reload when semester changes (cache first + small debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      loadRegistrationsOnly({ preferCache: true });
    }, 120);
    return () => clearTimeout(t);
  }, [selectedSemesterInt, loadRegistrationsOnly]);

  // ✅ normalized list (fast search + fast filters)
  const normalizedRegistrations = useMemo(() => {
    const list = Array.isArray(registrations) ? registrations : [];
    return list.map((r) => {
      const searchBlob = [
        r?.full_name_en,
        r?.full_name_kh,
        r?.personal_email,
        r?.phone_number,
        r?.student_code,
        r?.department_name,
        r?.major_name,
        r?.academic_year,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return {
        ...r,
        _search: searchBlob,
        _deptId: r?.department_id ?? null,
        _majorId: r?.major_id ?? null,
        _statusUpper: normalizeStatus(getPaymentStatus(r)),
      };
    });
  }, [registrations]);

  // ✅ filtered list
  const filteredRegistrations = useMemo(() => {
    const s = String(deferredSearch || "").trim().toLowerCase();
    const list = normalizedRegistrations;

    return list.filter((reg) => {
      const status = reg._statusUpper;

      const statusMatch =
        filter === "all"
          ? true
          : filter === "paid"
            ? isPaidStatus(status)
            : filter === "pending"
              ? isPendingStatus(status) && !isPaidStatus(status)
              : true;

      const searchMatch = s ? reg._search.includes(s) : true;

      const deptMatch =
        selectedDeptId == null ? true : reg._deptId === selectedDeptId;

      const majorMatch =
        selectedMajorId == null ? true : reg._majorId === selectedMajorId;

      return statusMatch && searchMatch && deptMatch && majorMatch;
    });
  }, [
    normalizedRegistrations,
    deferredSearch,
    filter,
    selectedDeptId,
    selectedMajorId,
  ]);

  // ✅ summary
  const summary = useMemo(() => {
    let total = 0;
    let paid = 0;
    let pending = 0;
    let revenue = 0;

    for (const r of filteredRegistrations) {
      total++;
      if (isPaidStatus(r._statusUpper)) {
        paid++;
        revenue += safeNum(getAmount(r), 0);
      } else {
        pending++;
      }
    }

    return { total, paid, pending, revenue };
  }, [filteredRegistrations]);

  const quickStats = useMemo(() => {
    return [
      {
        label: "Total",
        value: summary.total,
        color: "from-blue-500 to-cyan-500",
        icon: Users,
      },
      {
        label: "Paid",
        value: summary.paid,
        color: "from-green-500 to-emerald-500",
        icon: CheckCircle,
      },
      {
        label: "Pending",
        value: summary.pending,
        color: "from-orange-500 to-red-500",
        icon: Clock,
      },
      {
        label: "Revenue",
        value: `$${summary.revenue.toFixed(2)}`,
        color: "from-purple-500 to-pink-500",
        icon: DollarSign,
      },
    ];
  }, [summary]);

  const onView = useCallback((reg) => setSelectedRegistration(reg), []);
  const onCloseDetail = useCallback(() => setSelectedRegistration(null), []);
  const onOpenReport = useCallback(() => setShowReportModal(true), []);
  const onCloseReport = useCallback(() => setShowReportModal(false), []);

  // ✅ manual refresh (and clear cache for the current semester)
  const handleRefresh = useCallback(async () => {
    semesterCacheRef.current.delete(String(selectedSemesterInt));
    await loadRegistrationsOnly({ preferCache: false });
    toast?.success?.("Refreshed");
  }, [selectedSemesterInt, loadRegistrationsOnly, toast]);

  return (
    <div className="min-h-screen space-y-6">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
          <p className="text-sm text-gray-500">
            View payment status by semester (uses new{" "}
            <span className="font-semibold">student_academic_periods</span>{" "}
            first).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-800">Refresh</span>
          </button>

          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-semibold">Create Report</span>
          </button>
        </div>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FILTERS & SEARCH ================= */}
      <div className="bg-white/40 rounded-2xl p-4 border border-white/40 shadow-md backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone, student code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Department */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedMajor("all");
                }}
                className="px-3 py-2 bg-white/60 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Major */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange-500" />
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="px-3 py-2 bg-white/60 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Majors</option>
                {majors
                  .filter(
                    (major) =>
                      selectedDepartment === "all" ||
                      major.department_id === parseInt(selectedDepartment, 10)
                  )
                  .map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.major_name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Semester */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 bg-white/60 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            {/* Status buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filter === "all"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white/60 text-gray-700 hover:bg-white/80"
                  }`}
              >
                All ({registrations.length})
              </button>

              <button
                onClick={() => setFilter("paid")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${filter === "paid"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white/60 text-gray-700 hover:bg-white/80"
                  }`}
              >
                <CheckCircle className="w-4 h-4" />
                Paid
              </button>

              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${filter === "pending"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white/60 text-gray-700 hover:bg-white/80"
                  }`}
              >
                <Clock className="w-4 h-4" />
                Pending
              </button>
            </div>

            {/* Clear */}
            {(searchTerm ||
              selectedDepartment !== "all" ||
              selectedMajor !== "all" ||
              filter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("all");
                    setSelectedMajor("all");
                    setFilter("all");
                  }}
                  className="px-4 py-2 rounded-xl font-medium text-sm bg-gray-500 text-white hover:bg-gray-600 shadow-lg transition-all flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
          </div>
        </div>
      </div>

      {/* ================= LIST ================= */}
      <RegistrationsList
        registrations={filteredRegistrations}
        loading={loading}
        onView={onView}
        getPaymentLabel={getPaymentLabel}
        getAmount={getAmount}
      />

      {/* ================= ADMIN QR MODAL ================= */}
      {showAdminQr && adminQrReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <PaymentForm
            registrationId={adminQrReg.id}
            yearFee={safeNum(
              adminQrReg?.registration_fee ??
              adminQrReg?.period_tuition_amount ??
              0,
              0
            )}
            amount={safeNum(getAmount(adminQrReg), 0)}
            payPlan={{ type: "SEMESTER", semester: selectedSemesterInt }}
            registrationData={{
              data: {
                registration_id: adminQrReg.id,
                payment_amount: safeNum(getAmount(adminQrReg), 0),
              },
            }}
            onClose={() => {
              setShowAdminQr(false);
              setAdminQrReg(null);
            }}
            onSuccess={async () => {
              setShowAdminQr(false);
              setAdminQrReg(null);
              semesterCacheRef.current.delete(String(selectedSemesterInt));
              await loadRegistrationsOnly({ preferCache: false });
            }}
          />
        </div>
      )}

      {/* ================= DETAIL MODAL ================= */}
      {selectedRegistration && (
        <RegistrationModal
          registration={selectedRegistration}
          onClose={onCloseDetail}
          onRefresh={async () => {
            semesterCacheRef.current.delete(String(selectedSemesterInt));
            await loadRegistrationsOnly({ preferCache: false });
          }}
          onOpenQr={(reg) => {
            setAdminQrReg(reg);
            setShowAdminQr(true);
          }}
          toast={toast}
          selectedSemester={selectedSemesterInt}
          getPaidAt={getPaidAt}
          getAmount={getAmount}
          getPaymentLabel={getPaymentLabel} // ✅ FIX: PASS THIS
        />
      )}

      {/* ================= REPORT MODAL ================= */}
      {showReportModal && <ReportModal onClose={onCloseReport} />}
    </div>
  );
};

/* ================== REPORT MODAL ================== */
const ReportModal = ({ onClose }) => {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="absolute inset-0 grid place-items-center p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[95vw] max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto p-6">
              <RegistrationReportPage />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};







/* ================== LIST ================== */

const RegistrationsList = React.memo(function RegistrationsList({
  registrations,
  loading,
  onView,
  getPaymentLabel,
  getAmount,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-12 text-center">
        <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4">
          <Users className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600">Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              All Registrations
            </h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
            {registrations.length}{" "}
            {registrations.length === 1 ? "Result" : "Results"}
          </span>
        </div>
      </div>

      {registrations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Major
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {registrations.map((reg) => (
                <RegistrationRow
                  key={reg.id}
                  registration={reg}
                  onView={onView}
                  getPaymentLabel={getPaymentLabel}
                  getAmount={getAmount}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Users className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No registrations found</p>
    <p className="text-sm text-gray-400 mt-1">
      Try adjusting your filters or search term
    </p>
  </div>
);

const RegistrationRow = React.memo(function RegistrationRow({
  registration,
  onView,
  getPaymentLabel,
  getAmount,
}) {
  const statusUpper = normalizeStatus(getPaymentStatus(registration));
  const paid = isPaidStatus(statusUpper);
  const statusLabel = getPaymentLabel(registration);

  const profileImage = getProfileImage(registration);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.06)" }}
      className="bg-white/70 hover:bg-blue-50/60 transition-colors cursor-pointer"
      onClick={() => onView(registration)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm border-2 border-gray-200">
          {profileImage ? (
            <img
              src={profileImage}
              alt={registration.full_name_en}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {registration.full_name_en}
          </p>
          {registration.full_name_kh && (
            <p className="text-xs text-gray-500 mt-0.5">
              {registration.full_name_kh}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">ID: {registration.id}</p>
          {registration.student_code && (
            <p className="text-xs text-gray-400 mt-0.5">
              Student: {registration.student_code}
            </p>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          {registration.personal_email && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span className="truncate max-w-[200px]">
                {registration.personal_email}
              </span>
            </div>
          )}
          {registration.phone_number && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span>{registration.phone_number}</span>
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        {registration.department_name ? (
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              {registration.department_name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400"></span>
        )}
      </td>

      <td className="px-6 py-4">
        {registration.major_name ? (
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              {registration.major_name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400"></span>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-800">
            ${safeNum(getAmount(registration), 0).toFixed(2)}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {paid ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            {statusLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
            <Clock className="w-3.5 h-3.5" />
            {statusLabel}
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(registration);
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      </td>
    </motion.tr>
  );
});

/* ================== DETAIL MODAL ================== */

const RegistrationModal = ({
  registration,
  onClose,
  onRefresh,
  onOpenQr,
  toast,
  selectedSemester,
  getPaidAt,
  getAmount,
  getPaymentLabel, // ✅ FIX
}) => {
  // IMPORTANT: for modal, use SAME logic (period first)
  const statusUpper = normalizeStatus(getPaymentStatus(registration));
  const isPaid = isPaidStatus(statusUpper);

  const profileImage = getProfileImage(registration);

  const label = getPaymentLabel(registration);
  const year = getAcademicYear(registration);
  const sem = selectedSemester; // show admin selected semester (list context)

  // ✅ prevent 429 / double submit
  const [generatingQr, setGeneratingQr] = useState(false);
  const [payingCash, setPayingCash] = useState(false);

  // ✅ cash option modal
  const [showCashOption, setShowCashOption] = useState(false);
  const [cashOption, setCashOption] = useState(
    selectedSemester === 2 ? "SEM2" : "SEM1"
  );

  // hard lock (instant, even before state update)
  const cashLockRef = useRef(false);
  const qrLockRef = useRef(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-3xl w-full max-h-[78vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Header */}
          <div
            className={`sticky top-0 p-6 z-10 ${isPaid
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-orange-500 to-red-600"
              }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg flex-shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={registration.full_name_en}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Registration Details
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-white/80">
                    ID: {registration.id}
                  </span>

                  {registration.student_code && (
                    <span className="text-sm text-white/80">
                      • Student: {registration.student_code}
                    </span>
                  )}

                  <span className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">
                    {isPaid ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        {label}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        {label}
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs text-white/80 mt-2">
                  Showing status for:{" "}
                  <span className="font-semibold">{year || ""}</span> •{" "}
                  <span className="font-semibold">Sem {sem || ""}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <Section title="Personal Information">
              <InfoGrid>
                <InfoField
                  label="Full Name (EN)"
                  value={registration.full_name_en}
                />
                <InfoField
                  label="Full Name (KH)"
                  value={registration.full_name_kh}
                />
                <InfoField label="Gender" value={registration.gender} />
                <InfoField
                  label="Date of Birth"
                  value={registration.date_of_birth}
                />
                <InfoField label="Email" value={registration.personal_email} />
                <InfoField label="Phone" value={registration.phone_number} />
                <InfoField
                  label="Address"
                  value={registration.address}
                  fullWidth
                />
                <InfoField
                  label="Current Address"
                  value={registration.current_address}
                  fullWidth
                />
              </InfoGrid>
            </Section>

            <Section title="Education Information">
              <InfoGrid>
                <InfoField
                  label="High School"
                  value={registration.high_school_name}
                />
                <InfoField
                  label="Graduation Year"
                  value={registration.graduation_year}
                />
                <InfoField
                  label="Grade 12 Result"
                  value={registration.grade12_result}
                />
                <InfoField
                  label="Department"
                  value={registration.department_name}
                />
                <InfoField label="Major" value={registration.major_name} />
                <InfoField label="Faculty" value={registration.faculty} />
                <InfoField label="Shift" value={registration.shift} />
                <InfoField label="Batch" value={registration.batch} />
                <InfoField
                  label="Academic Year"
                  value={registration.academic_year}
                />
              </InfoGrid>
            </Section>

            <Section title="Parent/Guardian Information">
              <InfoGrid>
                <InfoField
                  label="Father's Name"
                  value={registration.father_name}
                />
                <InfoField
                  label="Father's Phone"
                  value={registration.fathers_phone_number}
                />
                <InfoField
                  label="Mother's Name"
                  value={registration.mother_name}
                />
                <InfoField
                  label="Mother's Phone"
                  value={registration.mother_phone_number}
                />
                <InfoField
                  label="Guardian Name"
                  value={registration.guardian_name}
                />
                <InfoField
                  label="Guardian Phone"
                  value={registration.guardian_phone_number}
                />
              </InfoGrid>
            </Section>

            <Section title="Payment Information">
              <div
                className={`p-4 rounded-2xl border ${isPaid
                    ? "bg-green-50 border-green-200"
                    : "bg-orange-50 border-orange-200"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${isPaid ? "bg-green-500" : "bg-orange-500"
                        }`}
                    >
                      {isPaid ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Clock className="w-5 h-5 text-white" />
                      )}
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${isPaid ? "text-green-700" : "text-orange-700"
                          }`}
                      >
                        {isPaid ? "Payment Completed" : "Payment Pending"}
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        Amount:{" "}
                        <span className="font-semibold">
                          ${safeNum(getAmount(registration), 0).toFixed(2)}
                        </span>
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Academic Year:{" "}
                        <span className="font-semibold">{year || ""}</span> •
                        Semester:{" "}
                        <span className="font-semibold">{sem || ""}</span>
                      </p>
                    </div>
                  </div>

                  {isPaid && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Paid on</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {getPaidAt(registration) || "Date unavailable"}
                      </p>
                    </div>
                  )}
                </div>

                {!isPaid && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      disabled={generatingQr}
                      onClick={async () => {
                        if (qrLockRef.current) return;
                        qrLockRef.current = true;

                        if (generatingQr) return;
                        setGeneratingQr(true);
                        try {
                          await adminGenerateQr(
                            registration.id,
                            Number(selectedSemester) || 1
                          );
                          toast?.success?.("QR generated successfully");
                          onOpenQr(registration);
                        } catch (e) {
                          const err = extractAxiosError(e);
                          console.log("GenerateQR FULL:", err);
                          toast?.error?.(
                            `${err.status ?? "NO-HTTP"} ${err.msg}${err.details ? " • " + err.details : ""
                              }`.trim()
                          );

                          // if already paid, refresh so it becomes PAID
                          if (err.status === 409) {
                            await onRefresh();
                            onClose();
                          }
                        } finally {
                          setGeneratingQr(false);
                          qrLockRef.current = false;
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-colors ${generatingQr
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      <QrCode className="w-4 h-4" />
                      {generatingQr ? "Generating..." : "Generate QR"}
                    </button>

                    {/* ✅ NEW: OPEN FORM WITH 3 OPTIONS (SEM1 / SEM2 / YEAR) */}
                    <button
                      disabled={payingCash}
                      onClick={() => {
                        // open option form; no confirm popup
                        setCashOption(selectedSemester === 2 ? "SEM2" : "SEM1");
                        setShowCashOption(true);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-colors ${payingCash
                          ? "bg-green-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Paid (Cash)
                    </button>

                    <button
                      onClick={onRefresh}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Status
                    </button>
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* ================= CASH OPTION MODAL ================= */}
          {showCashOption && (
            <CashPayOptionModal
              registration={registration}
              defaultOption={cashOption}
              onClose={() => setShowCashOption(false)}
              onSubmit={async (optionKey) => {
                if (cashLockRef.current) return;
                cashLockRef.current = true;

                if (payingCash) return;
                setPayingCash(true);

                try {
                  await markPaidCashByOption({
                    registrationId: registration.id,
                    optionKey,
                  });

                  // keep your toast behavior (same success)
                  toast?.success?.("Marked as PAID (Cash)");

                  // refresh data after success
                  await onRefresh();
                  setShowCashOption(false);
                  onClose();
                } catch (payload) {
                  const err = payload?.err || payload;
                  const e = err?.status ? err : extractAxiosError(err);

                  console.error("Mark paid cash error:", e.status, e.raw);
                  toast?.error?.(
                    `${e.status || ""} ${e.msg}${e.details ? " • " + e.details : ""
                      }`.trim()
                  );
                } finally {
                  setPayingCash(false);
                  cashLockRef.current = false;
                }
              }}
              busy={payingCash}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ================== CASH OPTION MODAL UI ================== */

const CashPayOptionModal = ({
  registration,
  defaultOption = "SEM1",
  onClose,
  onSubmit,
  busy,
}) => {
  const [choice, setChoice] = useState(defaultOption);

  const year = getAcademicYear(registration);
  const amount = safeNum(getAmount(registration), 0);

  const items = [
    { key: "SEM1", icon: CalendarDays, title: "Semester 1", desc: "Mark PAID for semester 1 only." },
    { key: "SEM2", icon: CalendarDays, title: "Semester 2", desc: "Mark PAID for semester 2 only." },
    { key: "YEAR", icon: Layers, title: "Full Year (Sem 1 + Sem 2)", desc: "Mark PAID for both semesters (calls endpoint twice)." },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Mark Paid (Cash)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Choose payment type for{" "}
                <span className="font-semibold">{year || ""}</span>. <br />
                (No endpoint change — Year option will call Semester 1 and 2.)
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Current displayed amount:{" "}
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={busy}
              title="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {items.map((it) => {
            const Icon = it.icon;
            const active = choice === it.key;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => setChoice(it.key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${active
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                disabled={busy}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${active ? "bg-blue-600" : "bg-gray-200"
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-700"}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {it.title}
                      </p>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border ${active
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                      >
                        {active ? "Selected" : "Select"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{it.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-5 border-t border-gray-100 bg-white flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(choice)}
            disabled={busy}
            className={`px-4 py-2 rounded-xl text-white transition-colors ${busy ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {busy ? "Processing..." : "Confirm Mark Paid"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================== SMALL UI ================== */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
      {title}
    </h3>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

const InfoField = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value || ""}</p>
  </div>
);

export default RegistrationPage;
