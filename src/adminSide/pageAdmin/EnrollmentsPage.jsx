/* ========================= EnrollmentsPage.jsx (FULL, COLOR LIKE YOUR DESIGN, SERVER SEARCH) ========================= */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import EnrollmentForm from "../ConponentsAdmin/EnrollmentForm.jsx";
import EnrollmentsList from "../ConponentsAdmin/EnrollmentsList.jsx";

import { fetchAllEnrollments } from "../../api/admin_course_api.jsx";
import { fetchCourses } from "../../api/course_api.jsx";
import { fetchDepartments, fetchMajorsByDepartment } from "../../api/department_api.jsx";

import { searchStudents } from "../../api/student_api.jsx";

import { getCachedCourses } from "../../utils/dataCache";

import {
  BookOpen,
  Users,
  CheckCircle,
  GraduationCap,
  Building2,
  Search,
  Filter,
  RefreshCw,
  X,
  SlidersHorizontal,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ========================= UI PRIMITIVES (COLORFUL LIKE YOUR SAMPLE) ========================= */
const GlassPanel = ({ className = "", children }) => (
  <div
    className={[
      "relative overflow-hidden rounded-3xl p-6",
      "bg-gradient-to-br from-white via-white to-gray-50",
      "border-2 border-gray-200 shadow-xl shadow-gray-200/50",
      className,
    ].join(" ")}
  >
    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-pink-100/30 to-orange-100/30 rounded-full blur-3xl" />
    <div className="relative">{children}</div>
  </div>
);

const IconGradient = ({ icon: Icon, gradient, className = "" }) => (
  <div className={["p-2.5 rounded-xl shadow-lg", `bg-gradient-to-br ${gradient}`, className].join(" ")}>
    <Icon className="w-5 h-5 text-white" />
  </div>
);

const Pill = ({ className = "", children }) => (
  <span
    className={[
      "inline-flex items-center gap-2 rounded-full px-3 py-1",
      "bg-white/80 border border-white shadow-sm",
      "text-xs font-bold text-gray-700",
      className,
    ].join(" ")}
  >
    {children}
  </span>
);

const SoftButton = ({ icon: Icon, children, onClick, disabled, variant = "ghost" }) => {
  const base = "h-10 px-4 rounded-2xl text-sm font-bold transition-all border-2 shadow-sm hover:shadow-md";
  const style =
    variant === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100/70"
      : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[base, style, disabled ? "opacity-60 cursor-not-allowed" : ""].join(" ")}
    >
      <span className="flex items-center gap-2">{Icon ? <Icon className="w-4 h-4" /> : null}{children}</span>
    </button>
  );
};

/* ================= FILTER SELECT COMPONENT (COLOR LIKE YOUR SAMPLE) ================= */
const FilterSelect = ({
  icon: Icon,
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  iconBg = "from-blue-100 to-indigo-100",
  iconColor = "text-blue-600",
  ringColor = "focus:ring-blue-500/20 focus:border-blue-500",
}) => (
  <div className="relative">
    <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br ${iconBg}`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={[
        "w-full pl-14 pr-4 py-3 rounded-2xl",
        "border-2 border-gray-300 bg-white text-sm outline-none",
        "transition-all shadow-sm hover:shadow-md appearance-none cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:ring-4",
        ringColor,
      ].join(" ")}
      style={{
        backgroundImage:
          `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        paddingRight: "3rem",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={String(opt.id)} value={String(opt.id)}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterSearchInput = ({ value, onChange }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
      <Search className="w-4 h-4 text-orange-600" />
    </div>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search student (server)…"
      className="w-full pl-14 pr-4 py-3 rounded-2xl border-2 border-gray-300 bg-white text-sm outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
    />
  </div>
);

/* ================= QUICK STAT CARD ================= */
const StatCard = ({ label, value, loading, icon: Icon, gradient, bgGradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-3xl p-6 border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 group`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="relative flex items-center gap-4">
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </motion.div>

      <div>
        <p className="text-4xl font-black text-gray-900 tracking-tight">
          {loading ? <span className="inline-block w-16 h-10 bg-gray-200 rounded-lg animate-pulse" /> : value}
        </p>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  </motion.div>
);

/* ========================= PAGE ========================= */
const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  // ✅ SERVER students state (small list)
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentsHasMore, setStudentsHasMore] = useState(false);

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
    loadCourses();
    loadDepartments();
    // NOTE: we DO NOT load all students (million) anymore
  }, []);

  /* ================= ENROLLMENT INDEX (FAST CHECK) ================= */
  const enrollmentKeySet = useMemo(() => {
    const s = new Set();
    (Array.isArray(enrollments) ? enrollments : []).forEach((e) => {
      if (e?.student_id && e?.course_id) s.add(`${Number(e.student_id)}:${Number(e.course_id)}`);
    });
    return s;
  }, [enrollments]);

  const isAlreadyEnrolled = (studentId, courseId) => {
    if (!studentId || !courseId) return false;
    return enrollmentKeySet.has(`${Number(studentId)}:${Number(courseId)}`);
  };

  /* ================= LOADERS ================= */
  const loadEnrollments = async () => {
    try {
      setLoading(true);

      // ✅ recommended: server side filter by dept/major/course/search in API
      const res = await fetchAllEnrollments({
        department_id: filters.department_id || undefined,
        major_id: filters.major_id || undefined,
        course_id: filters.course_id || undefined,
        q: (filters.search || "").trim() || undefined,
        per_page: 50,
      });

      const data = res?.data?.data || res?.data || [];
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setEnrollments([]);
    } finally {
      setLoading(false);
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

  /* ================= SERVER STUDENT SEARCH =================
     ✅ MUST exist: searchStudents({ department_id, major_id, q, page, per_page })
  */
  const runStudentSearch = useCallback(
    async (qText, page = 1, append = false) => {
      try {
        setStudentsLoading(true);

        const res = await searchStudents({
          department_id: filters.department_id || undefined,
          major_id: filters.major_id || undefined,
          q: (qText || "").trim() || undefined,
          page,
          per_page: 30,
        });

        const payload = res?.data?.data ?? res?.data ?? [];
        const meta = res?.data?.meta ?? null;

        const list = Array.isArray(payload) ? payload : [];
        const newItems = list.map((s) => ({
          ...s,
          id: s.id,
          student_code: s.student_code || s.student_code,
          student_name: s.student_name || s.full_name_en || s.full_name_kh,
          email: s.email || s?.user?.email,
          profile_picture_url: s.profile_picture_url,
        }));

        setStudents((prev) => (append ? [...prev, ...newItems] : newItems));
        setStudentsPage(page);

        // has more
        if (meta && typeof meta.current_page === "number" && typeof meta.last_page === "number") {
          setStudentsHasMore(meta.current_page < meta.last_page);
        } else {
          setStudentsHasMore(list.length === 30);
        }
      } catch (e) {
        console.error(e);
        if (!append) setStudents([]);
        setStudentsHasMore(false);
      } finally {
        setStudentsLoading(false);
      }
    },
    [filters.department_id, filters.major_id]
  );

  const onSearchStudents = (text) => {
    runStudentSearch(text, 1, false);
  };

  const onLoadMoreStudents = () => {
    const next = Number(studentsPage || 1) + 1;
    runStudentSearch(filters.search, next, true);
  };

  /* ================= FILTER HANDLERS ================= */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "department_id" ? { major_id: "" } : {}),
    }));

    if (key === "department_id") loadMajors(value);
  };

  const clearFilters = () => {
    setFilters({ department_id: "", major_id: "", course_id: "", search: "" });
    setMajors([]);
    setStudents([]);
    setStudentsPage(1);
    setStudentsHasMore(false);
  };

  const hasAnyFilter =
    !!filters.department_id || !!filters.major_id || !!filters.course_id || !!(filters.search || "").trim();

  // reload enrollments when filters change (server-side)
  useEffect(() => {
    loadEnrollments();
    // refresh student search too (so form list is always correct)
    if (filters.department_id || filters.major_id || (filters.search || "").trim()) {
      runStudentSearch(filters.search, 1, false);
    } else {
      setStudents([]);
      setStudentsPage(1);
      setStudentsHasMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.department_id, filters.major_id, filters.course_id, filters.search]);

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
  const enrolledCount = (Array.isArray(enrollments) ? enrollments : []).filter((e) => e.status === "enrolled").length;
  const completedCount = (Array.isArray(enrollments) ? enrollments : []).filter((e) => e.status === "completed").length;

  const quickStats = [
    {
      label: "Total Enrollments",
      value: (Array.isArray(enrollments) ? enrollments : []).length,
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassPanel>
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <IconGradient icon={Filter} gradient="from-indigo-500 to-purple-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Filter Enrollments</h3>
                <p className="text-xs text-gray-500">Server filters + fast student search</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SoftButton icon={RefreshCw} onClick={loadEnrollments} disabled={loading}>
                Refresh
              </SoftButton>
              {hasAnyFilter ? (
                <SoftButton icon={X} onClick={clearFilters} disabled={loading} variant="danger">
                  Clear
                </SoftButton>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterSelect
              icon={Building2}
              value={filters.department_id}
              onChange={(v) => handleFilterChange("department_id", v)}
              options={departments.map((d) => ({
                id: d.id,
                label: d.department_name || d.name || `Department #${d.id}`,
              }))}
              placeholder="All Departments"
              iconColor="text-blue-600"
              iconBg="from-blue-100 to-indigo-100"
              ringColor="focus:ring-blue-500/20 focus:border-blue-500"
            />

            <FilterSelect
              icon={GraduationCap}
              value={filters.major_id}
              onChange={(v) => handleFilterChange("major_id", v)}
              options={majors.map((m) => ({
                id: m.id,
                label: m.major_name || m.name || `Major #${m.id}`,
              }))}
              placeholder="All Majors"
              disabled={!filters.department_id}
              iconColor="text-purple-600"
              iconBg="from-purple-100 to-pink-100"
              ringColor="focus:ring-purple-500/20 focus:border-purple-500"
            />

            <FilterSelect
              icon={BookOpen}
              value={filters.course_id}
              onChange={(v) => handleFilterChange("course_id", v)}
              options={courses.map((c) => ({
                id: c.id,
                label: c.course_name || c.display_name || `Course #${c.id}`,
              }))}
              placeholder="All Courses"
              iconColor="text-teal-600"
              iconBg="from-teal-100 to-cyan-100"
              ringColor="focus:ring-teal-500/20 focus:border-teal-500"
            />

            <FilterSearchInput value={filters.search} onChange={(v) => handleFilterChange("search", v)} />
          </div>

          <AnimatePresence>
            {hasAnyFilter ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-5 flex flex-wrap items-center gap-2"
              >
                <Pill>
                  <SlidersHorizontal className="w-4 h-4 text-gray-700" />
                  Showing <span className="font-black text-gray-900">{(Array.isArray(enrollments) ? enrollments : []).length}</span>
                </Pill>
                {filters.department_id ? <Pill>Dept: {filters.department_id}</Pill> : null}
                {filters.major_id ? <Pill>Major: {filters.major_id}</Pill> : null}
                {filters.course_id ? <Pill>Course: {filters.course_id}</Pill> : null}
                {(filters.search || "").trim() ? <Pill>Search: “{(filters.search || "").trim()}”</Pill> : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </GlassPanel>
      </motion.div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <StatCard loading={loading} icon={stat.icon} label={stat.label} value={stat.value} gradient={stat.gradient} bgGradient={stat.bgGradient} />
          </motion.div>
        ))}
      </div>

      {/* ================= FORM ================= */}
      <EnrollmentForm
        editingEnrollment={editingEnrollment}
        onUpdate={handleSuccess}
        onCancel={handleCancel}
        students={students}                 // ✅ SMALL server results
        studentsLoading={studentsLoading}   // ✅ for UI
        onSearchStudents={onSearchStudents} // ✅ search inside table
        onLoadMoreStudents={onLoadMoreStudents}
        hasMoreStudents={studentsHasMore}
        courses={courses}
        isAlreadyEnrolled={isAlreadyEnrolled}
      />

      {/* ================= LIST ================= */}
      <EnrollmentsList
        enrollments={enrollments}
        onEdit={handleEdit}
        onRefresh={loadEnrollments}
        loading={loading}
      />
    </div>
  );
};

export default EnrollmentsPage;
