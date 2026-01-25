// =====================================================
// src/adminSide/ConponentsAdmin/ClassGroupsList.jsx
// ✅ ENHANCED UI - All logic preserved
// =====================================================
import React, { memo, useMemo, useState } from "react";
import { Edit3, Trash2, RefreshCw, Search, Users, BookOpen, Calendar, Clock, GraduationCap } from "lucide-react";

const rowCls = "border-t border-white/50 hover:bg-white/60 transition-all duration-200";
const safeLower = (v) => String(v ?? "").trim().toLowerCase();

const ClassGroupsList = memo(function ClassGroupsList({
  loading,
  classGroups = [],
  onEdit,
  onDelete,
  onRefresh,
  onViewStudents,
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Class Groups</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Manage and organize your class groups • {filtered.length} {filtered.length === 1 ? 'class' : 'classes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/70 border border-white/60 flex items-center justify-center">
              <Search className="w-4 h-4 text-gray-600" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl pl-12 pr-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition-all hover:border-white/80 focus:ring-2 focus:ring-blue-400/35 focus:border-blue-300 placeholder:text-gray-500"
              placeholder="Search class, major, year, shift..."
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <span className="text-lg">×</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/70 border border-white/60 hover:bg-white hover:shadow-md transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <RefreshCw size={16} className={`text-gray-700 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm font-semibold text-gray-800 hidden sm:inline">
              {loading ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
          <p className="text-sm font-semibold text-gray-600">Loading class groups...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {query ? "No results found" : "No class groups yet"}
          </p>
          <p className="text-xs text-gray-600">
            {query ? "Try adjusting your search criteria" : "Create your first class group to get started"}
          </p>
        </div>
      ) : (
        <div className="overflow-auto rounded-2xl border border-white/60 bg-white/50 shadow-inner">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-white/80 to-white/60 sticky top-0">
              <tr className="text-left text-gray-700 border-b border-white/60">
                <th className="py-4 px-4 font-bold">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    Class
                  </div>
                </th>
                <th className="py-4 px-4 font-bold">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    Major
                  </div>
                </th>
                <th className="py-4 px-4 font-bold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Academic Year
                  </div>
                </th>
                <th className="py-4 px-4 font-bold">Semester</th>
                <th className="py-4 px-4 font-bold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Shift
                  </div>
                </th>
                <th className="py-4 px-4 font-bold">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    Capacity
                  </div>
                </th>
                <th className="py-4 px-4 text-right font-bold">Actions</th>
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
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-700">
                            {cg.class_name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">{cg.class_name ?? "-"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-gray-700 font-medium">{majorText}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 border border-white/60">
                        <span className="text-xs font-semibold text-gray-700">
                          {cg.academic_year ?? "-"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                        <span className="text-xs font-bold text-purple-700">
                          Sem {semesterText}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-gray-700">
                        {cg.shift || <span className="text-gray-400 italic">No shift</span>}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-800">
                        {cg.capacity || <span className="text-gray-400">-</span>}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        {/* 👥 Students */}
                        {onViewStudents && (
                          <button
                            type="button"
                            onClick={() => onViewStudents(cg)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 hover:from-blue-100 hover:to-blue-200/50 transition-all shadow-sm hover:shadow"
                          >
                            <Users size={14} className="text-blue-700" />
                            <span className="text-xs font-bold text-blue-700">
                              Students
                            </span>
                          </button>
                        )}

                        {/* ✏️ Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit?.(cg)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/70 border border-white/60 hover:bg-white hover:shadow-md transition-all shadow-sm"
                        >
                          <Edit3 size={14} className="text-gray-700" />
                          <span className="text-xs font-bold text-gray-800">Edit</span>
                        </button>

                        {/* 🗑 Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            const ok = window.confirm(`Delete class group "${cg.class_name}"?`);
                            if (!ok) return;
                            onDelete?.(cg.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 hover:from-red-100 hover:to-red-200/50 transition-all shadow-sm hover:shadow"
                        >
                          <Trash2 size={14} className="text-red-600" />
                          <span className="text-xs font-bold text-red-700">Delete</span>
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