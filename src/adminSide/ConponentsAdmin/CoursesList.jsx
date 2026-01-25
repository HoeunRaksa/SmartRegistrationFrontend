import React, { useMemo, useState } from "react";
import { RefreshCcw, Pencil, Trash2, Search, BookOpen, User, Calendar, GraduationCap, Hash } from "lucide-react";
import { motion } from "framer-motion";

const CoursesList = ({ loading, courses, onEdit, onDelete, onRefresh }) => {
  const [q, setQ] = useState("");

  // ✅ build course name safely (frontend fallback)
  const buildCourseName = (c) => {
    // Prefer backend computed name if exists
    if (c?.display_name) return c.display_name;

    const subject =
      c?.majorSubject?.subject?.subject_name ??
      c?.majorSubject?.subject?.name ??
      "Unknown Subject";

    const className = c?.classGroup?.class_name;
    const year = c?.academic_year;
    const sem = c?.semester ? `Sem ${c.semester}` : null;

    const parts = [subject];
    if (className) parts.push(className);
    if (year) parts.push(year);
    if (sem) parts.push(sem);

    return parts.join(" — ");
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return courses;

    return courses.filter((c) => {
      const courseName = buildCourseName(c).toLowerCase();
      const majorName =
        c?.majorSubject?.major?.major_name ??
        c?.majorSubject?.major?.name ??
        "";
      const teacher =
        c?.teacher?.name ??
        c?.teacher?.full_name ??
        c?.teacher?.teacher_name ??
        "";
      const semester = String(c?.semester ?? "");
      const year = String(c?.academic_year ?? "");

      return (
        String(c?.id ?? "").includes(s) ||
        String(c?.major_subject_id ?? "").includes(s) ||
        courseName.includes(s) ||
        majorName.toLowerCase().includes(s) ||
        teacher.toLowerCase().includes(s) ||
        semester.includes(s) ||
        year.includes(s)
      );
    });
  }, [courses, q]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between p-5 border-b border-gray-200 bg-white/60">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Courses</h3>
            <p className="text-xs text-gray-500">
              {filtered.length} {filtered.length === 1 ? "course" : "courses"}
              {q && " (filtered)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses..."
              className="w-full md:w-64 rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
            />
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-purple-200/60 text-sm text-gray-700 hover:bg-white transition-all"
            type="button"
          >
            <RefreshCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  ID
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Course Name
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Teacher
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Semester
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Year
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full"
                    />
                    <span>Loading courses...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 rounded-full bg-gray-100">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-medium">No courses found</p>
                    {q && <p className="text-sm">Try adjusting your search</p>}
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((c, index) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  {/* ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{c.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* COURSE NAME */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 mt-0.5">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {buildCourseName(c)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Major Subject ID: {c.major_subject_id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* TEACHER */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {c?.teacher?.name ||
                          c?.teacher?.full_name ||
                          c?.teacher?.teacher_name || (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Teacher ID: {c.teacher_id || "—"}
                      </div>
                    </div>
                  </td>

                  {/* SEMESTER */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <GraduationCap className="w-3 h-3" />
                      Semester {c.semester}
                    </span>
                  </td>

                  {/* ACADEMIC YEAR */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <Calendar className="w-3 h-3" />
                      {c.academic_year}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit?.(c)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                        type="button"
                        title="Edit Course"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (confirm("Delete this course?")) {
                            onDelete?.(c.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        type="button"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-200 bg-white/60">
        <p className="text-xs text-gray-500">
          💡 Course name is computed from Subject + Class Group + Academic Year + Semester
        </p>
      </div>
    </motion.div>
  );
};

export default CoursesList;