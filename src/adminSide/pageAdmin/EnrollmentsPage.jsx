/* ========================= EnrollmentsPage.jsx ========================= */
import React, { useEffect, useMemo, useState } from "react";
import EnrollmentForm from "../ConponentsAdmin/EnrollmentForm.jsx";
import EnrollmentsList from "../ConponentsAdmin/EnrollmentsList.jsx";

import { fetchAllEnrollments } from "../../api/admin_course_api.jsx";
import { fetchStudents } from "../../api/student_api.jsx";
import { fetchCourses } from "../../api/course_api.jsx";
import { fetchDepartments, fetchMajorsByDepartment } from "../../api/department_api.jsx";

import { getCachedStudents, getCachedCourses } from "../../utils/dataCache";

import {
  BookOpen,
  Users,
  CheckCircle,
  GraduationCap,
  Building2,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  const [filters, setFilters] = useState({
    department_id: "",
    major_id: "",
    course_id: "",
    search: "",
  });

  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadEnrollments();
    setTimeout(() => loadStudents(), 150);
    setTimeout(() => loadCourses(), 300);
    setTimeout(() => loadDepartments(), 450);
  }, []);

  /* ================= HELPERS ================= */

  // ✅ major_id comes from registration, fallback to direct major_id if your API includes it
  const getStudentMajorId = (st) => {
    if (!st) return "";
    return String(
      st?.registration?.major_id ??
        st?.registration_major_id ??
        st?.major_id ??
        ""
    );
  };

  const getStudentDeptId = (st) => {
    if (!st) return "";
    return String(st?.department_id ?? st?.registration?.department_id ?? "");
  };

  // ✅ enrollment major can be returned directly by backend (recommended)
  // fallback to nested student.registration.major_id, or local student lookup
  const getEnrollmentMajorId = (e) => {
    if (!e) return "";
    return String(
      e?.major_id ??
        e?.student?.registration?.major_id ??
        e?.student?.major_id ??
        ""
    );
  };

  /* ================= LOADERS ================= */

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const res = await fetchAllEnrollments();
      const data = res?.data?.data || res?.data || [];
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await getCachedStudents(fetchStudents);
      const data = res?.data?.data || res?.data || [];
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setStudents([]);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await getCachedCourses(fetchCourses);
      const data = res?.data?.data || res?.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setCourses([]);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      const data = res?.data?.data || res?.data || [];
      setDepartments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setDepartments([]);
    }
  };

  const loadMajors = async (departmentId) => {
    if (!departmentId) {
      setMajors([]);
      return;
    }
    try {
      const res = await fetchMajorsByDepartment(departmentId);
      const data = res?.data?.data || res?.data || [];
      setMajors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMajors([]);
    }
  };

  /* ================= FILTER HANDLERS ================= */

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "department_id" ? { major_id: "" } : {}),
    }));

    if (key === "department_id") {
      loadMajors(value);
    }
  };

  /* ================= FILTERED STUDENTS / COURSES FOR SELECT ================= */

  const filteredStudentsForSelect = useMemo(() => {
    const dept = filters.department_id ? String(filters.department_id) : "";
    const major = filters.major_id ? String(filters.major_id) : "";
    const s = (filters.search || "").trim().toLowerCase();

    const arr = Array.isArray(students) ? students : [];
    return arr
      .filter((st) => {
        const stDept = getStudentDeptId(st);
        const stMajor = getStudentMajorId(st);

        const byDept = dept ? stDept === dept : true;
        const byMajor = major ? stMajor === major : true;

        if (!byDept || !byMajor) return false;

        if (!s) return true;

        const code = String(st.student_code || "").toLowerCase();
        const name = String(st.student_name || "").toLowerCase();
        const nameEn = String(st.full_name_en || "").toLowerCase();
        const nameKh = String(st.full_name_kh || "").toLowerCase();
        const nameKhAlt = String(st.student_name_kh || "").toLowerCase();
        const email = String(
          st.student_email || st.email || st.personal_email || ""
        ).toLowerCase();
        const phone = String(st.student_phone || st.phone_number || "").toLowerCase();
        const address = String(st.student_address || st.address || "").toLowerCase();

        return (
          code.includes(s) ||
          name.includes(s) ||
          nameEn.includes(s) ||
          nameKh.includes(s) ||
          nameKhAlt.includes(s) ||
          email.includes(s) ||
          phone.includes(s) ||
          address.includes(s)
        );
      })
      .map((st) => ({
        ...st,
        id: st.id,
        original: st, // Pass full student object
        // for EnrollmentForm select label
        name:
          (st.student_code ? `${st.student_code} — ` : "") +
          (st.student_name ||
            st.full_name_en ||
            st.full_name_kh ||
            st.student_name_kh ||
            st.name ||
            st.full_name ||
            `Student #${st.id}`),
      }));
  }, [students, filters.department_id, filters.major_id, filters.search]);

  const filteredCoursesForSelect = useMemo(() => {
    const courseId = filters.course_id ? String(filters.course_id) : "";
    const arr = Array.isArray(courses) ? courses : [];

    const list = arr.map((c) => ({
      ...c,
      name: c.course_name || c.display_name || `Course #${c.id}`,
    }));

    if (!courseId) return list;
    return list.filter((c) => String(c.id) === courseId);
  }, [courses, filters.course_id]);

  /* ================= FILTERED ENROLLMENTS (LIST) ================= */

  const filteredEnrollments = useMemo(() => {
    const dept = filters.department_id ? String(filters.department_id) : "";
    const major = filters.major_id ? String(filters.major_id) : "";
    const courseId = filters.course_id ? String(filters.course_id) : "";

    return (Array.isArray(enrollments) ? enrollments : []).filter((e) => {
      // Prefer server-provided nested objects if available
      const st = e.student || students.find((s) => s.id === e.student_id);
      const co = e.course || courses.find((c) => c.id === e.course_id);

      if (!st || !co) return false;

      const stDept = getStudentDeptId(st);
      const enMajor = getEnrollmentMajorId(e) || getStudentMajorId(st);

      const byDept = dept ? stDept === dept : true;
      const byMajor = major ? String(enMajor) === major : true;
      const byCourse = courseId ? String(co.id) === courseId : true;

      return byDept && byMajor && byCourse;
    });
  }, [
    enrollments,
    students,
    courses,
    filters.department_id,
    filters.major_id,
    filters.course_id,
  ]);

  /* ================= ACTIONS ================= */

  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    loadEnrollments();
    setEditingEnrollment(null);
  };

  const handleCancel = () => {
    setEditingEnrollment(null);
  };

  /* ================= QUICK STATS ================= */

  const enrolledCount = filteredEnrollments.filter(
    (e) => e.status === "enrolled"
  ).length;
  const completedCount = filteredEnrollments.filter(
    (e) => e.status === "completed"
  ).length;

  const quickStats = [
    {
      label: "Total Enrollments",
      value: filteredEnrollments.length,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      icon: BookOpen,
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      label: "Active Students",
      value: enrolledCount,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      icon: Users,
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      label: "Completed",
      value: completedCount,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      icon: CheckCircle,
      bgGradient: "from-purple-50 to-pink-50",
    },
  ];

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* ================= FILTER BAR ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl p-6 border-2 border-gray-200 shadow-xl shadow-gray-200/50"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-orange-100/30 rounded-full blur-3xl" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Filter Enrollments
              </h3>
              <p className="text-xs text-gray-500">
                Narrow down your search criteria
              </p>
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department */}
            <FilterSelect
              icon={Building2}
              value={filters.department_id}
              onChange={(v) => handleFilterChange("department_id", v)}
              options={departments.map((d) => ({
                id: d.id,
                label: d.department_name || d.name,
              }))}
              placeholder="All Departments"
              iconColor="text-blue-600"
              iconBg="from-blue-100 to-indigo-100"
            />

            {/* Major */}
            <FilterSelect
              icon={GraduationCap}
              value={filters.major_id}
              onChange={(v) => handleFilterChange("major_id", v)}
              options={majors.map((m) => ({
                id: m.id,
                label: m.major_name || m.name,
              }))}
              placeholder="All Majors"
              disabled={!filters.department_id}
              iconColor="text-purple-600"
              iconBg="from-purple-100 to-pink-100"
            />

            {/* Course */}
            <FilterSelect
              icon={BookOpen}
              value={filters.course_id}
              onChange={(v) => handleFilterChange("course_id", v)}
              options={courses.map((c) => ({
                id: c.id,
                label:
                  c.course_name || c.display_name || `Course #${c.id}`,
              }))}
              placeholder="All Courses"
              iconColor="text-teal-600"
              iconBg="from-teal-100 to-cyan-100"
            />

            {/* Search */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
                <Search className="w-4 h-4 text-orange-600" />
              </div>
              <input
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search student..."
                className="w-full pl-14 pr-4 py-3 rounded-2xl border-2 border-gray-300 bg-white text-sm outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">
                    {loading ? (
                      <span className="inline-block w-16 h-10 bg-gray-200 rounded-lg animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= FORM ================= */}
      <EnrollmentForm
        editingEnrollment={editingEnrollment}
        onUpdate={handleSuccess}
        onCancel={handleCancel}
        students={filteredStudentsForSelect}
        courses={filteredCoursesForSelect}
      />

      {/* ================= LIST ================= */}
      <EnrollmentsList
        enrollments={filteredEnrollments}
        onEdit={handleEdit}
        onRefresh={loadEnrollments}
      />
    </div>
  );
};

/* ================= FILTER SELECT COMPONENT ================= */
const FilterSelect = ({
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  iconColor,
  iconBg,
}) => (
  <div className="relative">
    <div
      className={`absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br ${iconBg}`}
    >
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full pl-14 pr-4 py-3 rounded-2xl border-2 border-gray-300 bg-white text-sm outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md appearance-none cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        paddingRight: "3rem",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default EnrollmentsPage;
