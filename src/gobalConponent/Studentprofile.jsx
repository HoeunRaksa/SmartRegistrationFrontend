import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Building2,
  Users,
  Loader,
} from "lucide-react";

const StudentProfile = ({ student, onClose }) => {
  // Early return if no student
  if (!student) return null;

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
          className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        >
          {/* Header Card */}
          <div className="relative overflow-hidden">
            {/* Background Gradient */}
            <div className="h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </motion.button>
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
                        src={`${student.profile_picture_url}`}
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
          </div>

          {/* Info Grid */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-gray-50 rounded-2xl p-6"
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
                className="bg-gray-50 rounded-2xl p-6"
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
              className="bg-gray-50 rounded-2xl p-6"
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
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