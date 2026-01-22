import React, { useEffect, useMemo, useState } from "react";
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

  // ✅ NEW: view students modal
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

  return (
    <div className="min-h-screen space-y-6">
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
        // ✅ NEW
        onViewStudents={(cg) => {
          setViewGroup(cg);
          setViewOpen(true);
        }}
      />

      {/* ✅ NEW MODAL */}
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
