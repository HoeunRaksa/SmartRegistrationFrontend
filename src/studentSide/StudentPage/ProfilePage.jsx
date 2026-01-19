import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  GraduationCap,
  IdCard,
  Users,
  Building,
  Loader
} from 'lucide-react';
import profileFallback from '../../assets/images/profile.png';

const ProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      // Mock student data
      const mockStudent = {
        id: userData.id || 1,
        student_code: 'STU2024001',
        name: userData.name || 'John Smith',
        email: userData.email || 'john.smith@university.edu',
        phone: '+1 (555) 123-4567',
        date_of_birth: '2003-05-15',
        gender: 'Male',
        address: '123 University Ave, Campus City, ST 12345',
        profile_picture_url: userData.profile_picture_url || null,

        // Academic Info
        department: 'Computer Science',
        major: 'Software Engineering',
        year: '2nd Year',
        semester: 'Spring 2026',
        enrollment_date: '2024-09-01',
        expected_graduation: '2028-05-31',
        academic_status: 'Active',

        // GPA and Credits
        current_gpa: 3.75,
        cumulative_gpa: 3.68,
        total_credits: 45,
        credits_earned: 45,

        // Contact Info
        emergency_contact_name: 'Jane Smith',
        emergency_contact_phone: '+1 (555) 987-6543',
        emergency_contact_relation: 'Mother',

        // Additional Info
        nationality: 'United States',
        admission_type: 'Regular Admission',
        scholarship: 'Merit Scholarship 50%',

        // Enrolled Courses
        enrolled_courses: [
          {
            course_code: 'CS101',
            course_name: 'Introduction to Computer Science',
            credits: 3,
            instructor: 'Dr. Sarah Johnson'
          },
          {
            course_code: 'MATH201',
            course_name: 'Calculus II',
            credits: 4,
            instructor: 'Prof. Michael Chen'
          },
          {
            course_code: 'ENG102',
            course_name: 'Academic Writing',
            credits: 3,
            instructor: 'Dr. Emily White'
          }
        ]
      };

      setStudent(mockStudent);
    } catch (error) {
      console.error('Failed to load student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 border border-white/20 shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-white rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
            <img
              src={student?.profile_picture_url || profileFallback}
              alt="Profile"
              className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
            />
          </div>
          <div className="text-center md:text-left text-white flex-1">
            <h1 className="text-3xl font-bold mb-2">{student?.name}</h1>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                <IdCard className="w-4 h-4" />
                <span className="font-semibold">{student?.student_code}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                <Building className="w-4 h-4" />
                <span>{student?.department}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                <GraduationCap className="w-4 h-4" />
                <span>{student?.major}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm opacity-90">
              <span>{student?.year}</span>
              <span>•</span>
              <span>{student?.semester}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-green-500/30 rounded">{student?.academic_status}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Academic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Current GPA</p>
              <p className="text-3xl font-bold">{student?.current_gpa?.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Cumulative GPA</p>
              <p className="text-3xl font-bold">{student?.cumulative_gpa?.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Credits Earned</p>
              <p className="text-3xl font-bold">{student?.credits_earned}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold">{student?.enrolled_courses?.length || 0}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-semibold text-gray-900">{student?.email}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-semibold text-gray-900">{student?.phone}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Date of Birth</div>
                <div className="font-semibold text-gray-900">
                  {new Date(student?.date_of_birth).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Gender</div>
                <div className="font-semibold text-gray-900">{student?.gender}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-semibold text-gray-900">{student?.address}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <GraduationCap className="w-6 h-6 text-purple-500" />
            </div>
            Academic Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Department</div>
                <div className="font-semibold text-gray-900">{student?.department}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Major</div>
                <div className="font-semibold text-gray-900">{student?.major}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Enrollment Date</div>
                <div className="font-semibold text-gray-900">
                  {new Date(student?.enrollment_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Expected Graduation</div>
                <div className="font-semibold text-gray-900">
                  {new Date(student?.expected_graduation).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
            {student?.scholarship && (
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-yellow-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Scholarship</div>
                  <div className="font-semibold text-gray-900">{student?.scholarship}</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10">
              <Users className="w-6 h-6 text-red-500" />
            </div>
            Emergency Contact
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-semibold text-gray-900">{student?.emergency_contact_name}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-semibold text-gray-900">{student?.emergency_contact_phone}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Relation</div>
                <div className="font-semibold text-gray-900">{student?.emergency_contact_relation}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-green-500/10">
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
            Current Courses
          </h2>
          <div className="space-y-3">
            {student?.enrolled_courses?.map((course, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-blue-600">{course.course_code}</div>
                  <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg font-semibold">
                    {course.credits} Credits
                  </div>
                </div>
                <div className="font-medium text-gray-900 mb-1">{course.course_name}</div>
                <div className="text-sm text-gray-600">{course.instructor}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
