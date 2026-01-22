import React, { useEffect, useMemo, useState } from "react";
import { X, Search, UserPlus, Loader } from "lucide-react";
import { fetchStudents } from "../../api/student_api.jsx";
import {
  fetchClassGroupStudents,
  assignStudentClassGroupManual,
} from "../../api/student_class_group_api.jsx";

const safeArr = (res) => {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data;
  return Array.isArray(d) ? d : [];
};

const ClassGroupStudentsModal = ({ open, group, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [studentsInClass, setStudentsInClass] = useState([]);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const [error, setError] = useState("");

  const periodParams = useMemo(
    () => ({
      academic_year: group?.academic_year,
      semester: group?.semester,
    }),
    [group?.academic_year, group?.semester]
  );

  const loadClassStudents = async () => {
    setError("");
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
    try {
      setSearching(true);

      // You can filter by major_id if you want (recommended)
      const res = await fetchStudents({
        search,
        major_id: group?.major_id,
      });

      const list = safeArr(res);

      // remove students already in class list
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
    try {
      const payload = {
        class_group_id: group.id,
        academic_year: group.academic_year,
        semester: Number(group.semester),
      };

      await assignStudentClassGroupManual(student.id, payload);

      // refresh list
      await loadClassStudents();

      // remove from candidates list
      setCandidates((prev) => prev.filter((x) => String(x.id) !== String(student.id)));
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/60 bg-white/60">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Students in: {group.class_name}
            </h3>
            <p className="text-xs text-gray-600">
              {group.academic_year} • Semester {group.semester} • {group.shift || "No shift"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/70 border border-white/60 hover:bg-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          {/* left: current students */}
          <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-900">
                Current Students ({loading ? "…" : studentsInClass.length})
              </p>
              <button
                onClick={loadClassStudents}
                disabled={loading}
                className="text-xs px-3 py-2 rounded-xl bg-white/70 border border-white/60 hover:bg-white transition disabled:opacity-60"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Loader className="animate-spin" size={16} /> Loading...
              </div>
            ) : studentsInClass.length === 0 ? (
              <div className="text-sm text-gray-600">
                No students yet. Use search on the right to add students.
              </div>
            ) : (
              <div className="max-h-[420px] overflow-auto space-y-2">
                {studentsInClass.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl bg-white/70 border border-white/60 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {s.full_name_en || s.full_name_kh || s.name || `Student #${s.id}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        Code: {s.student_code || "-"} • Email: {s.email || s.personal_email || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* right: search + add */}
          <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
            <p className="text-sm font-bold text-gray-900 mb-3">Add Students</p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search size={16} className="text-gray-500" />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl px-10 py-2.5 text-sm text-gray-800 shadow-sm outline-none"
                  placeholder="Search by name, code, email..."
                />
              </div>

              <button
                onClick={doSearch}
                disabled={searching}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold disabled:opacity-60"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            <div className="mt-4">
              {candidates.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Search students to add into this class.
                </div>
              ) : (
                <div className="max-h-[420px] overflow-auto space-y-2">
                  {candidates.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-xl bg-white/70 border border-white/60 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {s.full_name_en || s.full_name_kh || s.name || `Student #${s.id}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          Code: {s.student_code || "-"} • Email: {s.email || s.personal_email || "-"}
                        </p>
                      </div>

                      <button
                        onClick={() => addStudent(s)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition"
                      >
                        <UserPlus size={16} className="text-blue-700" />
                        <span className="text-xs font-semibold text-blue-700">Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-3 text-[11px] text-gray-600">
              Adding student will create row in <b>student_class_groups</b> if they don’t have one yet.
              If they already have one for same academic_year+semester, it will update (move).
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/60 bg-white/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/70 border border-white/60 hover:bg-white transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassGroupStudentsModal;
