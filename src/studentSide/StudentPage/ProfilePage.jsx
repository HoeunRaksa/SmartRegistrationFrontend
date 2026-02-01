/* ========================= Student ProfilePage.jsx (FIX IMAGE + REAL DATA SAFE) =========================
   ✅ Fixes profile image when student is auth user (comes from Student model accessor profile_picture_url)
   ✅ No breaking your endpoints
   ✅ Adds: fallback image, safe url normalize, cache-bust after update, and no-crash when null
*/

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
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
  Star,
  BookMarked,
  ShieldCheck,
} from "lucide-react";

import { fetchStudentCourses } from "../../api/course_api";
import { fetchStudentSchedule } from "../../api/schedule_api";
import { fetchStudentGrades, fetchStudentGpa } from "../../api/grade_api";

// ⚠️ you already use this in your code; keep your real function import
import { fetchStudentProfile } from "../../api/student_api"; // <-- keep your real path
import { premiumColors } from "../../theme/premiumColors";

const safeStr = (v) => (v === null || v === undefined ? "" : String(v));

const normalizeUrl = (u) => {
  const s = safeStr(u).trim();
  if (!s || s === "null" || s === "undefined") return "";
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

const InfoChip = ({ icon: Icon, value, label, variant = "light" }) => {
  const color = variant === "dark" ? premiumColors.blue : premiumColors.slate;
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${color.bg} border border-white shadow-sm`}>
      <div className={`p-2 rounded-xl border-2 border-white ${color.icon} text-white shadow-md`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-black uppercase tracking-widest leading-none mb-1 text-slate-700">{label}</p>
        <p className="text-sm font-black truncate text-slate-900">{value || "---"}</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, colorKey = "blue", delay }) => {
  const color = premiumColors[colorKey] || premiumColors.blue;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`group relative ${color.bg} backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white transition-all duration-500 shadow-sm hover:shadow-md overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`p-4 rounded-2xl ${color.icon} text-white shadow-lg group-hover:rotate-12 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-4xl font-black text-slate-800 tracking-tight relative z-10 leading-none mb-2">
        {typeof value === 'number' ? value.toFixed(2) : (value || "0")}
      </p>
      <p className="text-[12px] font-black text-slate-700 uppercase tracking-widest relative z-10 mt-2">{label}</p>
    </motion.div>
  );
};

const ContactItem = ({ icon: Icon, label, value, colorKey = "blue" }) => {
  const color = premiumColors[colorKey] || premiumColors.blue;
  return (
    <div className={`flex items-start gap-5 p-6 rounded-[2rem] bg-white border border-slate-100 transition-all group shadow-sm hover:shadow-md`}>
      <div className={`p-3.5 rounded-2xl ${color.icon} text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className={`text-[12px] font-black uppercase tracking-widest mb-1.5 opacity-60 text-slate-700`}>{label}</p>
        <p className="text-sm font-black text-slate-800 break-words leading-none">{value || "Unspecified"}</p>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ used to force refresh the image after profile update / login / etc.
  const [imgKey, setImgKey] = useState(() => Date.now().toString());
  const [imgBroken, setImgBroken] = useState(false);
  const [showDigitalId, setShowDigitalId] = useState(false);

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
        instructor: c.instructor?.name || c.instructor || c.teacher?.name || c.teacher || c.course?.instructor?.name || c.course?.instructor || "--",
      }));

      const mergedStudent = {
        ...(profileData || {}),

        // ✅ Support common student keys used in your UI
        name:
          profileData?.name ??
          profileData?.student_name ??
          profileData?.full_name_en ??
          profileData?.full_name ??
          "--", // Fallback for loading state or unknown; will be hidden by conditional rendering if possible

        email:
          profileData?.email ??
          profileData?.student_email ??
          profileData?.user?.email ??
          "--",

        student_code:
          profileData?.student_code ??
          profileData?.code ??
          "",

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

        // Academic info
        department: profileData?.department?.name ?? profileData?.department ?? "",
        major: profileData?.major?.name ?? profileData?.major ?? "",
        academic_year: profileData?.academic_year ?? profileData?.year ?? "",
        semester: profileData?.semester ?? "",
        academic_status: profileData?.academic_status ?? "Active",

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
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Premium Profile Header - Soft Glass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white shadow-xl"
      >
        <div className="relative p-10 md:p-14 overflow-hidden">
          {/* Soft Decorative Accents */}
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-blue-100/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-indigo-50/40 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
            {/* Artistic Avatar */}
            <div className="relative shrink-0 group">
              <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-[3.5rem] overflow-hidden border-4 border-white bg-white shadow-sm ring-1 ring-slate-100">
                {imgSrc && !imgBroken ? (
                  <img
                    key={imgSrc}
                    src={imgSrc}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={() => setImgBroken(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center">
                    <span className="text-slate-200 text-8xl font-black">{initials}</span>
                  </div>
                )}
                {/* Status Indicator */}
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-emerald-400 border-4 border-white rounded-full shadow-sm" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-none mb-3">
                    {student?.name || "Student Name"}
                  </h1>
                  <p className="text-slate-700 font-black uppercase tracking-[0.3em] text-[12px]">Academic Node Registry</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDigitalId(true)}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                >
                  <IdCard className="w-5 h-5" />
                  AUTHENTICATE ID
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <InfoChip icon={IdCard} value={student?.student_code} label="Index Code" variant="dark" />
                <InfoChip icon={Building} value={student?.department} label="Department" variant="dark" />
                <InfoChip icon={GraduationCap} value={student?.major} label="Specialization" variant="dark" />
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Year {student?.academic_year || "---"} Node</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cycle {student?.semester || "---"}</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-50/50 text-emerald-500 border border-emerald-100 shadow-sm font-black uppercase tracking-widest text-[11px]">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {student?.academic_status || "ACTIVE NODE"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Clean Academic Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Current GPA"
          value={student?.current_gpa}
          icon={Award}
          colorKey="emerald"
          delay={0.1}
        />
        <StatCard
          label="Academic Merit"
          value={student?.cumulative_gpa}
          icon={GraduationCap}
          colorKey="blue"
          delay={0.2}
        />
        <StatCard
          label="Credits Earned"
          value={student?.credits_earned}
          icon={BookOpen}
          colorKey="indigo"
          delay={0.3}
        />
        <StatCard
          label="Live Courses"
          value={student?.enrolled_courses?.length}
          icon={Users}
          colorKey="blue"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Intelligence */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white shadow-xl relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-12 relative z-10">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4 uppercase tracking-tighter">
              <div className="w-2.5 h-10 bg-blue-500 rounded-full" />
              Connectivity
            </h2>
            <div className={`w-12 h-12 rounded-2xl ${premiumColors.blue.icon} text-white flex items-center justify-center shadow-lg`}>
              <User className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <ContactItem icon={Mail} label="Academic Email" value={student?.email} colorKey="blue" />
            <ContactItem icon={Phone} label="Secure Hotline" value={student?.phone_number} colorKey="indigo" />
            <ContactItem icon={Calendar} label="Birth Registry" value={student?.date_of_birth} colorKey="emerald" />
            <ContactItem icon={User} label="Gender Node" value={student?.gender} colorKey="blue" />
          </div>

          <div className="mt-8 p-8 rounded-[2.5rem] bg-white/60 border border-white flex items-start gap-5 relative z-10 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center border border-white shadow-inner shrink-0">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1.5 leading-none">Registered Residence</p>
              <p className="text-sm font-black text-slate-700 leading-relaxed uppercase">{student?.address || "Data pending verification."}</p>
            </div>
          </div>
        </motion.div>

        {/* Academic Record / Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white shadow-xl relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-12 relative z-10">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4 uppercase tracking-tighter">
              <div className="w-2.5 h-10 bg-indigo-500 rounded-full" />
              Curriculum
            </h2>
            <div className={`w-12 h-12 rounded-2xl ${premiumColors.indigo.icon} text-white flex items-center justify-center shadow-lg`}>
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-5 overflow-y-auto max-h-[350px] pr-3 scrollbar-hide relative z-10">
            {(student?.enrolled_courses || []).map((course, index) => (
              <div
                key={`${course.course_code || "c"}-${index}`}
                className="group p-6 bg-white/60 hover:bg-white border border-white hover:border-indigo-100 rounded-[2.2rem] transition-all flex items-center justify-between shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-2 leading-none">{course.course_code}</span>
                  <h4 className="text-[15px] font-black text-slate-800 uppercase truncate max-w-[220px] leading-tight">{course.course_name}</h4>
                  <p className="text-[11px] text-slate-700 font-black mt-2 uppercase tracking-widest opacity-60">Professor: {course.instructor}</p>
                </div>
                <div className="px-5 py-2.5 bg-blue-50/50 text-blue-400 rounded-xl border border-white text-[10px] font-black uppercase shadow-inner">
                  {course.credits} Credits
                </div>
              </div>
            ))}
            {(!student?.enrolled_courses || student.enrolled_courses.length === 0) && (
              <div className="py-24 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                <BookMarked className="w-14 h-14 mx-auto mb-4 text-slate-200" />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">Empty Curriculum Node</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-10 border-t border-slate-100/50 relative z-10">
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Academic Integrity Node</span>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Authenticated & Secure</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security & Emergency Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white relative overflow-hidden group shadow-xl"
        >
          <h3 className="text-2xl font-black mb-12 text-slate-800 relative z-10 uppercase tracking-tighter flex items-center gap-4">
            <div className="w-2.5 h-10 bg-emerald-500 rounded-full" />
            Security Node
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
            <div className="p-8 rounded-[2.5rem] bg-white/80 border border-white transition-all hover:bg-white shadow-sm">
              <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-3 leading-none">Guardian Node</p>
              <p className="text-[15px] font-black text-slate-800 truncate uppercase mt-4 mb-6">{student?.emergency_contact_name ?? student?.parent_name ?? "--"}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl text-[9px] font-black text-blue-400 border border-blue-100 uppercase tracking-widest shadow-inner">
                {student?.emergency_contact_relation ?? "Parent"}
              </div>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/80 border border-white transition-all hover:bg-white shadow-sm">
              <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-3 leading-none">Secure Hotline</p>
              <p className="text-[15px] font-black text-slate-800 truncate mt-4 mb-6">{student?.emergency_contact_phone ?? student?.parent_phone ?? "--"}</p>
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3 cursor-pointer">
                VERIFY NODE <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between shadow-2xl">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Access State</p>
                <div className="flex items-center gap-4 mt-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-300 shadow-emerald-500/20" />
                  <span className="text-xs font-black uppercase text-white tracking-[0.2em]">VERIFIED</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 font-black mt-6 tracking-widest uppercase opacity-60">TRUSTED_KEY_AUTH</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 text-slate-900 flex flex-col justify-center items-center text-center group relative overflow-hidden border border-white shadow-xl"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 12 }}
            className={`w-24 h-24 rounded-[3rem] ${premiumColors.blue.icon} text-white flex items-center justify-center mb-8 shadow-lg relative z-10 shadow-blue-500/20`}
          >
            <Users className="w-10 h-10" />
          </motion.div>
          <h4 className="text-3xl font-black relative z-10 leading-none uppercase tracking-tighter">SOCIAL<br />CIRCLE</h4>
          <p className="text-slate-700 text-[11px] font-black uppercase tracking-widest mt-4 mb-10 relative z-10 opacity-70">Global Directory</p>
          <button
            onClick={() => navigate?.('/social/friends')}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] hover:bg-black transition-all active:scale-95 relative z-10 uppercase tracking-widest shadow-xl shadow-slate-900/10"
          >
            Access Nodes
          </button>
        </motion.div>
      </div>

      {showDigitalId && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60"
            onClick={() => setShowDigitalId(false)}
          >
            <motion.div
              initial={{ scale: 0.9, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.9, rotateY: -90 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] aspect-[1/1.6] bg-white rounded-[3rem] p-8 border border-slate-200 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full items-center text-center">
                <div className="w-full flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-white text-xs">N</div>
                    <span className="font-bold text-slate-900 tracking-wide">NOVATECH</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase">Student Node</span>
                </div>

                <div className="w-36 h-36 rounded-2xl border-4 border-slate-50 p-1 bg-slate-100 mb-6 group transition-transform duration-500 hover:scale-105 shadow-sm">
                  {imgSrc && !imgBroken ? (
                    <img src={imgSrc} alt="ID" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center">
                      <span className="text-4xl font-black text-slate-400">{student?.name?.charAt(0) || 'S'}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1 uppercase tracking-tight">{student?.name}</h2>
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{student?.student_code}</p>

                <div className="grid grid-cols-2 gap-4 w-full mb-auto mt-4">
                  <div className="text-left p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Registry</p>
                    <p className="text-[10px] font-black text-slate-700 truncate uppercase">{student?.department || 'N/A'}</p>
                  </div>
                  <div className="text-left p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Sector</p>
                    <p className="text-[10px] font-black text-slate-700 truncate uppercase">{student?.major || 'N/A'}</p>
                  </div>
                </div>

                <div className="w-full pt-6 border-t border-slate-100 mt-8 text-center">
                  <div className="h-10 w-full bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden mb-3 border border-slate-100">
                    <div className="flex gap-1 opacity-40">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className={`w-0.5 h-6 ${Math.random() > 0.3 ? 'bg-slate-900' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Valid Academic Cycle 2024-2025</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default ProfilePage;
