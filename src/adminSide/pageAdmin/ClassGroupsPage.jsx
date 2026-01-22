import React, { useEffect, useMemo, useState, useCallback } from "react";
import ClassGroupForm from "../ConponentsAdmin/ClassGroupForm.jsx";
import ClassGroupsList from "../ConponentsAdmin/ClassGroupsList.jsx";
import {
  fetchAllClassGroups,
  createClassGroup,
  updateClassGroup,
  deleteClassGroup,
} from "../../api/class_group_api.jsx";
import { Users, PlusCircle } from "lucide-react";

const ClassGroupsPage = () => {
  const [classGroups, setClassGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllClassGroups();

      // your api returns: { data: { data: [] } }
      const data = res?.data?.data ?? res?.data ?? [];
      setClassGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load class groups:", err);
      setClassGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

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
    // if deleting the item being edited, clear edit state
    if (editingGroup?.id === id) setEditingGroup(null);
    await loadGroups();
  };

  const stats = useMemo(() => {
    return [
      { label: "Total Class Groups", value: classGroups.length, icon: Users },
      { label: "This Page", value: "Class Groups", icon: PlusCircle },
    ];
  }, [classGroups.length]);

  return (
    <div className="min-h-screen space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "…" : s.value}</p>
                  <p className="text-xs text-gray-600">{s.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <ClassGroupForm
        editingGroup={editingGroup}
        onCancel={() => setEditingGroup(null)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {/* List */}
      <ClassGroupsList
        loading={loading}
        classGroups={classGroups}
        onEdit={(g) => {
          setEditingGroup(g);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={handleDelete}
        onRefresh={loadGroups}
      />
    </div>
  );
};

export default ClassGroupsPage;