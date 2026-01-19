import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteStudent } from "../../../src/api/student_api.jsx";
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Loader,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const StudentsTable = ({ students, loading, onView, onUpdate, onEdit }) => {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const filterStudents = () => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((student) =>
      student.full_name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.full_name_kh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      setDeleting(true);
      await deleteStudent(studentToDelete.id);
      
      setSuccess(`${studentToDelete.full_name_en} has been deleted successfully`);
      setShowDeleteModal(false);
      setStudentToDelete(null);
      
      if (onUpdate) {
        onUpdate();
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
      setShowDeleteModal(false);
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleEdit = (student) => {
    if (onEdit) {
      onEdit(student);
    }
  };

const handleExport = () => {
  const dataToExport = filteredStudents; // or students

  // ✅ choose ONLY needed columns here
  const columns = [
    { key: "student_code", label: "Student Code" },
    { key: "full_name_en", label: "Name (EN)" },
    { key: "full_name_kh", label: "Name (KH)" },
    { key: "gender", label: "Gender" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "nationality", label: "Nationality" },
    { key: "phone_number", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "generation", label: "Generation" },

    // relations (real data)
    { key: "department.name", label: "Department" },
    { key: "department.code", label: "Dept Code" },
    { key: "user.email", label: "User Email" },
    { key: "registration.payment_status", label: "Payment Status" },

    // optional
    { key: "profile_picture_url", label: "Profile Picture URL" },
    { key: "created_at", label: "Created At" },
  ];

  const getValue = (obj, path) =>
    path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : ""), obj);

  const escapeCSV = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;

  const normalizeCell = (key, v) => {
    // keep codes/phones as text for Excel
    if (/phone|student_code|student_id/i.test(key) && v !== "") return `="${v}"`;
    return v ?? "";
  };

  const headers = columns.map((c) => c.label);

  const rows = dataToExport.map((s) =>
    columns.map((c) => normalizeCell(c.key, getValue(s, c.key)))
  );

  const csv = "\uFEFF" + [
    headers.map(escapeCSV).join(","),
    ...rows.map((r) => r.map(escapeCSV).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};




  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl shadow-lg"
          >
            <div className="p-1 bg-green-100 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-800 flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, student code, or phone..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/80"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white/80"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            disabled={currentStudents.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-white/50"
      >
        {currentStudents.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Generation
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentStudents.map((student, index) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      index={index}
                      onView={() => onView(student)}
                      onEdit={() => handleEdit(student)}
                      onDelete={() => confirmDelete(student)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredStudents.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDeleteModal}
        student={studentToDelete}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setStudentToDelete(null);
        }}
        deleting={deleting}
      />
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 bg-gradient-to-br ${colors[color]} rounded-2xl shadow-lg`}>
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const StudentRow = ({ student, index, onView, onEdit, onDelete }) => (
  <motion.tr
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="hover:bg-blue-50/50 transition-colors"
  >
    <td className="px-6 py-4">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
        {student.student_code}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden shadow-md">
          {student.profile_picture_path ? (
            <img
              src={`${student.profile_picture_url}`}
              alt={student.full_name_en}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-lg font-bold">${student.full_name_en?.charAt(0) || "S"}</span>`;
              }}
            />
          ) : (
            <span className="text-lg font-bold">{student.full_name_en?.charAt(0) || "S"}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{student.full_name_en}</p>
          <p className="text-xs text-gray-500">{student.full_name_kh}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="text-sm text-gray-600">{student.gender}</span>
    </td>
    <td className="px-6 py-4">
      <span className="text-sm text-gray-600">{student.phone_number || "-"}</span>
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
        {student.generation || "-"}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center justify-end gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onView}
          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </td>
  </motion.tr>
);

const EmptyState = ({ searchTerm }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <GraduationCap className="w-16 h-16 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      {searchTerm ? "No students found" : "No students yet"}
    </h3>
    <p className="text-gray-500 mb-6">
      {searchTerm
        ? "Try adjusting your search criteria"
        : "Get started by adding your first student"}
    </p>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> students
      </p>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        {[...Array(totalPages)].map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(i + 1)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === i + 1
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-gray-200 hover:bg-gray-50 bg-white"
            }`}
          >
            {i + 1}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

const DeleteModal = ({ show, student, onConfirm, onCancel, deleting }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={!deleting ? onCancel : undefined}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Delete Student</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{student?.full_name_en}</span>?
            <br />
            <span className="text-sm text-gray-500">Student code: {student?.student_code}</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentsTable;