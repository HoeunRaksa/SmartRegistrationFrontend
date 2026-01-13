import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffForm from "../ConponentsAdmin/StaffForm.jsx";
import { fetchStaff, deleteStaff } from "../../api/staff_api.jsx";
import {
  Users,
  Home,
  ChevronRight,
  Settings,
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

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      await deleteStaff(id);
      loadStaff();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete staff member");
    }
  };

  const quickStats = [
    { label: "Total Staff", value: staff.length, color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Admins", value: staff.filter(s => s.user?.role === 'admin').length, color: "from-purple-500 to-pink-500", icon: TrendingUp },
    { label: "Departments", value: new Set(staff.map(s => s.department_id)).size, color: "from-green-500 to-emerald-500", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2 text-gray-600">
          <Settings className="w-4 h-4" />
          <span>Management</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <Users className="w-4 h-4" />
          <span>Staff</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="bg-white/40 rounded-3xl p-6 border border-white/50 shadow-lg backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-50" />
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                Staff Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage your staff members and their information
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex-1 min-w-[90px]">
                  <div className="bg-white/50 rounded-2xl p-3 border border-white/40 shadow-md hover:shadow-lg transition-shadow">
                    <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-1.5`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FORM */}
      <StaffForm
        onUpdate={loadStaff}
        editingStaff={editingStaff}
        onCancelEdit={() => setEditingStaff(null)}
      />

      {/* STAFF LIST */}
      <StaffList
        staff={staff}
        loading={loading}
        onEdit={handleEdit}
        onView={setSelectedStaff}
        onDelete={handleDelete}
      />

      {/* DETAIL MODAL */}
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
    <div className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Staff Members</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {staff.length} Total
        </span>
      </div>

      {staff.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
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
    <p className="text-gray-500 font-medium">No staff members yet</p>
    <p className="text-sm text-gray-400 mt-1">Add your first staff member to get started</p>
  </div>
);

const StaffCard = ({ staff, onEdit, onView, onDelete }) => {
  const profileUrl = staff.user?.profile_picture_url;

  return (
    <div
      onClick={() => onView(staff)}
      className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(staff);
            }}
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>

          <button
            className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(staff.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>

        <div className="absolute -bottom-12 left-4">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={staff.full_name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-xl flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 p-5">
        <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {staff.full_name}
        </h4>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-2.5 py-1 rounded-full font-medium">
            <Briefcase className="w-3 h-3" />
            {staff.position}
          </span>
          {staff.user?.role === 'admin' && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
              Admin
            </span>
          )}
        </div>

        <div className="space-y-2 pt-3 border-t border-gray-200">
          {staff.email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span className="truncate">{staff.email}</span>
            </div>
          )}
          {staff.phone_number && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span>{staff.phone_number}</span>
            </div>
          )}
          {staff.department_name && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Building2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">{staff.department_name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
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
                  alt={staff.full_name}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{staff.full_name}</h2>
              {staff.full_name_kh && (
                <p className="text-lg text-gray-600">{staff.full_name_kh}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                  <Briefcase className="w-4 h-4" />
                  {staff.position}
                </span>
                {staff.user?.role === 'admin' && (
                  <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <InfoField icon={Mail} label="Email" value={staff.email} iconColor="text-purple-500" />
              <InfoField icon={Phone} label="Phone" value={staff.phone_number || "N/A"} iconColor="text-green-500" />
              <InfoField icon={Building2} label="Department" value={staff.department_name} iconColor="text-blue-500" />
              <InfoField icon={UserCircle} label="Username" value={staff.user_name} iconColor="text-orange-500" />
              
              {staff.gender && (
                <InfoField icon={UserCircle} label="Gender" value={staff.gender} iconColor="text-pink-500" />
              )}
              {staff.date_of_birth && (
                <InfoField icon={Calendar} label="Date of Birth" value={staff.date_of_birth} iconColor="text-indigo-500" />
              )}
            </div>

            {staff.address && (
              <div className="pt-4 border-t">
                <InfoField icon={MapPin} label="Address" value={staff.address} iconColor="text-red-500" fullWidth />
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