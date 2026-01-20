import React, { useEffect, useState } from "react";
import MajorSubjectsForm from "../ConponentsAdmin/MajorSubjectsForm.jsx";
import MajorSubjectsList from "../ConponentsAdmin/MajorSubjectsList.jsx";
import { fetchMajorSubjects, deleteMajorSubject } from "../../api/major_subject_api.jsx";
import { Link2, BarChart3 } from "lucide-react";

const MajorSubjectsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchMajorSubjects();
      setRows(res.data || []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this major-subject?")) return;
    try {
      await deleteMajorSubject(id);
      load();
    } catch (e) {
      console.error(e);
      alert("Delete failed. Check console.");
    }
  };

  const quickStats = [
    {
      label: "MajorSubjects",
      value: loading ? "…" : rows.length,
      color: "from-cyan-500 to-blue-500",
      icon: Link2,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="hidden sm:block bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">
                Tip: Courses should use <b>major_subject_id</b> from these records.
              </p>
            </div>
          </div>
        </div>
      </div>

      <MajorSubjectsForm onSuccess={load} />
      <MajorSubjectsList rows={rows} onDelete={handleDelete} onRefresh={load} />
    </div>
  );
};

export default MajorSubjectsPage;
