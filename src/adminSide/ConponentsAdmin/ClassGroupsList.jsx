// =====================================================
// src/adminSide/ConponentsAdmin/ClassGroupsList.jsx
// ✅ FULL CLEAN NO CUT — no duplicate helpers
// - safe filter
// - better table wrapper
// =====================================================
import React, { memo, useMemo, useState } from "react";
import { Edit3, Trash2, RefreshCw, Search } from "lucide-react";

const rowCls = "border-t border-white/50 hover:bg-white/40 transition";
const safeLower = (v) => String(v ?? "").trim().toLowerCase();

const ClassGroupsList = memo(function ClassGroupsList({
  loading,
  classGroups = [],
  onEdit,
  onDelete,
  onRefresh,
  onViewStudents, // ✅ optional: click class -> view students
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = safeLower(query);
    const arr = Array.isArray(classGroups) ? classGroups : [];
    if (!q) return arr;

    return arr.filter((cg) => {
      const className = safeLower(cg?.class_name);
      const ay = safeLower(cg?.academic_year);
      const shift = safeLower(cg?.shift);
      const sem = safeLower(cg?.semester);
      const majorName = safeLower(cg?.major?.major_name ?? cg?.major_name);

      return (
        className.includes(q) ||
        ay.includes(q) ||
        shift.includes(q) ||
        sem.includes(q) ||
        majorName.includes(q)
      );
    });
  }, [classGroups, query]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-2xl shadow-[0_22px_70px_-30px_rgba(15,23,42,0.35)] p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Class Groups</h3>
          <p className="text-xs text-gray-600 mt-0.5">Search / edit / delete</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl px-10 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition-all hover:border-white/80 focus:ring-2 focus:ring-blue-400/35 focus:border-blue-300"
              placeholder="Search class, major, year, shift..."
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 border border-white/60 hover:bg-white transition shadow-sm"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="text-sm font-semibold text-gray-800">
              {loading ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-600">Loading class groups...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-600">No class groups found.</div>
      ) : (
        <div className="overflow-auto rounded-2xl border border-white/60 bg-white/50">
          <table className="min-w-full text-sm">
            <thead className="bg-white/60">
              <tr className="text-left text-gray-600">
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Major</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((cg) => {
                const majorText =
                  cg?.major?.major_name ??
                  cg?.major_name ??
                  (cg?.major_id ? `Major #${cg.major_id}` : "-");

                const semesterText =
                  cg?.semester === 1 || cg?.semester === "1"
                    ? "1"
                    : cg?.semester === 2 || cg?.semester === "2"
                      ? "2"
                      : (cg?.semester ?? "-");

                return (
                  <tr key={cg.id} className={rowCls}>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {cg.class_name ?? "-"}
                    </td>

                    <td className="py-3 px-4 text-gray-700">{majorText}</td>
                    <td className="py-3 px-4 text-gray-700">{cg.academic_year ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-700">{semesterText}</td>
                    <td className="py-3 px-4 text-gray-700">{cg.shift ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-700">{cg.capacity ?? "-"}</td>

                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {onViewStudents && (
                          <button
                            type="button"
                            onClick={() => onViewStudents(cg)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50/80 border border-blue-200 hover:bg-blue-50 transition shadow-sm"
                          >
                            <span className="text-xs font-semibold text-blue-700">Students</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onEdit?.(cg)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/60 hover:bg-white transition shadow-sm"
                        >
                          <Edit3 size={16} className="text-gray-700" />
                          <span className="text-xs font-semibold text-gray-800">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const ok = window.confirm(`Delete class group "${cg.class_name}"?`);
                            if (!ok) return;
                            onDelete?.(cg.id);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50/80 border border-red-200 hover:bg-red-50 transition shadow-sm"
                        >
                          <Trash2 size={16} className="text-red-600" />
                          <span className="text-xs font-semibold text-red-700">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default ClassGroupsList;
