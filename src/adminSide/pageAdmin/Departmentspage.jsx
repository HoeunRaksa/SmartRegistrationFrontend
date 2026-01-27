import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DepartmentsForm from "../ConponentsAdmin/DepartmentsForm.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { fetchDepartments, deleteDepartment } from "../../api/department_api.jsx";
import {
  Building2,
  Users,
  TrendingUp,
  BarChart3,
  Grid3x3,
  Code,
  Mail,
  Phone,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Search,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";

/* ================== HELPERS ================== */

const getImageUrl = (department) => {
  const url = department?.image_url || department?.image_path;
  return url ? String(url) : null;
};

const safeArray = (maybeArray) => (Array.isArray(maybeArray) ? maybeArray : []);

/* ================== MAIN COMPONENT ================== */

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name"); // name, code, recent

  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchDepartments();
      const data = res?.data?.data ?? res?.data ?? [];
      setDepartments(safeArray(data));
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      const res = await fetchStudents();
      const data = res?.data?.data ?? res?.data ?? [];
      setStudents(safeArray(data));
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
    loadStudents();
  }, [loadDepartments, loadStudents]);

  const handleEdit = useCallback((department) => {
    setEditingDepartment(department);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(
    async (departmentId) => {
      const ok = window.confirm(
        "Are you sure you want to delete this department? This action cannot be undone."
      );
      if (!ok) return;

      try {
        await deleteDepartment(departmentId);
        await loadDepartments();
      } catch (err) {
        console.error("Delete error:", err);
        alert(err?.response?.data?.message || "Failed to delete department");
      }
    },
    [loadDepartments]
  );

  const faculties = useMemo(() => {
    const list = departments.map((d) => d?.faculty).filter(Boolean);
    return [...new Set(list)].sort((a, b) => String(a).localeCompare(String(b)));
  }, [departments]);

  const filteredDepartments = useMemo(() => {
    let result = [...departments];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter((dept) => {
        const name = (dept?.name || "").toLowerCase();
        const code = (dept?.code || "").toLowerCase();
        const faculty = (dept?.faculty || "").toLowerCase();
        const desc = (dept?.description || "").toLowerCase();
        return (
          name.includes(search) ||
          code.includes(search) ||
          faculty.includes(search) ||
          desc.includes(search)
        );
      });
    }

    if (selectedFaculty !== "all") {
      result = result.filter((dept) => dept?.faculty === selectedFaculty);
    }

    result.sort((a, b) => {
      if (sortBy === "name") return (a?.name || "").localeCompare(b?.name || "");
      if (sortBy === "code") return (a?.code || "").localeCompare(b?.code || "");
      if (sortBy === "recent") return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
      return 0;
    });

    return result;
  }, [departments, searchTerm, selectedFaculty, sortBy]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedFaculty("all");
    setSortBy("name");
  }, []);

  const hasActiveFilters = Boolean(searchTerm) || selectedFaculty !== "all" || sortBy !== "name";

  const quickStats = useMemo(() => {
    const deptCount = departments.length;
    const studentCount = students.length;
    const avg = deptCount === 0 ? 0 : Math.round(studentCount / deptCount);

    return [
      {
        label: "Departments",
        value: filteredDepartments.length,
        total: deptCount,
        color: "from-green-500 to-emerald-500",
        icon: TrendingUp,
      },
      {
        label: "Students",
        value: studentCount,
        color: "from-blue-500 to-cyan-500",
        icon: Users,
      },
      {
        label: "Avg / Dept",
        value: avg,
        color: "from-purple-500 to-pink-500",
        icon: BarChart3,
      },
    ];
  }, [departments.length, students.length, filteredDepartments.length]);

  return (
    <div className="min-h-screen space-y-6">
      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {typeof stat.total === "number" &&
                      stat.total !== stat.value && (
                        <span className="text-sm text-gray-500 ml-1">/ {stat.total}</span>
                      )}
                  </p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FORM ================= */}
      <DepartmentsForm
        onUpdate={loadDepartments}
        editingDepartment={editingDepartment}
        onCancelEdit={() => setEditingDepartment(null)}
      />

      {/* ================= FILTERS ================= */}
      <div className="rounded-2xl bg-white/40 border border-white shadow-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments by name, code, faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle Filters */}
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`px-4 py-2.5 rounded-xl border transition-all font-medium text-sm flex items-center gap-2 ${showFilters || hasActiveFilters
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white/80 text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && !showFilters && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">•</span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-200 grid sm:grid-cols-3 gap-3">
                {/* Faculty */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Faculty</label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Faculties</option>
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="code">Code (A-Z)</option>
                    <option value="recent">Recently Added</option>
                  </select>
                </div>

                {/* Clear */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= LIST ================= */}
      <DepartmentsList
        departments={filteredDepartments}
        loading={loading}
        onEdit={handleEdit}
        onView={setSelectedDepartment}
        onDelete={handleDelete}
        searchTerm={searchTerm}
      />

      {/* ================= MODAL ================= */}
      {selectedDepartment && (
        <DepartmentModal department={selectedDepartment} onClose={() => setSelectedDepartment(null)} />
      )}
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const DepartmentsList = ({ departments, loading, onEdit, onView, onDelete, searchTerm }) => {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white/40 border border-white shadow-lg p-12 text-center">
        <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4">
          <Building2 className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/40 border border-white shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {searchTerm ? "Search Results" : "All Departments"}
          </h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {departments.length} {departments.length === 1 ? "Department" : "Departments"}
        </span>
      </div>

      {departments.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
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

const EmptyState = ({ searchTerm }) => (
  <div className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      {searchTerm ? <Search className="w-12 h-12 text-gray-400" /> : <Building2 className="w-12 h-12 text-gray-400" />}
    </div>
    <p className="text-gray-500 font-medium">{searchTerm ? "No departments found" : "No departments yet"}</p>
    <p className="text-sm text-gray-400 mt-1">
      {searchTerm ? "Try adjusting your search or filters" : "Create your first department to get started"}
    </p>
  </div>
);

const DepartmentCard = ({ department, onEdit, onView, onDelete }) => {
  const imageUrl = getImageUrl(department);

  return (
    <div
      onClick={() => onView(department)}
      className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-200 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onView(department);
      }}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={department?.name || "Department"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-purple-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(department);
            }}
            aria-label="Edit department"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>

          <button
            type="button"
            className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(department.id);
            }}
            aria-label="Delete department"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {department?.name || "Unnamed Department"}
        </h4>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
            <Code className="w-3 h-3" />
            {department?.code || "N/A"}
          </span>
          {department?.faculty && <span className="text-xs text-gray-500">• {department.faculty}</span>}
        </div>

        {department?.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{department.description}</p>
        )}

        <div className="space-y-1.5 pt-3 border-t border-gray-200">
          {department?.contact_email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-purple-500" />
              <span className="truncate">{department.contact_email}</span>
            </div>
          )}
          {department?.phone_number && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-green-500" />
              <span>{department.phone_number}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
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
          <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
            {imageUrl ? (
              <img src={imageUrl} alt={department?.name || "Department"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-24 h-24 text-white/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-bold text-white mb-2">{department?.name || "Department"}</h2>
              <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                <Code className="w-4 h-4" />
                {department?.code || ""}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {department?.title && <InfoField label="Title" value={department.title} />}
            {department?.faculty && <InfoField label="Faculty" value={department.faculty} />}
            {department?.description && <InfoField label="Description" value={department.description} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              {department?.contact_email && (
                <ContactField icon={Mail} label="Email" value={department.contact_email} iconColor="text-purple-500" />
              )}
              {department?.phone_number && (
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
      <span className="break-words">{value}</span>
    </div>
  </div>
);

export default DepartmentsPage;
