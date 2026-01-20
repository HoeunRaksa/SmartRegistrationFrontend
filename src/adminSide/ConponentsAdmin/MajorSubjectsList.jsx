import React, { useMemo } from "react";
import { Trash2, RefreshCw } from "lucide-react";

const MajorSubjectsList = ({ rows, onDelete, onRefresh }) => {
  const count = useMemo(() => (Array.isArray(rows) ? rows.length : 0), [rows]);

  return (
    <div className="rounded-2xl bg-white/40 backdrop-blur-sm border border-white/40 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Major Subjects</h3>
          <p className="text-xs text-gray-600">{count} records</p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/40 hover:bg-white transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="overflow-auto rounded-xl border border-white/40 bg-white/60">
        <table className="min-w-full text-sm">
          <thead className="bg-white/70">
            <tr className="text-left text-gray-700">
              <th className="p-3">Major</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Year</th>
              <th className="p-3">Semester</th>
              <th className="p-3">Required</th>
              <th className="p-3 w-[90px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {(!rows || rows.length === 0) && (
              <tr>
                <td className="p-4 text-gray-600" colSpan={6}>
                  No major-subject records yet.
                </td>
              </tr>
            )}

            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-white/40">
                <td className="p-3 font-medium text-gray-900">
                  {r.major?.major_name ?? `Major #${r.major_id}`}
                </td>
                <td className="p-3 text-gray-800">
                  {r.subject?.subject_name ?? `Subject #${r.subject_id}`}
                </td>
                <td className="p-3 text-gray-700">{r.year_level ?? "-"}</td>
                <td className="p-3 text-gray-700">{r.semester ?? "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      r.is_required ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {r.is_required ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => onDelete?.(r.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MajorSubjectsList;
