import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  User, Mail, Phone, MapPin, Calendar, Award, BookOpen,
  Save, Upload, X, Building, CheckCircle, GraduationCap,
  Briefcase, Medal, IdCard, Star, Clock
} from "lucide-react";
import Alert from "../../gobalConponent/Alert.jsx";
import { fetchTeacherProfile, updateTeacherProfile } from "../../api/teacher_profile_api";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
  const [showDigitalId, setShowDigitalId] = useState(false);

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
  // Cache busting for image updates
  const [imgKey, setImgKey] = useState(Date.now());

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
      setImgKey(Date.now()); // force image refresh
      await loadProfile();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 text-center animate-pulse text-gray-500 font-medium">Loading faculty profile...</div>
      </div>
    );
  }

  if (!profileData) return <div className="p-8 text-center">Profile not found.</div>;

  const { user, department } = profileData;
  const displayImage = imagePreview || (user.profile_picture_url ? `${user.profile_picture_url}${user.profile_picture_url.includes('?') ? '&' : '?'}t=${imgKey}` : null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* ================= HEADER CARD ================= */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] bg-[#0F172A] p-8 md:p-10 shadow-2xl border border-white/10 group"
        >
          {/* Abstract Background Art */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none -ml-20 -mb-20" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative group/avatar">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-75 blur-md group-hover/avatar:opacity-100 transition duration-500" />
              <div className="relative w-40 h-40 rounded-[1.8rem] bg-[#1E293B] p-1.5 shadow-xl overflow-hidden">
                <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-slate-800 relative flex items-center justify-center">
                  {displayImage ? (
                    <img src={displayImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                  ) : (
                    <div className="text-5xl font-bold text-slate-500 select-none">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  {isEditing && (
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                      <Upload className="w-8 h-8 text-white mb-2" />
                      <span className="text-xs text-white font-bold uppercase tracking-wider">Change</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>
              {!isEditing && (
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl p-2 shadow-lg border-2 border-[#0F172A] text-white">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{user.name}</h1>
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDigitalId(true)}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all self-center md:self-auto"
                  >
                    <IdCard className="w-4 h-4 text-blue-300" />
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Faculty ID</span>
                  </motion.button>
                )}
              </div>

              <p className="text-lg text-blue-200 font-medium mb-6 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                {profileData.specialization || "Senior Lecturer"}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mx-2" />
                <span className="text-slate-400 font-normal">{user.email}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
                <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-slate-200">{department?.name || "General Department"}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-semibold text-slate-200">{profileData.education || "PhD Candidate"}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-200">{profileData.office_location || "R-101"}</span>
                </div>
              </div>

              {/* Actions */}
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-blue-50 transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                  Edit Profile Information
                </motion.button>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setIsEditing(false); setImagePreview(null); }}
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all border border-slate-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ================= EDITING FORM / DETAILS GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Details */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {/* Personal Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Office Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.office}
                      onChange={e => setFormData({ ...formData, office: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                  <Award className="w-5 h-5" />
                </div>
                Professional Background
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Specialization / Expertise</label>
                  <div className="relative group">
                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Highest Education</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.education}
                      onChange={e => setFormData({ ...formData, education: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Stats */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="opacity-80 font-medium mb-1">Tenure</h4>
                <div className="text-3xl font-black mb-6 flex items-baseline gap-1">
                  {profileData.join_date ? new Date().getFullYear() - new Date(profileData.join_date).getFullYear() : 0}
                  <span className="text-sm font-semibold opacity-70">Years</span>
                </div>

                <div className="h-px bg-white/20 my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-80">Department</span>
                    <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded-lg">{department?.code || "GEN"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-80">Role</span>
                    <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded-lg capitalize">{user.role}</span>
                  </div>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Award className="w-32 h-32" />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <h4 className="font-bold text-gray-900 mb-4">Account Status</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Active</p>
                    <p className="text-xs">Account is in good standing</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Joined</p>
                    <p className="text-xs">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Digital Faculty ID Modal */}
      {showDigitalId && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowDigitalId(false)}
          >
            <motion.div
              initial={{ scale: 0.9, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.9, rotateY: -90 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] aspect-[1/1.6] bg-[#0F172A] rounded-[2rem] p-8 shadow-2xl border border-white/20 relative overflow-hidden"
            >
              {/* ID Card Design */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full -ml-16 -mb-16 pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full items-center text-center">
                <div className="w-full flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-black text-white text-xs">N</div>
                    <span className="font-bold text-white tracking-wide">NOVATECH</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-bold text-white/70 uppercase">Faculty</span>
                </div>

                <div className="w-36 h-36 rounded-2xl border-4 border-white/10 p-1 bg-white/5 mb-6 shadow-2xl">
                  <img
                    src={displayImage || "https://ui-avatars.com/api/?name=" + user.name}
                    alt="ID"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <h2 className="text-2xl font-black text-white leading-tight mb-1">{user.name}</h2>
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-8">{user.role}</p>

                <div className="grid grid-cols-2 gap-4 w-full mb-auto">
                  <div className="text-left p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Department</p>
                    <p className="text-xs font-bold text-white">{department?.code || "N/A"}</p>
                  </div>
                  <div className="text-left p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">ID Number</p>
                    <p className="text-xs font-bold text-white">FAC-{user.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>

                <div className="w-full pt-6 border-t border-white/10">
                  <div className="h-12 w-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="flex gap-1 opacity-80">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className={`w-1 h-8 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};

export default ProfilePage;
