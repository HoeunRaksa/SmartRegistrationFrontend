import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      } else {
        setImagePreview(null);
      }
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingStaff]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      const deptData = res.data?.data || res.data || [];
      setDepartments(Array.isArray(deptData) ? deptData : []);
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "department_id") {
        const dept = departments.find((d) => d.id === parseInt(value, 10));
        if (dept) next.department_name = dept.name;
        else next.department_name = "";
      }

      return next;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2048000) {
      alert("Image size must be less than 2MB");
      e.target.value = null;
      return;
    }

    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);

    setFormData((prev) => ({ ...prev, profile_image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setFormData((prev) => ({ ...prev, profile_image: null }));
    setImagePreview(null);
  };

  const resetForm = () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
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

  const isEditMode = Boolean(editingStaff);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur-2xl shadow-[0_22px_70px_-30px_rgba(15,23,42,0.45)] p-6 md:p-7">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.14]" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {isEditMode ? "Edit Staff Member" : "Add New Staff Member"}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditMode ? "Update staff information" : "Fill in the details below"}
            </p>
          </div>
        </div>

        {isEditMode && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onCancelEdit}
            className="p-2.5 rounded-2xl border border-red-200/60 bg-red-50/70 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
            aria-label="Cancel edit"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-6">
        {/* Profile Image */}
        <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-sm p-5 md:p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {imagePreview ? (
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur opacity-70" />
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 6 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 shadow-lg"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/40 to-purple-500/40 blur opacity-80" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-4 border-white shadow-xl">
                    <ImageIcon className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">Profile Photo</p>
                  <p className="text-xs text-gray-600 mt-0.5">JPG/PNG • Max 2MB</p>
                </div>

                <label className="cursor-pointer">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </motion.div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-4 rounded-2xl bg-blue-50/60 border border-blue-100 p-4">
                <p className="text-xs text-gray-700">
                  Tip: Use a clear headshot with good lighting for best results across the system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <Section title="Account Information" icon={Lock} iconClass="text-blue-600" iconBg="bg-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email" required>
              <IconInput
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="staff@example.com"
              />
            </Field>

            <Field label={`Password ${!isEditMode ? "" : ""}`} required={!isEditMode}>
              <IconInput
                icon={Lock}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                placeholder={isEditMode ? "Leave blank to keep current" : "••••••••"}
              />
            </Field>

            <Field label="Role" required>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm hover:border-gray-300"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </Field>

            <Field label="Username" required>
              <IconInput
                icon={Users}
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                placeholder="john_doe"
              />
            </Field>
          </div>
        </Section>

        {/* Personal Information */}
        <Section title="Personal Information" icon={Users} iconClass="text-purple-600" iconBg="bg-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name (English)" required>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm hover:border-gray-300"
                placeholder="John Doe"
              />
            </Field>

            <Field label="Full Name (Khmer)">
              <input
                type="text"
                name="full_name_kh"
                value={formData.full_name_kh}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm hover:border-gray-300"
                placeholder="ជន ដូ"
              />
            </Field>

            <Field label="Gender">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm hover:border-gray-300"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>

            <Field label="Date of Birth">
              <IconInput
                icon={Calendar}
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </Field>

            <Field label="Phone Number">
              <IconInput
                icon={Phone}
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+855 12 345 678"
              />
            </Field>

            <Field label="Address">
              <IconInput
                icon={MapPin}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Street, City"
              />
            </Field>
          </div>
        </Section>

        {/* Work Information */}
        <Section title="Work Information" icon={Briefcase} iconClass="text-emerald-700" iconBg="bg-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Department" required>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm hover:border-gray-300"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="Position" required>
              <IconInput
                icon={Briefcase}
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Teacher, Administrator, etc."
              />
            </Field>
          </div>
        </Section>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold shadow-[0_18px_45px_-25px_rgba(59,130,246,0.9)] hover:shadow-[0_22px_55px_-28px_rgba(59,130,246,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : isEditMode ? "Update Staff" : "Add Staff"}
          </motion.button>

          {isEditMode && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
              disabled={loading}
              className="sm:w-auto w-full px-6 py-3 rounded-2xl border border-gray-200 bg-white/70 hover:bg-white text-gray-800 font-bold shadow-sm transition-colors disabled:opacity-60"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

const Section = ({ title, icon: Icon, iconClass, iconBg, children }) => (
  <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-sm p-5 md:p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-2xl ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconClass}`} />
      </div>
      <div>
        <h4 className="text-sm font-extrabold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-600 mt-0.5">Keep details accurate and consistent.</p>
      </div>
    </div>
    {children}
  </div>
);

const Field = ({ label, required = false, children }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
    </div>
    {children}
  </div>
);

const IconInput = ({ icon: Icon, className = "", ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      {...props}
      className={`w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm hover:border-gray-300 ${className}`}
    />
  </div>
);

export default StaffForm;
