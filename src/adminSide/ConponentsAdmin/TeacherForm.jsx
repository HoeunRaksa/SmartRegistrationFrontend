import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createTeacher, updateTeacher } from "../../api/teacher_api";
import { fetchDepartments } from "../../api/department_api";
import {
  Users,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Upload,
  X,
  Save,
  UserPlus,
  Building2,
  Image as ImageIcon,
  User,
} from "lucide-react";

const TeacherForm = ({ onUpdate, editingTeacher, onCancelEdit }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    // user fields
    name: "",
    email: "",
    password: "",
    role: "teacher",

    // teacher fields
    department_id: "",
    full_name: "",
    full_name_kh: "",
    gender: "",
    date_of_birth: "",
    address: "",
    phone_number: "",

    // upload
    upload_to: "teachers", // "teachers" or "profiles"
    image: null,
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (editingTeacher) {
      setFormData({
        // user
        name: editingTeacher.user?.name || "",
        email: editingTeacher.user?.email || "",
        password: "",
        role: editingTeacher.user?.role || "teacher",

        // teacher
        department_id: editingTeacher.department_id || "",
        full_name: editingTeacher.full_name || "",
        full_name_kh: editingTeacher.full_name_kh || "",
        gender: editingTeacher.gender || "",
        date_of_birth: editingTeacher.date_of_birth || "",
        address: editingTeacher.address || "",
        phone_number: editingTeacher.phone_number || "",

        // upload
        upload_to: "teachers",
        image: null,
      });

      if (editingTeacher.user?.profile_picture_url) {
        setImagePreview(editingTeacher.user.profile_picture_url);
      } else if (editingTeacher.user?.profile_picture_path) {
        // fallback if backend returns path only
        setImagePreview(`${import.meta.env.VITE_API_URL}/${editingTeacher.user.profile_picture_path}`);
      } else {
        setImagePreview(null);
      }
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTeacher]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const resetForm = () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "teacher",

      department_id: "",
      full_name: "",
      full_name_kh: "",
      gender: "",
      date_of_birth: "",
      address: "",
      phone_number: "",

      upload_to: "teachers",
      image: null,
    });

    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // IMPORTANT: password required only when create
      if (!editingTeacher && !formData.password) {
        alert("Password is required for new teacher");
        setLoading(false);
        return;
      }

      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, formData);
      } else {
        await createTeacher(formData);
      }

      resetForm();
      if (onCancelEdit) onCancelEdit();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to save teacher:", error);
      alert(error.response?.data?.message || "Failed to save teacher");
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = Boolean(editingTeacher);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-white shadow-lg p-5">
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
              {isEditMode ? "Edit Teacher" : "Add New Teacher"}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditMode ? "Update teacher information" : "Fill in the details below"}
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
        <div className="rounded-3xl border border-white/60 bg-white backdrop-blur-xl shadow-sm p-5 md:p-6">
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
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-4">
                  <p className="text-xs text-gray-700">
                    Tip: Use a clear headshot with good lighting for best results.
                  </p>
                </div>

                <div className="rounded-2xl bg-white border border-gray-200 p-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Upload Folder
                  </label>
                  <select
                    name="upload_to"
                    value={formData.upload_to}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm hover:border-gray-300"
                  >
                    <option value="teachers">uploads/teachers</option>
                    <option value="profiles">uploads/profiles</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <Section title="Account Information" icon={Lock} iconClass="text-blue-600" iconBg="bg-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" required>
              <IconInput
                icon={User}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Teacher account name"
              />
            </Field>

            <Field label="Email" required>
              <IconInput
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="teacher@example.com"
              />
            </Field>

            <Field label="Password" required={!isEditMode}>
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
                disabled
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 outline-none transition-all shadow-sm"
              >
                <option value="teacher">Teacher</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Role is locked to <b>teacher</b>.
              </p>
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

        {/* Department */}
        <Section title="Work Information" icon={Building2} iconClass="text-emerald-700" iconBg="bg-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Department" required>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
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
          </div>
        </Section>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold shadow-[0_18px_45px_-25px_rgba(59,130,246,0.9)] hover:shadow-[0_22px_55px_-28px_rgba(59,130,246,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : isEditMode ? "Update Teacher" : "Add Teacher"}
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

export default TeacherForm;
