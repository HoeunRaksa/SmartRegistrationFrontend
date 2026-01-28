import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { createMajor, updateMajor } from "../../api/major_api.jsx";
import { fetchDepartments } from "../../api/department_api.jsx";
import { fetchSubjects } from "../../api/subject_api.jsx";

import {
  GraduationCap,
  Building2,
  FileText,
  DollarSign,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

/* ================== ANIMATION VARIANTS ================== */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
};

/* ================== COMPONENT ================== */

const MajorsForm = ({ editingMajor, onSuccess, onCancel }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    major_name: "",
    description: "",
    department_id: "",
    registration_fee: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------- Load dropdowns once ----------
  useEffect(() => {
    loadDepartments();
    loadSubjects();
  }, []);

  // --------- Prefill when editing ----------
  useEffect(() => {
    if (editingMajor) {
      setFormData({
        major_name: editingMajor.major_name || "",
        description: editingMajor.description || "",
        department_id: editingMajor.department_id || "",
        registration_fee: editingMajor.registration_fee || "",
        image: null, // keep null unless user uploads new
      });

      // ✅ Correct + safe subject ids mapping
      const subjectIds =
        (Array.isArray(editingMajor.subject_ids) && editingMajor.subject_ids) ||
        (Array.isArray(editingMajor.majorSubjects) &&
          editingMajor.majorSubjects.map((ms) => ms.subject_id)) ||
        (Array.isArray(editingMajor.major_subjects) &&
          editingMajor.major_subjects.map((ms) => ms.subject_id)) ||
        (Array.isArray(editingMajor.subjects) &&
          editingMajor.subjects.map((s) => s.id)) ||
        [];

      // Ensure all are numbers
      setSelectedSubjects(subjectIds.map((x) => Number(x)).filter((x) => !Number.isNaN(x)));

      // Set image preview if editing and image exists
      if (editingMajor.image) {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        setImagePreview(`${API_BASE_URL}/${editingMajor.image}`);
      } else {
        setImagePreview(null);
      }
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingMajor]);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
      setDepartments([]);
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await fetchSubjects();
      setSubjects(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setSubjects([]);
    }
  };

  const toggleSubject = (id) => {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    setSelectedSubjects((prev) =>
      prev.includes(numericId) ? prev.filter((x) => x !== numericId) : [...prev, numericId]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }

    if (file.size > 2048 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  // ✅ One helper: always append subject_ids correctly (supports Laravel)
  const appendSubjectIdsToFormData = (fd, ids) => {
    // works with: $request->input('subject_ids') OR $request->input('subject_ids.*')
    ids.forEach((id) => fd.append("subject_ids[]", String(id)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Basic validation
      if (!formData.major_name?.trim()) {
        setError("Major Name is required");
        setLoading(false);
        return;
      }
      if (!formData.department_id) {
        setError("Department is required");
        setLoading(false);
        return;
      }

      // ✅ CURRENT STATE CORRECT FLOW:
      // Because you have image upload, best consistent way is:
      // Always send FormData for both create + update (no mismatch).
      const submitData = new FormData();
      submitData.append("major_name", String(formData.major_name || "").trim());
      submitData.append("description", String(formData.description || ""));
      submitData.append("department_id", String(formData.department_id));
      submitData.append("registration_fee", String(formData.registration_fee || "100.00"));

      // send subjects
      appendSubjectIdsToFormData(submitData, selectedSubjects);

      // send image only if chosen
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (editingMajor?.id) {
        // many Laravel setups use POST + _method=PUT for FormData updates
        submitData.append("_method", "PUT");
        await updateMajor(editingMajor.id, submitData);
      } else {
        await createMajor(submitData);
      }

      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to save major:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to save major");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      major_name: "",
      description: "",
      department_id: "",
      registration_fee: "",
      image: null,
    });
    setSelectedSubjects([]);
    setImagePreview(null);
    setError("");
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleCancelEdit = () => {
    resetForm();
    if (onCancel) onCancel();
  };

  const selectedCount = useMemo(() => selectedSubjects.length, [selectedSubjects]);

  return (
    <motion.div
      className="rounded-2xl bg-white/40 backdrop-blur-sm border border-white/40 shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingMajor ? "Edit Major" : "Add New Major"}
            </h2>
            <p className="text-xs text-gray-600">
              {editingMajor ? "Update major information" : "Create a new academic major"}
            </p>
          </div>
        </div>

        {editingMajor && (
          <button
            onClick={handleCancelEdit}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Major Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              Major Name *
            </label>
            <input
              type="text"
              name="major_name"
              value={formData.major_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Computer Science"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Department *
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.department_name || dept.name || `Department #${dept.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Registration Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Registration Fee
          </label>
          <input
            type="number"
            name="registration_fee"
            value={formData.registration_fee}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="100.00"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Enter major description..."
          />
        </div>

        {/* ✅ Subjects Multi Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects (Select multiple) <span className="text-xs text-gray-500">({selectedCount} selected)</span>
          </label>

          <div className="p-3 rounded-lg border border-gray-300 bg-white/50 max-h-56 overflow-auto">
            {subjects.length === 0 ? (
              <p className="text-xs text-gray-500">No subjects found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {subjects.map((s) => {
                  const checked = selectedSubjects.includes(Number(s.id));
                  return (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${checked
                          ? "bg-blue-50 border-blue-300"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSubject(s.id)}
                      />
                      <span className="text-sm text-gray-800">
                        {s.subject_name || s.name || `Subject #${s.id}`}
                      </span>
                      {typeof s.credit !== "undefined" && (
                        <span className="ml-auto text-xs text-gray-500">{s.credit} cr</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ImageIcon className="w-4 h-4 inline mr-1" />
            Major Image
          </label>

          <div className="space-y-3">
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                <Upload className="w-4 h-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-xs text-gray-500">Max 2MB (JPEG, PNG, GIF, WEBP)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : editingMajor ? "Update Major" : "Create Major"}
          </button>

          {editingMajor && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default MajorsForm;
