import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchStudents, deleteStudent } from "../../../src/api/student_api.jsx";
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Loader,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StudentsTable = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

const loadStudents = async () => {
  try {
    setLoading(true);
    const response = await fetchStudents();

    const list = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    setStudents(list);
    setFilteredStudents(list);
    setError(null);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to load students");
    setStudents([]);
    setFilteredStudents([]);
  } finally {
    setLoading(false);
  }
};


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
      await deleteStudent(studentToDelete.id);
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl text-white">
                <GraduationCap className="w-8 h-8" />
              </div>
              Students Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and view all registered students</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/students/create")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </motion.button>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Students" value={students.length} color="blue" />
          <StatCard label="Active" value={students.length} color="green" />
          <StatCard label="Departments" value={new Set(students.map(s => s.department_id)).size} color="purple" />
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, student code, or phone..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5" />
              <span className="font-medium">Export</span>
            </button>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {currentStudents.length === 0 ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
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
                        onView={() => navigate(`/students/${student.id}`)}
                        onEdit={() => navigate(`/students/edit/${student.id}`)}
                        onDelete={() => confirmDelete(student)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredStudents.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDeleteModal}
        student={studentToDelete}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setStudentToDelete(null);
        }}
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
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 bg-gradient-to-br ${colors[color]} rounded-2xl`}>
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
    className="hover:bg-blue-50/30 transition-colors"
  >
    <td className="px-6 py-4">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
        {student.student_code}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {student.full_name_en?.charAt(0) || "S"}
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
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> students
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const DeleteModal = ({ show, student, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onCancel}
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
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentsTable;