import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createStaff, updateStaff } from "../../api/staff_api";
import { fetchDepartments } from "../../api/department_api";
import {
  Users,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Upload,
  X,
  Save,
  UserPlus,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

const StaffForm = ({ onUpdate, editingStaff, onCancelEdit }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "staff",
    user_name: "",
    department_id: "",
    department_name: "",
    full_name: "",
    full_name_kh: "",
    position: "",
    phone_number: "",
    address: "",
    gender: "",
    date_of_birth: "",
    profile_image: null,
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (editingStaff) {
      setFormData({
        email: editingStaff.email || "",
        password: "",
        role: editingStaff.user?.role || "staff",
        user_name: editingStaff.user_name || "",
        department_id: editingStaff.department_id || "",
        department_name: editingStaff.department_name || "",
        full_name: editingStaff.full_name || "",
        full_name_kh: editingStaff.full_name_kh || "",
        position: editingStaff.position || "",
        phone_number: editingStaff.phone_number || "",
        address: editingStaff.address || "",
        gender: editingStaff.gender || "",
        date_of_birth: editingStaff.date_of_birth || "",
        profile_image: null,
      });
      
      if (editingStaff.user?.profile_picture_url) {
        setImagePreview(editingStaff.user.profile_picture_url);
      }
    } else {
      resetForm();
    }
  }, [editingStaff]);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      const deptData = res.data?.data || res.data || [];
      setDepartments(Array.isArray(deptData) ? deptData : []);
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "department_id") {
      const dept = departments.find((d) => d.id === parseInt(value));
      if (dept) {
        setFormData((prev) => ({ ...prev, department_name: dept.name }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2048000) {
        alert("Image size must be less than 2MB");
        return;
      }
      setFormData((prev) => ({ ...prev, profile_image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, profile_image: null }));
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "staff",
      user_name: "",
      department_id: "",
      department_name: "",
      full_name: "",
      full_name_kh: "",
      position: "",
      phone_number: "",
      address: "",
      gender: "",
      date_of_birth: "",
      profile_image: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
      } else {
        await createStaff(formData);
      }
      
      resetForm();
      if (onCancelEdit) onCancelEdit();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to save staff:", error);
      alert(error.response?.data?.message || "Failed to save staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 border border-white shadow-lg backdrop-blur-xl rounded-3xl p-6 ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
            </h3>
            <p className="text-sm text-gray-600">
              {editingStaff ? "Update staff information" : "Fill in the details below"}
            </p>
          </div>
        </div>
        {editingStaff && (
          <button
            onClick={onCancelEdit}
            className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center gap-4 p-6 bg-white/50 rounded-2xl border border-white/40">
          <div className="relative">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-xl">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-md">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Photo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500">JPG, PNG (Max 2MB)</p>
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            Account Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="staff@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password {!editingStaff && "*"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingStaff}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={editingStaff ? "Leave blank to keep current" : "••••••••"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="john_doe"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (English) *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (Khmer)
              </label>
              <input
                type="text"
                name="full_name_kh"
                value={formData.full_name_kh}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="ជន ដូ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="+855 12 345 678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="123 Street, City"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-green-600" />
            Work Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Teacher, Administrator, etc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : editingStaff ? "Update Staff" : "Add Staff"}
          </button>
          {editingStaff && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StaffForm;