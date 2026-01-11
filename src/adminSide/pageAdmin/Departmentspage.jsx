import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DepartmentsForm from '../ConponentsAdmin/DepartmentsForm.jsx';
import {
  fetchDepartments,
  deleteDepartment,
} from "../../api/department_api.jsx";
import {
  Building2,
  Home,
  ChevronRight,
  Settings,
  Users,
  TrendingUp,
  BarChart3,
  Grid3x3,
  Code,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  X,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

/* ================== HELPER FUNCTIONS ================== */

const getImageUrl = (department) => {
  if (department?.image_url) {
    return department.image_url;
  }
  if (department?.image_path) {
    return `${department.image_path}`;
  }
  return null;
};

/* ================== ANIMATION VARIANTS ================== */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  },
  card: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  },
};

/* ================== MAIN COMPONENT ================== */

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetchDepartments();
      setDepartments(res.data?.data || []);
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDepartment(departmentId);
      loadDepartments();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete department");
    }
  };

  const quickStats = [
    { label: "Active", value: departments.length, color: "from-green-500 to-emerald-500", icon: TrendingUp },
    { label: "Students", value: "1.2K", color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Growth", value: "+15%", color: "from-purple-500 to-pink-500", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* ================= BREADCRUMB ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-sm"
      >
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
          <Building2 className="w-4 h-4" />
          <span>Departments</span>
        </div>
      </motion.div>

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white/40 rounded-3xl p-6 border border-white/50 shadow-lg backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-50" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"
                >
                  Department Management
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-600"
                >
                  Create, manage, and organize your academic departments
                </motion.p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3">
              {quickStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="flex-1 min-w-[90px]"
                  >
                    <div className="bg-white/50 rounded-2xl p-3 border border-white/40 shadow-md hover:shadow-lg transition-shadow">
                      <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-1.5`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= FORM ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <DepartmentsForm
          onUpdate={loadDepartments}
          editingDepartment={editingDepartment}
          onCancelEdit={() => setEditingDepartment(null)}
        />
      </motion.div>

      {/* ================= DEPARTMENTS LIST ================= */}
      <DepartmentsList
        departments={departments}
        loading={loading}
        onEdit={handleEdit}
        onView={setSelectedDepartment}
        onDelete={handleDelete}
      />

      {/* ================= DETAIL MODAL ================= */}
      {selectedDepartment && (
        <DepartmentModal
          department={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
        />
      )}
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const DepartmentsList = ({ departments, loading, onEdit, onView, onDelete }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-12 text-center"
      >
        <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4">
          <Building2 className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600">Loading departments...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={animations.fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Departments</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {departments.length} Total
        </span>
      </div>

      {departments.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Building2 className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No departments yet</p>
    <p className="text-sm text-gray-400 mt-1">Create your first department to get started</p>
  </motion.div>
);

const DepartmentCard = ({ department, onEdit, onView, onDelete }) => {
  const imageUrl = getImageUrl(department);

  return (
    <motion.div
      variants={animations.card}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onView(department)}
      className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={department.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-purple-300" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(department);
            }}
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(department.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {department.name}
        </h4>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
            <Code className="w-3 h-3" />
            {department.code}
          </span>
          {department.faculty && (
            <span className="text-xs text-gray-500">• {department.faculty}</span>
          )}
        </div>

        {department.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{department.description}</p>
        )}

        <div className="space-y-1.5 pt-3 border-t border-gray-200">
          {department.contact_email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-purple-500" />
              <span className="truncate">{department.contact_email}</span>
            </div>
          )}
          {department.phone_number && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-green-500" />
              <span>{department.phone_number}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

const DepartmentModal = ({ department, onClose }) => {
  const imageUrl = getImageUrl(department);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header with Image */}
          <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={department.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-24 h-24 text-white/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-bold text-white mb-2">{department.name}</h2>
              <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                <Code className="w-4 h-4" />
                {department.code}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {department.title && (
              <InfoField label="Title" value={department.title} />
            )}
            {department.faculty && (
              <InfoField label="Faculty" value={department.faculty} />
            )}
            {department.description && (
              <InfoField label="Description" value={department.description} />
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              {department.contact_email && (
                <ContactField icon={Mail} label="Email" value={department.contact_email} iconColor="text-purple-500" />
              )}
              {department.phone_number && (
                <ContactField icon={Phone} label="Phone" value={department.phone_number} iconColor="text-green-500" />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value}</p>
  </div>
);

const ContactField = ({ icon: Icon, label, value, iconColor }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</p>
    <div className="flex items-center gap-2 text-sm text-gray-800">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span>{value}</span>
    </div>
  </div>
);

export default DepartmentsPage;