import React, { useEffect, useMemo, useState } from "react";
import CourseForm from "../ConponentsAdmin/CourseForm.jsx";
import CoursesList from "../ConponentsAdmin/CoursesList.jsx";
import { fetchAllCourses, createCourse, updateCourse, deleteCourse } from "../../api/course_api.jsx";
import { BookOpen, PlusCircle } from "lucide-react";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await fetchAllCourses();
      const data = res.data?.data ?? res.data ?? [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = async (payload) => {
    await createCourse(payload);
    await loadCourses();
  };

  const handleUpdate = async (id, payload) => {
    await updateCourse(id, payload);
    await loadCourses();
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    await loadCourses();
  };

  const stats = useMemo(() => {
    return [
      { label: "Total Courses", value: courses.length, icon: BookOpen },
      { label: "This Page", value: "Courses", icon: PlusCircle },
    ];
  }, [courses.length]);

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
      <CourseForm
        editingCourse={editingCourse}
        onCancel={() => setEditingCourse(null)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {/* List */}
      <CoursesList
        loading={loading}
        courses={courses}
        onEdit={(c) => {
          setEditingCourse(c);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={handleDelete}
        onRefresh={loadCourses}
      />
    </div>
  );
};

export default CoursesPage;
