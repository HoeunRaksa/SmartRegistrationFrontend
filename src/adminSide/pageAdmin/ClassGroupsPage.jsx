import React, { useEffect, useMemo, useState } from "react";
import { GraduationCap, Users, TrendingUp } from "lucide-react";
import ClassGroupForm from "../ConponentsAdmin/ClassGroupForm.jsx";
import ClassGroupsList from "../ConponentsAdmin/ClassGroupsList.jsx";
import {
  fetchAllClassGroups,
  createClassGroup,
  updateClassGroup,
  deleteClassGroup,
} from "../../api/class_group_api.jsx";

import ClassGroupStudentsModal from "../ConponentsAdmin/ClassGroupStudentsModal.jsx";

const ClassGroupsPage = () => {
  const [classGroups, setClassGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const [viewGroup, setViewGroup] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await fetchAllClassGroups();
      const data = res?.data?.data ?? res?.data ?? [];
      setClassGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load class groups:", err);
      setClassGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreate = async (payload) => {
    await createClassGroup(payload);
    await loadGroups();
  };

  const handleUpdate = async (id, payload) => {
    await updateClassGroup(id, payload);
    await loadGroups();
  };

  const handleDelete = async (id) => {
    await deleteClassGroup(id);
    await loadGroups();
  };

  // Stats calculations
  const stats = useMemo(() => {
    const total = classGroups.length;
    const totalCapacity = classGroups.reduce((sum, cg) => sum + (Number(cg.capacity) || 0), 0);
    const uniqueMajors = new Set(classGroups.map(cg => cg.major_id)).size;

    return { total, totalCapacity, uniqueMajors };
  }, [classGroups]);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 backdrop-blur-2xl shadow-[0_22px_70px_-30px_rgba(15,23,42,0.35)] p-8 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full blur-3xl -ml-24 -mb-24" />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Class Groups Management
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Organize students into classes by department, major, and academic period
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Total Classes
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Total Capacity
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">
                    {stats.totalCapacity}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Active Majors
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">
                    {stats.uniqueMajors}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <ClassGroupForm
          editingGroup={editingGroup}
          onCancel={() => setEditingGroup(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />

        <ClassGroupsList
          loading={loading}
          classGroups={classGroups}
          onEdit={(g) => {
            setEditingGroup(g);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onDelete={handleDelete}
          onRefresh={loadGroups}
          onViewStudents={(cg) => {
            setViewGroup(cg);
            setViewOpen(true);
          }}
        />
      </div>

      {/* Modal */}
      {viewOpen && viewGroup && (
        <ClassGroupStudentsModal
          open={viewOpen}
          group={viewGroup}
          onClose={() => {
            setViewOpen(false);
            setViewGroup(null);
          }}
        />
      )}
    </div>
  );
};

export default ClassGroupsPage;