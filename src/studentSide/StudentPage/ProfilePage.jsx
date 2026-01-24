/* ========================= Student ProfilePage.jsx (FIX IMAGE + REAL DATA SAFE) =========================
   ✅ Fixes profile image when student is auth user (comes from Student model accessor profile_picture_url)
   ✅ No breaking your endpoints
   ✅ Adds: fallback image, safe url normalize, cache-bust after update, and no-crash when null
*/

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  Loader,
} from "lucide-react";

import { fetchStudentCourses } from "../../api/course_api";
import { fetchStudentSchedule } from "../../api/schedule_api";
import { fetchStudentGrades, fetchStudentGpa } from "../../api/grade_api";

// ⚠️ you already use this in your code; keep your real function import
import { fetchStudentProfile } from "../../api/student_api"; // <-- keep your real path

const safeStr = (v) => (v === null || v === undefined ? "" : String(v));

const normalizeUrl = (u) => {
  const s = safeStr(u).trim();
  if (!s) return "";
  // if already absolute => ok
  if (/^https?:\/\//i.test(s)) return s;
  // if starts with / => make absolute using your API base host
  const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";
  const cleanBase = rawBase.replace(/\/api\/?$|\/+$/g, "");
  return `${cleanBase}${s.startsWith("/") ? "" : "/"}${s}`;
};

const withCacheBust = (url, key) => {
  const u = normalizeUrl(url);
  if (!u) return "";
  const sep = u.includes("?") ? "&" : "?";
  return `${u}${sep}v=${encodeURIComponent(key)}`;
};

const ProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ used to force refresh the image after profile update / login / etc.
  const [imgKey, setImgKey] = useState(() => Date.now().toString());
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    loadStudentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);

      // 1) Profile (students table + relations)
      const profileRes = await fetchStudentProfile().catch(() => null);
      const profileData = profileRes?.data?.data || profileRes?.data?.student || profileRes?.data || null;

      // 2) GPA
      const gpaRes = await fetchStudentGpa().catch(() => null);
      const gpaData = gpaRes?.data?.data ?? gpaRes?.data ?? null;

      // 3) Courses
      const coursesRes = await fetchStudentCourses().catch(() => ({ data: { data: [] } }));
      const courses = Array.isArray(coursesRes?.data?.data) ? coursesRes.data.data : [];

      // 4) Grades
      const gradesRes = await fetchStudentGrades().catch(() => ({ data: { data: [] } }));
      const grades = Array.isArray(gradesRes?.data?.data) ? gradesRes.data.data : [];

      // 5) Schedule
      const scheduleRes = await fetchStudentSchedule().catch(() => ({ data: { data: [] } }));
      const schedule = Array.isArray(scheduleRes?.data?.data) ? scheduleRes.data.data : [];

      const normalizedCourses = courses.map((c) => ({
        course_code: c.course_code ?? c.code ?? c.course?.course_code ?? c.course?.code ?? "--",
        course_name: c.course_name ?? c.name ?? c.course?.course_name ?? c.course?.name ?? "--",
        credits: c.credits ?? c.course?.credits ?? 0,
        instructor: c.instructor ?? c.teacher ?? c.course?.instructor ?? "--",
      }));

      const mergedStudent = {
        ...(profileData || {}),

        // ✅ Support common student keys used in your UI
        name:
          profileData?.name ??
          profileData?.student_name ??
          profileData?.full_name_en ??
          profileData?.full_name ??
          "--",

        email:
          profileData?.email ??
          profileData?.student_email ??
          profileData?.user?.email ??
          "--",

        student_code:
          profileData?.student_code ??
          profileData?.code ??
          "--",

        // ✅ IMPORTANT: image from accessor in Student model
        profile_picture_url:
          profileData?.profile_picture_url ??
          profileData?.user?.profile_picture_url ??
          profileData?.user?.profile_picture_path ??
          "",

        // GPA
        current_gpa: gpaData?.current_gpa ?? gpaData?.gpa ?? profileData?.current_gpa ?? null,
        cumulative_gpa: gpaData?.cumulative_gpa ?? gpaData?.cgpa ?? profileData?.cumulative_gpa ?? null,

        credits_earned: profileData?.credits_earned ?? profileData?.total_credits ?? 0,

        enrolled_courses:
          Array.isArray(profileData?.enrolled_courses) && profileData.enrolled_courses.length > 0
            ? profileData.enrolled_courses
            : normalizedCourses,

        grades,
        schedule,
      };

      setStudent(mergedStudent);

      // ✅ refresh image view when profile loaded (also clears broken state)
      setImgBroken(false);
      setImgKey(Date.now().toString());
    } catch (error) {
      console.error("Failed to load student profile:", error);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const initials = useMemo(() => {
    const n = safeStr(student?.name).trim();
    return (n ? n.charAt(0) : "S").toUpperCase();
  }, [student?.name]);

  // ✅ final image url (absolute + cache bust)
  const imgSrc = useMemo(() => {
    return withCacheBust(student?.profile_picture_url, imgKey);
  }, [student?.profile_picture_url, imgKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
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
          {/* ✅ FIXED IMAGE BLOCK */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-white rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300" />

            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white/20 flex items-center justify-center">
              {/* show image only if exists and not broken */}
              {imgSrc && !imgBroken ? (
                <img
                  key={imgSrc} // ✅ forces re-mount on new url
                  src={imgSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImgBroken(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{initials}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center md:text-left text-white flex-1">
            <h1 className="text-3xl font-bold mb-2">{student?.name || "--"}</h1>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                <IdCard className="w-4 h-4" />
                <span className="font-semibold">{student?.student_code || "--"}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                <Building className="w-4 h-4" />
                <span>
                  {student?.department?.name ?? student?.department ?? "--"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                <GraduationCap className="w-4 h-4" />
                <span>
                  {student?.major?.name ?? student?.major ?? "--"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm opacity-90">
              <span>{student?.academic_year ?? student?.year ?? "--"}</span>
              <span>•</span>
              <span>{student?.semester ?? "--"}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-green-500/30 rounded">
                {student?.academic_status || "--"}
              </span>
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
              <p className="text-3xl font-bold">
                {student?.current_gpa !== null && student?.current_gpa !== undefined
                  ? Number(student.current_gpa).toFixed(2)
                  : "--"}
              </p>
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
              <p className="text-3xl font-bold">
                {student?.cumulative_gpa !== null && student?.cumulative_gpa !== undefined
                  ? Number(student.cumulative_gpa).toFixed(2)
                  : "--"}
              </p>
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
              <p className="text-3xl font-bold">{student?.credits_earned ?? 0}</p>
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
                <div className="font-semibold text-gray-900">{student?.email || "--"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-semibold text-gray-900">
                  {student?.phone_number ?? student?.phone ?? "--"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Date of Birth</div>
                <div className="font-semibold text-gray-900">
                  {student?.date_of_birth
                    ? new Date(student.date_of_birth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "--"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Gender</div>
                <div className="font-semibold text-gray-900">{student?.gender || "--"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-semibold text-gray-900">{student?.address || "--"}</div>
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
                <div className="font-semibold text-gray-900">
                  {student?.department?.name ?? student?.department ?? "--"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Major</div>
                <div className="font-semibold text-gray-900">
                  {student?.major?.name ?? student?.major ?? "--"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Enrollment Date</div>
                <div className="font-semibold text-gray-900">
                  {student?.enrollment_date
                    ? new Date(student.enrollment_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "--"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Expected Graduation</div>
                <div className="font-semibold text-gray-900">
                  {student?.expected_graduation
                    ? new Date(student.expected_graduation).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "--"}
                </div>
              </div>
            </div>

            {student?.scholarship && (
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-yellow-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Scholarship</div>
                  <div className="font-semibold text-gray-900">{student.scholarship}</div>
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
                <div className="font-semibold text-gray-900">
                  {student?.emergency_contact_name ?? student?.parent_name ?? "--"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-semibold text-gray-900">
                  {student?.emergency_contact_phone ?? student?.parent_phone ?? "--"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Relation</div>
                <div className="font-semibold text-gray-900">
                  {student?.emergency_contact_relation ?? "Parent"}
                </div>
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
            {(student?.enrolled_courses || []).map((course, index) => (
              <div
                key={`${course.course_code || "c"}-${index}`}
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
