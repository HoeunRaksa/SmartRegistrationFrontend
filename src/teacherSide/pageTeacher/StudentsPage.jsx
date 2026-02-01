import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Mail, Phone, BookOpen, Loader, UserPlus, UserCheck, Clock } from 'lucide-react';
import API from '../../api/index';
import Alert from '../../gobalConponent/Alert.jsx';
import { fetchTeacherStudents } from '../../api/teacher_api';

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchTeacherStudents();
      setStudents(res.data?.data || []);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['all', ...new Set(students.map(s => s.department).filter(Boolean))];

  const sendConnectionRequest = async (userId) => {
    try {
      setProcessingId(userId);
      await API.post("/social/friend-requests", { receiver_id: userId });
      setAlert({ show: true, message: "Connection request sent!", type: "success" });
      loadStudents(); // Refresh to update status if backend returned it (wait, TeacherStudent index doesn't return status yet)
    } catch (err) {
      if (err.response?.status === 409) {
        setAlert({ show: true, message: "Request already pending or connected.", type: "warning" });
      } else {
        setAlert({ show: true, message: err.response?.data?.message || "Failed to send request", type: "error" });
      }
    } finally {
      setProcessingId(null);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.student_id_card || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || student.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Students</h1>
        <p className="text-gray-600">View and manage students across your courses</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-6 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
          ))}
        </select>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Enrolled Courses</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                          {student.profile_picture_url ? (
                            <img src={student.profile_picture_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (student.full_name || 'S').charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.full_name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{student.student_id_card}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.courses?.map(c => (
                          <span key={c.id} className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200">
                            {c.course_name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <a href={`mailto:${student.email}`} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm">
                          <Mail className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => student.connection_status ? null : sendConnectionRequest(student.user_id)}
                          disabled={processingId === student.user_id || student.connection_status}
                          className={`p-2 rounded-lg transition-colors shadow-sm disabled:opacity-100 ${student.connection_status === 'accepted'
                              ? "bg-emerald-50 text-emerald-600"
                              : student.connection_status === 'pending'
                                ? "bg-amber-50 text-amber-600"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            }`}
                          title={student.connection_status === 'accepted' ? "Connected" : student.connection_status === 'pending' ? "Pending" : "Connect"}
                        >
                          {processingId === student.user_id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : student.connection_status === 'accepted' ? (
                            <UserCheck className="w-4 h-4" />
                          ) : student.connection_status === 'pending' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No students found</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentsPage;
