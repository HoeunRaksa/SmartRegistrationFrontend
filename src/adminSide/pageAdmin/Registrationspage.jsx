import React, { useEffect, useState, useMemo, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRegistrations, adminGenerateQr, markPaidCash } from "../../api/registration_api";
import { fetchDepartments } from "../../api/department_api";
import { fetchMajors } from "../../api/major_api";
import RegistrationReportPage from "./RegistrationReportPage";
import PaymentForm from "../../Components/payment/PaymentForm.jsx";
import { ToastContext } from "../../Components/Context/ToastProvider.jsx";

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
} from "lucide-react";

const RegistrationPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");

  // For dropdown options
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  // QR modal
  const [showAdminQr, setShowAdminQr] = useState(false);
  const [adminQrReg, setAdminQrReg] = useState(null);

  // ✅ semester selector
  const [selectedSemester, setSelectedSemester] = useState("1");

  const toast = useContext(ToastContext);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ reload registrations when semester changes (important!)
  useEffect(() => {
    loadRegistrationsOnly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSemester]);

  const loadRegistrationsOnly = async () => {
    try {
      setLoading(true);
      const regRes = await fetchRegistrations({ semester: parseInt(selectedSemester, 10) || 1 });

      const regData = regRes.data?.data || regRes.data || [];
      setRegistrations(Array.isArray(regData) ? regData : []);
    } catch (error) {
      console.error("Failed to load registrations:", error);
      setRegistrations([]);
      toast?.error?.("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [regRes, deptRes, majorRes] = await Promise.all([
        fetchRegistrations({ semester: parseInt(selectedSemester, 10) || 1 }),
        fetchDepartments(),
        fetchMajors(),
      ]);

      const regData = regRes.data?.data || regRes.data || [];
      const deptData = deptRes.data?.data || deptRes.data || [];
      const majorData = majorRes.data?.data || majorRes.data || [];

      setRegistrations(Array.isArray(regData) ? regData : []);
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
  };

  // ✅ Helpers (normalize new/old backend fields)
  // IMPORTANT: prefer PERIOD status (student_academic_periods) first
  const getPaymentStatus = (reg) =>
    reg?.period_payment_status ??
    reg?.academic_payment_status ??
    reg?.payment_status ??
    "PENDING";

  const getPaidAt = (reg) =>
    reg?.period_paid_at ?? reg?.paid_at ?? reg?.payment_date ?? null;

  const getAmount = (reg) =>
    reg?.period_tuition_amount ??
    reg?.tuition_amount ??
    reg?.payment_amount ??
    reg?.registration_fee ??
    reg?.amount ??
    0;

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const status = (getPaymentStatus(reg) || "PENDING").toUpperCase();

      // Payment status filter
      const statusMatch =
        filter === "all"
          ? true
          : filter === "paid"
          ? status === "PAID"
          : filter === "pending"
          ? status === "PENDING"
          : true;

      // Search filter
      const s = searchTerm.toLowerCase();
      const searchMatch =
        searchTerm === ""
          ? true
          : reg.full_name_en?.toLowerCase().includes(s) ||
            reg.full_name_kh?.toLowerCase().includes(s) ||
            reg.personal_email?.toLowerCase().includes(s) ||
            reg.phone_number?.includes(searchTerm);

      // Department filter
      const departmentMatch =
        selectedDepartment === "all"
          ? true
          : reg.department_id === parseInt(selectedDepartment);

      // Major filter
      const majorMatch =
        selectedMajor === "all" ? true : reg.major_id === parseInt(selectedMajor);

      return statusMatch && searchMatch && departmentMatch && majorMatch;
    });
  }, [registrations, filter, searchTerm, selectedDepartment, selectedMajor]);

  const paidCount = filteredRegistrations.filter(
    (r) => (getPaymentStatus(r) || "").toUpperCase() === "PAID"
  ).length;

  const pendingCount = filteredRegistrations.filter((r) => {
    const s = (getPaymentStatus(r) || "PENDING").toUpperCase();
    return s === "PENDING";
  }).length;

  const totalRevenue = filteredRegistrations
    .filter((r) => (getPaymentStatus(r) || "").toUpperCase() === "PAID")
    .reduce((sum, reg) => sum + (parseFloat(getAmount(reg)) || 0), 0);

  const quickStats = [
    { label: "Total", value: filteredRegistrations.length, color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Paid", value: paidCount, color: "from-green-500 to-emerald-500", icon: CheckCircle },
    { label: "Pending", value: pendingCount, color: "from-orange-500 to-red-500", icon: Clock },
    { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "from-purple-500 to-pink-500", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen space-y-6">
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
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
          {/* Row 1: Search */}
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Row 2: Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedMajor("all");
                }}
                className="px-3 py-2 bg-white/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Major Filter */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange-500" />
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="px-3 py-2 bg-white/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Majors</option>
                {majors
                  .filter(
                    (major) =>
                      selectedDepartment === "all" ||
                      major.department_id === parseInt(selectedDepartment)
                  )
                  .map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.major_name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Semester selector */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 bg-white/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  filter === "all"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-700 hover:bg-white/70"
                }`}
              >
                All ({registrations.length})
              </button>
              <button
                onClick={() => setFilter("paid")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${
                  filter === "paid"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-700 hover:bg-white/70"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Paid
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${
                  filter === "pending"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-700 hover:bg-white/70"
                }`}
              >
                <Clock className="w-4 h-4" />
                Pending
              </button>
            </div>

            {/* Clear Filters Button */}
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

            {/* Create Report Button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="ml-auto px-4 py-2 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* ================= REGISTRATIONS LIST ================= */}
      <RegistrationsList
        registrations={filteredRegistrations}
        loading={loading}
        onView={setSelectedRegistration}
        getPaymentStatus={getPaymentStatus}
        getAmount={getAmount}
      />

      {/* ================= ADMIN QR MODAL ================= */}
      {showAdminQr && adminQrReg && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <PaymentForm
            registrationId={adminQrReg.id}
            amount={getAmount(adminQrReg)}
            registrationData={{
              data: {
                registration_id: adminQrReg.id,
                payment_amount: getAmount(adminQrReg),
              },
            }}
            semester={parseInt(selectedSemester, 10) || 1}
            onClose={() => {
              setShowAdminQr(false);
              setAdminQrReg(null);
            }}
            onSuccess={async () => {
              setShowAdminQr(false);
              setAdminQrReg(null);
              await loadRegistrationsOnly();
            }}
          />
        </div>
      )}

      {/* ================= DETAIL MODAL ================= */}
      {selectedRegistration && (
        <RegistrationModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onRefresh={loadRegistrationsOnly}
          onOpenQr={(reg) => {
            setAdminQrReg(reg);
            setShowAdminQr(true);
          }}
          toast={toast}
          selectedSemester={parseInt(selectedSemester, 10) || 1}
          getPaymentStatus={getPaymentStatus}
          getPaidAt={getPaidAt}
          getAmount={getAmount}
        />
      )}

      {/* ================= REPORT MODAL ================= */}
      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
    </div>
  );
};

/* ================== REPORT MODAL ================== */
const ReportModal = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <RegistrationReportPage />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const RegistrationsList = ({ registrations, loading, onView, getPaymentStatus, getAmount }) => {
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
            <h3 className="text-lg font-semibold text-gray-900">All Registrations</h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
            {registrations.length} {registrations.length === 1 ? "Result" : "Results"}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Major</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.map((reg) => (
                <RegistrationRow
                  key={reg.id}
                  registration={reg}
                  onView={onView}
                  getPaymentStatus={getPaymentStatus}
                  getAmount={getAmount}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Users className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No registrations found</p>
    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term</p>
  </div>
);

const RegistrationRow = ({ registration, onView, getPaymentStatus, getAmount }) => {
  const status = (getPaymentStatus(registration) || "PENDING").toUpperCase();
  const isPaid = status === "PAID";

  const profileImage = registration.profile_picture_url || registration.profile_picture_path;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
      className="bg-white/60 hover:bg-blue-50/50 transition-colors cursor-pointer"
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
          <p className="text-sm font-semibold text-gray-900">{registration.full_name_en}</p>
          {registration.full_name_kh && <p className="text-xs text-gray-500 mt-0.5">{registration.full_name_kh}</p>}
          <p className="text-xs text-gray-400 mt-0.5">ID: {registration.id}</p>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          {registration.personal_email && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{registration.personal_email}</span>
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
            <span className="text-sm text-gray-700">{registration.department_name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )}
      </td>

      <td className="px-6 py-4">
        {registration.major_name ? (
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{registration.major_name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700">
            ${parseFloat(getAmount(registration) || 0).toFixed(2)}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isPaid ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Paid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(registration);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
        >
          <User className="w-3.5 h-3.5" />
          View
        </button>
      </td>
    </motion.tr>
  );
};

const RegistrationModal = ({
  registration,
  onClose,
  onRefresh,
  onOpenQr,
  toast,
  selectedSemester,
  getPaymentStatus,
  getPaidAt,
  getAmount,
}) => {
  const status = (getPaymentStatus(registration) || "PENDING").toUpperCase();
  const isPaid = status === "PAID";

  const profileImage = registration.profile_picture_url || registration.profile_picture_path;

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-3xl w-full max-h-[75vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        >
          <div
            className={`sticky top-0 p-6 z-10 ${
              isPaid ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-orange-500 to-red-600"
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
                <h2 className="text-2xl font-bold text-white mb-2">Registration Details</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-white/80">ID: {registration.id}</span>
                  {isPaid ? (
                    <span className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">
                      <CheckCircle className="w-3 h-3" />
                      Payment Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">
                      <XCircle className="w-3 h-3" />
                      Payment Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Section title="Personal Information">
              <InfoGrid>
                <InfoField label="Full Name (EN)" value={registration.full_name_en} />
                <InfoField label="Full Name (KH)" value={registration.full_name_kh} />
                <InfoField label="Gender" value={registration.gender} />
                <InfoField label="Date of Birth" value={registration.date_of_birth} />
                <InfoField label="Email" value={registration.personal_email} />
                <InfoField label="Phone" value={registration.phone_number} />
                <InfoField label="Address" value={registration.address} fullWidth />
                <InfoField label="Current Address" value={registration.current_address} fullWidth />
              </InfoGrid>
            </Section>

            <Section title="Education Information">
              <InfoGrid>
                <InfoField label="High School" value={registration.high_school_name} />
                <InfoField label="Graduation Year" value={registration.graduation_year} />
                <InfoField label="Grade 12 Result" value={registration.grade12_result} />
                <InfoField label="Department" value={registration.department_name} />
                <InfoField label="Major" value={registration.major_name} />
                <InfoField label="Faculty" value={registration.faculty} />
                <InfoField label="Shift" value={registration.shift} />
                <InfoField label="Batch" value={registration.batch} />
                <InfoField label="Academic Year" value={registration.academic_year} />
              </InfoGrid>
            </Section>

            <Section title="Parent/Guardian Information">
              <InfoGrid>
                <InfoField label="Father's Name" value={registration.father_name} />
                <InfoField label="Father's Phone" value={registration.fathers_phone_number} />
                <InfoField label="Mother's Name" value={registration.mother_name} />
                <InfoField label="Mother's Phone" value={registration.mother_phone_number} />
                <InfoField label="Guardian Name" value={registration.guardian_name} />
                <InfoField label="Guardian Phone" value={registration.guardian_phone_number} />
              </InfoGrid>
            </Section>

            <Section title="Payment Information">
              <div
                className={`p-4 rounded-xl ${
                  isPaid ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPaid ? (
                      <div className="p-2 rounded-full bg-green-500">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-full bg-orange-500">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className={`font-semibold ${isPaid ? "text-green-700" : "text-orange-700"}`}>
                        {isPaid ? "Payment Completed" : "Payment Pending"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Registration Fee: ${parseFloat(getAmount(registration) || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Semester: {selectedSemester}</p>
                    </div>
                  </div>

                  {isPaid && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Paid on</p>
                      <p className="text-sm font-medium text-gray-700">
                        {getPaidAt(registration) || "Date unavailable"}
                      </p>
                    </div>
                  )}
                </div>

                {!isPaid && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={async () => {
                        try {
                          await adminGenerateQr(registration.id, selectedSemester);
                          toast?.success?.("QR generated successfully");
                          onOpenQr(registration);
                        } catch (e) {
                          console.log("=== GENERATE QR ERROR ===");
                          console.log("status:", e.response?.status);
                          console.log("data:", e.response?.data);
                          console.log("headers:", e.response?.headers);
                          console.log("========================");

                          const msg =
                            e.response?.data?.message ||
                            e.response?.data?.error ||
                            "Failed to generate QR";

                          toast?.error?.(msg);

                          // ✅ if conflict (already paid) refresh list so status becomes PAID
                          if (e.response?.status === 409) {
                            await onRefresh();
                            onClose();
                          }
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Generate QR Again
                    </button>

                    <button
                      onClick={async () => {
                        if (!confirm("Mark this registration as PAID (Cash)?")) return;

                        try {
                          await markPaidCash(registration.id, selectedSemester);
                          toast?.success?.("Marked as PAID (Cash)");
                          await onRefresh();
                          onClose();
                        } catch (e) {
                          console.error(e);
                          toast?.error?.(e.response?.data?.message || "Failed to mark paid");
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                    >
                      Mark Paid (Cash)
                    </button>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{title}</h3>
    {children}
  </div>
);

const InfoGrid = ({ children }) => <div className="grid grid-cols-2 gap-4">{children}</div>;

const InfoField = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "N/A"}</p>
  </div>
);

export default RegistrationPage;
