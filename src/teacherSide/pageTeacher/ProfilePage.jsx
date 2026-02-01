import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Save, Upload, X } from "lucide-react";
import Alert from "../../gobalConponent/Alert.jsx";
import { fetchTeacherProfile, updateTeacherProfile } from "../../api/teacher_profile_api";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    office: "",
    specialization: "",
    education: "",
    image: null
  });

  // Image preview
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchTeacherProfile();
      setProfileData(data);
      setFormData({
        email: data.user.email,
        phone: data.phone_number || "",
        office: data.office_location || "",
        specialization: data.specialization || "",
        education: data.education || "",
        image: null
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("phone_number", formData.phone);
      data.append("office_location", formData.office);
      data.append("specialization", formData.specialization);
      data.append("education", formData.education);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await updateTeacherProfile(data);
      setAlert({ show: true, message: "Profile updated successfully!", type: "success" });
      await loadProfile(); // Reload to get processed URLs etc.
      setIsEditing(false);
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to update profile: " + (error.response?.data?.message || error.message),
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!profileData) return <div className="p-8 text-center">Profile not found.</div>;

  const { user, department } = profileData;
  const displayImage = imagePreview || user.profile_picture_url || null;

  return (
    <div className="space-y-6">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and academic details</p>
      </motion.div>

      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                {displayImage ? (
                  <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl font-bold text-gray-400">
                    {user.name.charAt(0)}
                  </div>
                )}

                {/* Upload Overlay */}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="w-8 h-8 text-white mb-1" />
                    <span className="text-xs text-white font-medium">Change Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="absolute bottom-1 right-2 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg pointer-events-none">
                <Upload className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
            <p className="text-lg text-blue-600 font-medium mb-4">{profileData.specialization || "No Specialization Added"}</p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
              <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {department?.name || "No Department"}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold border border-purple-100 flex items-center gap-2">
                <Award className="w-4 h-4" />
                {profileData.education || "No Education Set"}
              </span>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3 justify-center md:justify-start">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                  {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setImagePreview(null); }}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50/50"
                  placeholder="+855 ..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Office Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50/50"
                  placeholder="Building A, Room 101"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Joined Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  disabled
                  value={profileData.join_date || "Not set"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-semibold text-gray-500">Academic Specialization</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50/50"
              placeholder="e.g., Artificial Intelligence, Data Science"
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-semibold text-gray-500">Highest Education</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50/50"
              placeholder="e.g., Ph.D. in Computer Science"
            />
          </div>
        </motion.div>

        {/* Quick Stats - using static data or backend calculated later */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <BookOpen className="w-8 h-8 mb-4 opacity-80" />
            <h4 className="text-lg font-semibold opacity-90">Department</h4>
            <p className="text-2xl font-bold">{department?.name || "Unassigned"}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <h4 className="font-semibold text-gray-800 mb-4">Account Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Role</span>
                <span className="font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
