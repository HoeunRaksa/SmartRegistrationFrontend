import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffForm from "../ConponentsAdmin/StaffForm.jsx";
import FormModal from "../../Components/FormModal.jsx";
import { fetchStaff, deleteStaff } from "../../api/staff_api.jsx";
import {
  Users,
  TrendingUp,
  BarChart3,
  Grid3x3,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Edit,
  Trash2,
  X,
  UserCircle,
  Calendar,
  MapPin,
} from "lucide-react";
import Alert from "../../gobalConponent/Alert.jsx";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Global UI State
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [confirm, setConfirm] = useState({ show: false, id: null });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    if (type === "success") setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 5000);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await fetchStaff();
      const staffData = res.data?.data || res.data || [];
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (error) {
      console.error("Failed to load staff:", error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    setConfirm({ show: true, id });
  };

  const executeDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteStaff(confirm.id);
      showAlert("Staff member deleted successfully", "success");
      loadStaff();
    } catch (error) {
      console.error("Delete error:", error);
      showAlert(error.response?.data?.message || "Failed to delete staff member", "error");
    }
  };

  const quickStats = [
    { label: "Total Staff", value: staff.length, color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Admins", value: staff.filter(s => s.user?.role === 'admin').length, color: "from-purple-500 to-pink-500", icon: TrendingUp },
    { label: "Departments", value: new Set(staff.map(s => s.department_id).filter(Boolean)).size, color: "from-green-500 to-emerald-500", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <AnimatePresence>
        {alert.show && (
          <div className="fixed top-20 right-5 z-[9999] w-80">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirm.show}
        title="Confirm Delete"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
        confirmText="Delete"
        type="danger"
      />
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-600 font-medium">Manage administrative staff and university personnel.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingStaff(null);
            setIsFormOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          Add Staff
        </motion.button>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* ================= FORM MODAL ================= */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStaff(null);
        }}
        maxWidth="max-w-4xl"
      >
        <StaffForm
          onUpdate={() => {
            loadStaff();
            setIsFormOpen(false);
          }}
          editingStaff={editingStaff}
          onCancelEdit={() => {
            setEditingStaff(null);
            setIsFormOpen(false);
          }}
        />
      </FormModal>

      {/* ================= STAFF LIST ================= */}
      <StaffList
        staff={staff}
        loading={loading}
        onEdit={handleEdit}
        onView={setSelectedStaff}
        onDelete={handleDelete}
      />

      {/* ================= DETAIL MODAL ================= */}
      {selectedStaff && (
        <StaffModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};

const StaffList = ({ staff, loading, onEdit, onView, onDelete }) => {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-12 text-center">
        <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4">
          <Users className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600">Loading staff...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">All Staff Members</h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
            {staff.length} Total
          </span>
        </div>
      </div>

      {staff.length === 0 ? (
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
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff.map((member) => (
                <StaffRow
                  key={member.id}
                  staff={member}
                  onEdit={onEdit}
                  onView={onView}
                  onDelete={onDelete}
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
    <p className="text-gray-500 font-medium">No staff members yet</p>
    <p className="text-sm text-gray-400 mt-1">Add your first staff member to get started</p>
  </div>
);

const StaffRow = ({ staff, onEdit, onView, onDelete }) => {
  const profileUrl = staff.user?.profile_picture_url;
  const isAdmin = staff.user?.role === 'admin';

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
      className="bg-white/60 hover:bg-blue-50/50 transition-colors cursor-pointer"
      onClick={() => onView(staff)}
    >
      {/* Profile Picture */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm border-2 border-gray-200">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={staff.full_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path></svg></div>';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <UserCircle className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{staff.full_name || staff.full_name_en}</p>
          {staff.full_name_kh && (
            <p className="text-xs text-gray-500 mt-0.5">{staff.full_name_kh}</p>
          )}
        </div>
      </td>

      {/* Position */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-sm text-gray-700">{staff.position || ""}</span>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          {(staff.email || staff.user?.email) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span className="truncate max-w-[180px]">{staff.email || staff.user?.email}</span>
            </div>
          )}
          {staff.phone_number && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span>{staff.phone_number}</span>
            </div>
          )}
        </div>
      </td>

      {/* Department */}
      <td className="px-6 py-4">
        {(staff.department_name || staff.department?.name) ? (
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{staff.department_name || staff.department?.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400"></span>
        )}
      </td>

      {/* Role */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isAdmin ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            Staff
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(staff);
            }}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(staff.id);
            }}
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const StaffModal = ({ staff, onClose }) => {
  const profileUrl = staff.user?.profile_picture_url;

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
          className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute -bottom-16 left-6">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={staff.full_name || staff.full_name_en}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-xl flex items-center justify-center">
                  <UserCircle className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{staff.full_name || staff.full_name_en}</h2>
              {staff.full_name_kh && (
                <p className="text-lg text-gray-600">{staff.full_name_kh}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                  <Briefcase className="w-4 h-4" />
                  {staff.position || ""}
                </span>
                {staff.user?.role === 'admin' && (
                  <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <InfoField
                icon={Mail}
                label="Email"
                value={staff.email || staff.user?.email || ""}
                iconColor="text-purple-500"
              />
              <InfoField
                icon={Phone}
                label="Phone"
                value={staff.phone_number || ""}
                iconColor="text-green-500"
              />
              <InfoField
                icon={Building2}
                label="Department"
                value={staff.department_name || staff.department?.name || ""}
                iconColor="text-blue-500"
              />
              <InfoField
                icon={UserCircle}
                label="Username"
                value={staff.user?.name || staff.user_name || ""}
                iconColor="text-orange-500"
              />

              {staff.gender && (
                <InfoField
                  icon={UserCircle}
                  label="Gender"
                  value={staff.gender}
                  iconColor="text-pink-500"
                />
              )}
              {staff.date_of_birth && (
                <InfoField
                  icon={Calendar}
                  label="Date of Birth"
                  value={staff.date_of_birth}
                  iconColor="text-indigo-500"
                />
              )}
            </div>

            {staff.address && (
              <div className="pt-4 border-t">
                <InfoField
                  icon={MapPin}
                  label="Address"
                  value={staff.address}
                  iconColor="text-red-500"
                  fullWidth
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoField = ({ icon: Icon, label, value, iconColor, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</p>
    <div className="flex items-center gap-2 text-sm text-gray-800">
      <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
      <span className={fullWidth ? "" : "truncate"}>{value}</span>
    </div>
  </div>
);

export default StaffPage;