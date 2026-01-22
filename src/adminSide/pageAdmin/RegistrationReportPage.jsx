import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  generateRegistrationReport,
  generateAndDownloadReport,
  getRegistrationSummary
} from "../../api/registration_api";
import { fetchDepartments } from "../../api/department_api";
import { fetchMajors } from "../../api/major_api";

const RegistrationReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
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
  });

  const buildAcademicYears = (pastYears = 8, futureYears = 6) => {
    const now = new Date().getFullYear();
    const start = now - pastYears;
    const end = now + futureYears;

    const years = [];
    for (let y = start; y <= end; y++) {
      years.push(`${y}-${y + 1}`);
    }
    return years;
  };

  const academicYearOptions = buildAcademicYears(5, 5);

  useEffect(() => {
    loadDepartments();
    loadMajors();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  const loadMajors = async () => {
    try {
      const res = await fetchMajors();
      setMajors(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load majors:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await generateRegistrationReport(filters);
      setReportData(res.data?.data || null);
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      await generateAndDownloadReport(filters, `registration_report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      alert("Failed to download PDF report");
    }
  };

  const resetFilters = () => {
    setFilters({
      department_id: "",
      major_id: "",
      payment_status: "",
      academic_year: "",
      shift: "",
      gender: "",
      date_from: "",
      date_to: "",
    });
    setReportData(null);
  };

  const stats = reportData?.statistics || {
    total_registrations: 0,
    total_male: 0,
    total_female: 0,
    total_amount: 0,
    paid_amount: 0,
  };

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
              Generate comprehensive reports on student registrations
            </p>
          </div>
          <FileText className="w-12 h-12 text-white/30" />
        </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              name="department_id"
              value={filters.department_id}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Major */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Major
            </label>
            <select
              name="major_id"
              value={filters.major_id}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Majors</option>
              {majors.map((major) => (
                <option key={major.id} value={major.id}>
                  {major.major_name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
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

          {/* Shift */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date From
            </label>
            <input
              type="date"
              name="date_from"
              value={filters.date_from}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date To
            </label>
            <input
              type="date"
              name="date_to"
              value={filters.date_to}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
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
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </motion.div>

      {/* Statistics */}
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
              value={stats.total_registrations}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Users}
              label="Male / Female"
              value={`${stats.total_male} / ${stats.total_female}`}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              icon={DollarSign}
              label="Total Amount"
              value={`$${Number(stats.total_amount || 0).toFixed(2)}`}
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Paid Amount"
              value={`$${Number(stats.paid_amount || 0).toFixed(2)}`}
              color="from-orange-500 to-orange-600"
            />
          </motion.div>

          {/* Registrations Table */}
          <ReportTable registrations={reportData.registrations || []} />
        </>
      )}
    </div>
  );
};

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

const ReportTable = ({ registrations }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden"
  >
    <div className="p-5 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
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
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {registrations.map((reg, index) => {
            const status = String(reg.payment_status || "PENDING").toUpperCase();
            const amount = Number(reg.payment_amount || 0);

            const badgeClass =
              status === "COMPLETED" || status === "PAID"
                ? "bg-green-100 text-green-600"
                : status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-600";

            return (
              <tr key={reg.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {reg.student?.student_code || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{reg.full_name_en || "N/A"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${reg.gender === "Male"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-pink-100 text-pink-600"
                      }`}
                  >
                    {reg.gender || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{reg.department?.name || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{reg.major?.major_name || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${badgeClass}`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ${amount.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default RegistrationReportPage;
