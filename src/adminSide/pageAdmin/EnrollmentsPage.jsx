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
  Layers,
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
      <span className="flex items-center gap-2">
        {Icon ? <Icon className="w-4 h-4" /> : null}
        {children}
      </span>
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
  name,
}) => (
  <div className="relative">
    <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br ${iconBg}`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>

    <select
      name={name}
      id={name}
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

const FilterSearchInput = ({ value, onChange, name = "search" }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
      <Search className="w-4 h-4 text-orange-600" />
    </div>
    <input
      id={name}
      name={name}
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
          {loading ? <span className="inline-block w-16 h-10 bg-gray-200 rounded-lg animate-pulse" /> : Number(value || 0).toLocaleString()}
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

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentsHasMore, setStudentsHasMore] = useState(false);

  const YEARS = useMemo(() => ["2024-2025", "2025-2026", "2026-2027"], []);
  const SEMESTERS = useMemo(() => ["1", "2", "3"], []);

  const [filters, setFilters] = useState({
    department_id: "",
    major_id: "",
    course_id: "",
    academic_year: "",
    semester: "",
    search: "",
  });

  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadCourses();
    loadDepartments();
    loadEnrollments({
      department_id: "",
      major_id: "",
      course_id: "",
      q: "",
      academic_year: "",
      semester: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const loadEnrollments = async (override = null) => {
    const f = override || filters;

    try {
      setLoading(true);

      const res = await fetchAllEnrollments({
        department_id: f.department_id || undefined,
        major_id: f.major_id || undefined,
        course_id: f.course_id || undefined,
        academic_year: f.academic_year || undefined,
        semester: f.semester || undefined,
        q: (f.search || "").trim() || undefined,
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

  /* ================= SERVER STUDENT SEARCH ================= */
  const runStudentSearch = useCallback(
    async (qText, page = 1, append = false) => {
      try {
        setStudentsLoading(true);
        
        const res = await searchStudents({
          department_id: filters.department_id || undefined,
          major_id: filters.major_id || undefined,
          academic_year: filters.academic_year || undefined,
          semester: filters.semester || undefined,
          q: (qText || "").trim() || undefined,
          page,
          per_page: 30,
        });

        const list = res?.data?.data || [];
        const meta = res?.data?.meta || {};
        
        setStudents((prev) => (append ? [...prev, ...list] : list));
        setStudentsPage(page);
        setStudentsHasMore(meta.current_page < meta.last_page);
      } catch (error) {
        console.error('Failed to search students:', error);
        setStudents(append ? students : []);
      } finally {
        setStudentsLoading(false);
      }
    },
    [filters.department_id, filters.major_id, filters.academic_year, filters.semester]
  );

  const onSearchStudents = (text) => {
    setStudentsPage(1);
    setStudentsHasMore(false);
    runStudentSearch(text, 1, false);
  };

  const onLoadMoreStudents = () => {
    const next = studentsPage + 1;
    runStudentSearch(filters.search, next, true);
  };

  /* ================= FILTER HANDLERS ================= */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "department_id") {
        next.major_id = "";
      }

      if (key === "academic_year" || key === "semester") {
        next.course_id = "";
      }

      return next;
    });

    if (key === "department_id") loadMajors(value);
  };

  const clearFilters = () => {
    setFilters({ department_id: "", major_id: "", course_id: "", academic_year: "", semester: "", search: "" });
    setMajors([]);
    setStudents([]);
    setStudentsPage(1);
    setStudentsHasMore(false);
  };

  const hasAnyFilter =
    !!filters.department_id ||
    !!filters.major_id ||
    !!filters.course_id ||
    !!filters.academic_year ||
    !!filters.semester ||
    !!(filters.search || "").trim();

  useEffect(() => {
    const t = setTimeout(() => {
      loadEnrollments();

      const hasStudentFilters =
        !!filters.department_id ||
        !!filters.major_id ||
        !!filters.academic_year ||
        !!filters.semester ||
        !!(filters.search || "").trim();

      if (hasStudentFilters) {
        setStudentsPage(1);
        setStudentsHasMore(false);
        runStudentSearch(filters.search, 1, false);
      } else {
        setStudents([]);
        setStudentsPage(1);
        setStudentsHasMore(false);
      }
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.department_id, filters.major_id, filters.academic_year, filters.semester, filters.search, filters.course_id]);

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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <StatCard
              loading={loading}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              gradient={stat.gradient}
              bgGradient={stat.bgGradient}
            />
          </motion.div>
        ))}
      </div>
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
              <SoftButton icon={RefreshCw} onClick={() => loadEnrollments()} disabled={loading}>
                Refresh
              </SoftButton>
              {hasAnyFilter ? (
                <SoftButton icon={X} onClick={clearFilters} disabled={loading} variant="danger">
                  Clear
                </SoftButton>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <FilterSelect
              name="department_id"
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
              name="major_id"
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
              name="academic_year"
              icon={Calendar}
              value={filters.academic_year}
              onChange={(v) => handleFilterChange("academic_year", v)}
              options={YEARS.map((y) => ({ id: y, label: y }))}
              placeholder="Academic Year"
              iconColor="text-indigo-600"
              iconBg="from-indigo-100 to-violet-100"
              ringColor="focus:ring-indigo-500/20 focus:border-indigo-500"
            />

            <FilterSelect
              name="semester"
              icon={Layers}
              value={filters.semester}
              onChange={(v) => handleFilterChange("semester", v)}
              options={SEMESTERS.map((s) => ({ id: s, label: `Sem ${s}` }))}
              placeholder="Semester"
              iconColor="text-sky-600"
              iconBg="from-sky-100 to-cyan-100"
              ringColor="focus:ring-sky-500/20 focus:border-sky-500"
            />

            <FilterSelect
              name="course_id"
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

            <FilterSearchInput value={filters.search} onChange={(v) => handleFilterChange("search", v)} name="search" />
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
                  Showing{" "}
                  <span className="font-black text-gray-900">
                    {(Array.isArray(enrollments) ? enrollments : []).length}
                  </span>
                </Pill>
                {filters.department_id ? <Pill>Dept: {filters.department_id}</Pill> : null}
                {filters.major_id ? <Pill>Major: {filters.major_id}</Pill> : null}
                {filters.academic_year ? <Pill>Year: {filters.academic_year}</Pill> : null}
                {filters.semester ? <Pill>Sem: {filters.semester}</Pill> : null}
                {filters.course_id ? <Pill>Course: {filters.course_id}</Pill> : null}
                {(filters.search || "").trim() ? <Pill>Search: "{(filters.search || "").trim()}"</Pill> : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </GlassPanel>
      </motion.div>



      <EnrollmentForm
        editingEnrollment={editingEnrollment}
        onUpdate={handleSuccess}
        onCancel={handleCancel}
        students={students}
        studentsLoading={studentsLoading}
        onSearchStudents={onSearchStudents}
        onLoadMoreStudents={onLoadMoreStudents}
        hasMoreStudents={studentsHasMore}
        courses={courses}
        isAlreadyEnrolled={isAlreadyEnrolled}
        filterSignature={`${filters.department_id}|${filters.major_id}|${filters.academic_year}|${filters.semester}|${filters.course_id}`}
      />

      <EnrollmentsList
        enrollments={enrollments}
        onEdit={handleEdit}
        onRefresh={() => loadEnrollments()}
        loading={loading}
      />
    </div>
  );
};

export default EnrollmentsPage;