import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRegistrations } from "../../api/registration_api";
import RegistrationReportPage from "./RegistrationReportPage";
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
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetchRegistrations();
      const regData = res.data?.data || res.data || [];
      setRegistrations(Array.isArray(regData) ? regData : []);
    } catch (error) {
      console.error("Failed to load registrations:", error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const statusMatch = 
      filter === 'all' ? true :
      filter === 'paid' ? reg.payment_status === 'PAID' :
      filter === 'pending' ? (!reg.payment_status || reg.payment_status === 'PENDING') :
      true;

    const searchMatch = searchTerm === '' ? true :
      reg.full_name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.full_name_kh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.personal_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone_number?.includes(searchTerm);

    return statusMatch && searchMatch;
  });

  const paidCount = registrations.filter(r => r.payment_status === 'PAID').length;
  const pendingCount = registrations.filter(r => !r.payment_status || r.payment_status === 'PENDING').length;
  const totalRevenue = paidCount * 100;

  const quickStats = [
    { label: "Total", value: registrations.length, color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Paid", value: paidCount, color: "from-green-500 to-emerald-500", icon: CheckCircle },
    { label: "Pending", value: pendingCount, color: "from-orange-500 to-red-500", icon: Clock },
    { label: "Revenue", value: `$${totalRevenue}`, color: "from-purple-500 to-pink-500", icon: DollarSign },
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
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
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

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                filter === 'all'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              All ({registrations.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${
                filter === 'paid'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Paid ({paidCount})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${
                filter === 'pending'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              <Clock className="w-4 h-4" />
              Pending ({pendingCount})
            </button>

            {/* CREATE REPORT BUTTON */}
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all flex items-center gap-2"
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
      />

      {/* ================= DETAIL MODAL ================= */}
      {selectedRegistration && (
        <RegistrationModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />
      )}

      {/* ================= REPORT MODAL ================= */}
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} />
      )}
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
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Report Page Content */}
          <div className="p-6">
            <RegistrationReportPage />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const RegistrationsList = ({ registrations, loading, onView }) => {
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
    <div className="rounded-2xl bg-white/40 border  border-white/40 shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Registrations</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {registrations.length} {registrations.length === 1 ? 'Result' : 'Results'}
        </span>
      </div>

      {registrations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => (
            <RegistrationCard
              key={reg.id}
              registration={reg}
              onView={onView}
            />
          ))}
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

const RegistrationCard = ({ registration, onView }) => {
  const isPaid = registration.payment_status === 'PAID';
  const profileImage = registration.profile_picture_url || registration.profile_picture_path;

  return (
    <div
      onClick={() => onView(registration)}
      className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className={`relative h-24 p-4 ${isPaid ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
        <div className="flex justify-between items-start">
          <span className="text-xs text-white/80">ID: {registration.id}</span>
          {isPaid ? (
            <span className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full border border-white/30">
              <CheckCircle className="w-3 h-3" />
              Paid
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full border border-white/30">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          )}
        </div>
        
        {/* Profile Picture */}
        <div className="absolute -bottom-10 left-4">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            {profileImage ? (
              <img
                src={profileImage}
                alt={registration.full_name_en}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-14">
        <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {registration.full_name_en}
        </h4>
        {registration.full_name_kh && (
          <p className="text-sm text-gray-600 mb-3">{registration.full_name_kh}</p>
        )}

        <div className="space-y-2">
          {registration.personal_email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span className="truncate">{registration.personal_email}</span>
            </div>
          )}
          {registration.phone_number && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span>{registration.phone_number}</span>
            </div>
          )}
          {registration.department_name && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Building2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">{registration.department_name}</span>
            </div>
          )}
          {registration.major_name && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <GraduationCap className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              <span className="truncate">{registration.major_name}</span>
            </div>
          )}
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-1 ${isPaid ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'} scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
    </div>
  );
};

const RegistrationModal = ({ registration, onClose }) => {
  const isPaid = registration.payment_status === 'PAID';
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
          {/* Header */}
          <div className={`sticky top-0 p-6 z-10 ${isPaid ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              {/* Profile Picture in Modal */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg flex-shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={registration.full_name_en}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
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

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Personal Information */}
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

            {/* Education Information */}
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

            {/* Parent/Guardian Information */}
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

            {/* Payment Status */}
            <Section title="Payment Information">
              <div className={`p-4 rounded-xl ${isPaid ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
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
                      <p className={`font-semibold ${isPaid ? 'text-green-700' : 'text-orange-700'}`}>
                        {isPaid ? 'Payment Completed' : 'Payment Pending'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Registration Fee: ${registration.payment_amount || '100.00'}
                      </p>
                    </div>
                  </div>
                  {isPaid && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Paid on</p>
                      <p className="text-sm font-medium text-gray-700">
                        {registration.payment_date || 'Date unavailable'}
                      </p>
                    </div>
                  )}
                </div>
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

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">
    {children}
  </div>
);

const InfoField = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "N/A"}</p>
  </div>
);

export default RegistrationPage;