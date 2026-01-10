import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchStudent } from "../api/student_api";
import {
  GraduationCap,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  Building2,
  Users,
  Loader,
  AlertCircle,
} from "lucide-react";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
  try {
    setLoading(true);
    setError(null);

    if (!id) {
      throw new Error("Student ID is missing");
    }

    const response = await fetchStudent(id);

    // ✅ IMPORTANT FIX
    setStudent(response.data.data);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to load student Profile");
  } finally {
    setLoading(false);
  }
};


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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Student</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/students")}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Students
          </button>
        </motion.div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          {/* Background Gradient */}
          <div className="h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-2xl border-4 border-white">
                  {student.profile_picture_path ? (
                    <img
                      src={`${student.profile_picture_path}`}
                      alt={student.full_name_en}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  ) : (
                    <GraduationCap className="w-20 h-20" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white" />
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {student.full_name_en}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">{student.full_name_kh}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      <Hash className="w-4 h-4" />
                      {student.student_code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      <GraduationCap className="w-4 h-4" />
                      Generation {student.generation}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={Calendar} label="Date of Birth" value={student.date_of_birth} />
              <InfoItem icon={User} label="Gender" value={student.gender} />
              <InfoItem icon={MapPin} label="Nationality" value={student.nationality} />
              <InfoItem icon={Phone} label="Phone Number" value={student.phone_number} />
              <InfoItem icon={MapPin} label="Address" value={student.address} className="md:col-span-2" />
            </div>
          </motion.div>

          {/* Academic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Academic</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Department</p>
                <p className="text-sm font-semibold text-gray-800">
                  {student.department?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Registration ID</p>
                <p className="text-sm font-semibold text-gray-800">
                  #{student.registration_id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">User ID</p>
                <p className="text-sm font-semibold text-gray-800">
                  #{student.user_id || "N/A"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Parent Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Parent/Guardian Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={User} label="Parent/Guardian Name" value={student.parent_name} />
            <InfoItem icon={Phone} label="Parent/Guardian Phone" value={student.parent_phone} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={className}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-gray-400" />
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
    <p className="text-sm font-medium text-gray-800 ml-6">{value || "-"}</p>
  </div>
);

export default StudentProfile;