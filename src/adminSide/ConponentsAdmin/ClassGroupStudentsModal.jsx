import { createPortal } from "react-dom";
import { X, Search, UserPlus, Loader, Users, RefreshCw, Building2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchStudents } from "../../api/student_api.jsx";
import {
  fetchClassGroupStudents,
  assignStudentClassGroupManual,
} from "../../api/student_class_group_api.jsx";
import { fetchDepartments, fetchMajorsByDepartment } from "../../api/department_api.jsx";
import Alert from "../../gobalConponent/Alert.jsx";

const safeArr = (res) => {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data;
  return Array.isArray(d) ? d : [];
};

/* ========================= ANIMATION VARIANTS ========================= */
const animations = {
  overlay: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },
  modal: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", duration: 0.4, bounce: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
    },
  },
  list: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    },
  },
  item: {
    hidden: { opacity: 0, x: -10 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
  },
};

/* ========================= UI COMPONENTS ========================= */
const GlassCard = ({ className = "", children }) => (
  <div
    className={[
      "rounded-3xl border-2 border-white/40 bg-white/70 backdrop-blur-xl",
      "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[variant]}`}>
      {children}
    </span>
  );
};

const Button = ({
  children,
  onClick,
  disabled,
  loading,
  variant = "primary",
  icon: Icon,
  className = ""
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]",
    secondary: "bg-white/80 border-2 border-gray-300 text-gray-900 hover:bg-white hover:border-gray-400",
    ghost: "bg-white/60 border-2 border-white/60 text-gray-700 hover:bg-white hover:border-white/80",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all",
        variants[variant],
        disabled || loading ? "opacity-60 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
};

const FilterSelect = ({ icon: Icon, value, onChange, options, placeholder, disabled, name }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 pointer-events-none z-10">
      <Icon className="w-3.5 h-3.5 text-blue-700" />
    </div>
    <select
      name={name}
      id={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={[
        "w-full pl-11 pr-10 py-2.5 rounded-xl",
        "border-2 border-gray-300 bg-white/90 text-sm font-semibold text-gray-900",
        "outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500",
        "transition-all shadow-sm appearance-none cursor-pointer",
        disabled ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
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

const StudentCard = ({ student, onAction, actionLabel, actionIcon: ActionIcon, actionVariant = "success" }) => {
  const studentId = student.id || student.student_id;
  const name = student.full_name_en || student.full_name_kh || student.name || `Student #${studentId}`;
  const code = student.student_code || "-";
  const email = student.email || student.personal_email || "-";
  const avatar = student.profile_picture_url || student.avatar_url;

  return (
    <motion.div
      variants={animations.item}
      className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/80 border-2 border-white/60 hover:border-white/80 hover:bg-white transition-all group"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-11 h-11 rounded-xl object-cover border-2 border-white/80 shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white/80 flex items-center justify-center shadow-sm">
              <span className="text-base font-black text-blue-700">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-600">Code: <span className="font-semibold">{code}</span></span>
            <span className="text-gray-400">•</span>
            <span className="text-xs text-gray-600 truncate">Email: <span className="font-semibold">{email}</span></span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onAction && (
        <Button
          variant={actionVariant}
          icon={ActionIcon}
          onClick={() => onAction(student)}
          className="flex-shrink-0"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
    <p className="text-xs text-gray-600 max-w-xs">{description}</p>
  </div>
);

/* ========================= MAIN MODAL ========================= */
const ClassGroupStudentsModal = ({ open, group, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [studentsInClass, setStudentsInClass] = useState([]);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [candidates, setCandidates] = useState([]);

  // ✅ ONLY DEPARTMENT & MAJOR FILTERS (no academic_year/semester - group already has those)
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [filters, setFilters] = useState({
    department_id: "",
    major_id: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const periodParams = useMemo(
    () => ({
      academic_year: group?.academic_year,
      semester: group?.semester,
    }),
    [group?.academic_year, group?.semester]
  );

  // ✅ LOAD DEPARTMENTS
  useEffect(() => {
    if (!open) return;

    const loadDepts = async () => {
      try {
        const res = await fetchDepartments();
        setDepartments(safeArr(res));
      } catch (e) {
        console.error(e);
      }
    };

    loadDepts();
  }, [open]);

  // ✅ LOAD MAJORS WHEN DEPARTMENT CHANGES
  useEffect(() => {
    if (!filters.department_id) {
      setMajors([]);
      return;
    }

    const loadMajors = async () => {
      try {
        const res = await fetchMajorsByDepartment(filters.department_id);
        setMajors(safeArr(res));
      } catch (e) {
        console.error(e);
        setMajors([]);
      }
    };

    loadMajors();
  }, [filters.department_id]);

  const loadClassStudents = async () => {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const res = await fetchClassGroupStudents(group.id, periodParams);
      setStudentsInClass(safeArr(res));
    } catch (e) {
      console.error(e);
      setStudentsInClass([]);
      setError(e?.response?.data?.message || "Failed to load students in this class.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !group?.id) return;
    loadClassStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, group?.id]);

  const doSearch = async () => {
    setError("");
    setSuccess("");

    try {
      setSearching(true);

      // ✅ USE SERVER-SIDE SEARCH WITH ONLY DEPT/MAJOR FILTERS
      const res = await searchStudents({
        q: search.trim() || undefined,
        department_id: filters.department_id || undefined,
        major_id: filters.major_id || undefined,
        per_page: 50,
      });

      const list = safeArr(res);

      // Remove students already in class list
      const existingIds = new Set(studentsInClass.map((s) => String(s.id)));
      const filtered = list.filter((s) => !existingIds.has(String(s.id)));

      setCandidates(filtered);
    } catch (e) {
      console.error(e);
      setCandidates([]);
      setError(e?.response?.data?.message || "Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const addStudent = async (student) => {
    setError("");
    setSuccess("");
    try {
      const payload = {
        class_group_id: group.id,
        academic_year: group.academic_year,
        semester: Number(group.semester),
      };

      await assignStudentClassGroupManual(student.id, payload);

      // Refresh list
      await loadClassStudents();

      // Remove from candidates list
      setCandidates((prev) => prev.filter((x) => String(x.id) !== String(student.id)));

      setSuccess(`${student.full_name_en || student.full_name_kh || 'Student'} added successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.message ||
        (e?.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(", ")
          : "Failed to add student to this class.")
      );
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };

      // Clear major when department changes
      if (key === "department_id") {
        next.major_id = "";
      }

      return next;
    });
  };

  const clearFilters = () => {
    setFilters({
      department_id: "",
      major_id: "",
    });
    setSearch("");
    setCandidates([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doSearch();
    }
  };

  const hasActiveFilters = filters.department_id || filters.major_id || search;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          variants={animations.overlay}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            variants={animations.modal}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-7xl rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 border-2 border-white/60 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* ========================= HEADER ========================= */}
            <div className="relative overflow-hidden px-6 py-5 border-b-2 border-white/60 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex-shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">
                      {group.class_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="info">{group.academic_year}</Badge>
                      <Badge variant="info">Semester {group.semester}</Badge>
                      {group.shift && <Badge variant="default">{group.shift}</Badge>}
                      <Badge variant="success">
                        <Users className="w-3 h-3" />
                        {studentsInClass.length} Students
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  icon={X}
                  onClick={onClose}
                  className="flex-shrink-0"
                />
              </div>
            </div>

            {/* ========================= ALERTS ========================= */}
            <Alert
              isOpen={!!error}
              type="error"
              message={error}
              onClose={() => setError("")}
            />
            <Alert
              isOpen={!!success}
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />

            {/* ========================= CONTENT ========================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto flex-1">
              {/* ========================= LEFT: CURRENT STUDENTS ========================= */}
              <GlassCard className="h-fit">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
                        <Users className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-gray-900">Current Students</h4>
                        <p className="text-xs text-gray-600">
                          {loading ? "Loading..." : `${studentsInClass.length} enrolled`}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      icon={RefreshCw}
                      onClick={loadClassStudents}
                      loading={loading}
                      className="flex-shrink-0"
                    >
                      Refresh
                    </Button>
                  </div>

                  <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : studentsInClass.length === 0 ? (
                      <EmptyState
                        icon={Users}
                        title="No students yet"
                        description="Use the search panel to find and add students to this class"
                      />
                    ) : (
                      <motion.div
                        variants={animations.list}
                        initial="hidden"
                        animate="show"
                        className="space-y-2"
                      >
                        {studentsInClass.map((s, index) => {
                          const studentId = s.id || s.student_id || index;
                          const key = `current-${studentId}-${group.id}`;
                          return <StudentCard key={key} student={s} />;
                        })}
                      </motion.div>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* ========================= RIGHT: ADD STUDENTS ========================= */}
              <GlassCard className="h-fit">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                      <UserPlus className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900">Add Students</h4>
                      <p className="text-xs text-gray-600">Filter by department/major and search</p>
                    </div>
                  </div>

                  {/* ✅ FILTER DROPDOWNS - ONLY DEPT & MAJOR */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <FilterSelect
                      icon={Building2}
                      name="department_id"
                      value={filters.department_id}
                      onChange={(v) => handleFilterChange("department_id", v)}
                      options={departments.map((d) => ({
                        id: d.id,
                        label: d.department_name || d.name || `Dept ${d.id}`,
                      }))}
                      placeholder="All Departments"
                    />

                    <FilterSelect
                      icon={GraduationCap}
                      name="major_id"
                      value={filters.major_id}
                      onChange={(v) => handleFilterChange("major_id", v)}
                      options={majors.map((m) => ({
                        id: m.id,
                        label: m.major_name || m.name || `Major ${m.id}`,
                      }))}
                      placeholder="All Majors"
                      disabled={!filters.department_id}
                    />
                  </div>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <div className="mb-3">
                      <Button
                        variant="ghost"
                        icon={X}
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full rounded-2xl border-2 border-gray-300 bg-white/90 backdrop-blur-xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="Search by name, code, email..."
                      />
                    </div>

                    <Button
                      variant="primary"
                      icon={Search}
                      onClick={doSearch}
                      loading={searching}
                    >
                      Search
                    </Button>
                  </div>

                  {/* Search Results */}
                  <div className="max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                    {searching ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : candidates.length === 0 ? (
                      <EmptyState
                        icon={Search}
                        title="No search results"
                        description="Filter by department/major and search by name, code, or email to find students"
                      />
                    ) : (
                      <motion.div
                        variants={animations.list}
                        initial="hidden"
                        animate="show"
                        className="space-y-2"
                      >
                        {candidates.map((s, index) => {
                          const studentId = s.id || s.student_id || index;
                          const key = `candidate-${studentId}`;
                          return (
                            <StudentCard
                              key={key}
                              student={s}
                              onAction={addStudent}
                              actionLabel="Add"
                              actionIcon={UserPlus}
                              actionVariant="success"
                            />
                          );
                        })}
                      </motion.div>
                    )}
                  </div>

                  {/* Info Note */}
                  <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <span className="font-bold">💡 Tip:</span> Filter by department first, then select a major to narrow down your search. Students will be added to <strong>{group.academic_year} Semester {group.semester}</strong>.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* ========================= FOOTER ========================= */}
            <div className="px-6 py-4 border-t-2 border-white/60 bg-white/60 flex justify-end flex-shrink-0">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ClassGroupStudentsModal;