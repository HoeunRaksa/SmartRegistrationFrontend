import React, { useMemo, useState } from "react";
import { RefreshCcw, Pencil, Trash2, Search } from "lucide-react";

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
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm p-5">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Courses</h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/40">
            <Search size={16} className="text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search course, subject, teacher..."
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/40 hover:bg-white transition"
            type="button"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/30">
        <table className="min-w-full text-sm">
          <thead className="bg-white/60">
            <tr className="text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Course Name</th>
              <th className="p-3">Teacher</th>
              <th className="p-3">Semester</th>
              <th className="p-3">Academic Year</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white/40">
            {loading && (
              <tr>
                <td className="p-3 text-gray-600" colSpan={6}>
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td className="p-3 text-gray-600" colSpan={6}>
                  No courses found.
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((c) => (
                <tr key={c.id} className="border-t border-white/30">
                  <td className="p-3 font-medium text-gray-900">
                    {c.id}
                  </td>

                  {/* ✅ COURSE NAME */}
                  <td className="p-3 text-gray-800">
                    <div className="text-xs text-gray-500">
                      major_subject_id: {c.major_subject_id}
                    </div>
                    <div className="font-semibold">
                      {buildCourseName(c)}
                    </div>
                  </td>

                  {/* TEACHER */}
                  <td className="p-3 text-gray-800">
                    <div className="text-xs text-gray-500">
                      teacher_id: {c.teacher_id}
                    </div>
                    <div className="font-medium">
                      {c?.teacher?.name ||
                        c?.teacher?.full_name ||
                        c?.teacher?.teacher_name ||
                        "—"}
                    </div>
                  </td>

                  <td className="p-3">{c.semester}</td>
                  <td className="p-3">{c.academic_year}</td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(c)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/40 hover:bg-white transition"
                        type="button"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("Delete this course?")) {
                            onDelete?.(c.id);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                        type="button"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-gray-500 mt-3">
        Course name is computed from Subject + Class Group + Academic Year + Semester.
      </p>
    </div>
  );
};

export default CoursesList;
