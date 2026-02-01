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
import { premiumColors } from "../../theme/premiumColors";

const InfoChip = ({ icon: Icon, value, label, variant = "light" }) => {
  const color = variant === "dark" ? premiumColors.blue : premiumColors.slate;
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${color.bg} border border-white shadow-sm`}>
      <div className={`p-2 rounded-xl border-2 border-white ${color.icon} text-white shadow-md`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-black uppercase tracking-widest leading-none mb-1 text-slate-700">{label}</p>
        <p className="text-sm font-black truncate text-slate-900">{value || "---"}</p>
      </div>
    </div>
  );
};

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
  const [imgKey, setImgKey] = useState(() => Date.now().toString());
  const [imgBroken, setImgBroken] = useState(false);

  const safeStr = (v) => (v === null || v === undefined ? "" : String(v));

  const normalizeUrl = (u) => {
    const s = safeStr(u).trim();
    if (!s || s === "null" || s === "undefined") return "";
    if (/^https?:\/\//i.test(s)) return s;
    const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";
    const cleanBase = rawBase.replace(/\/api\/?$|\/+$/g, "");
    return `${cleanBase}${s.startsWith("/") ? "" : "/"}${s}`;
  };

  const withCacheBust = (url, key) => {
    const u = normalizeUrl(url);
    if (!u) return "";
    const sep = u.includes("?") ? "&" : "?";
    return `${u}${sep}v=${encodeURIComponent(key)}`;
  };

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

  // Final image source with normalization and cache bust
  const displayImage = imagePreview || withCacheBust(user.profile_picture_url, imgKey);

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
    <div className="space-y-10 pb-20">
      {/* Decorative Background Blobs - matching Student Profile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/30 rounded-full blur-[120px] -ml-64 -mb-64" />
      </div>

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
        className="space-y-10 relative z-10"
      >
        {/* ================= CLEAN HEADER CARD ================= */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 border border-white shadow-xl relative overflow-hidden"
        >
          {/* Soft Decorative Accents */}
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-blue-100/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-indigo-50/40 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-14">
            {/* Avatar Area */}
            <div className="relative group/avatar">
              <div className="w-44 h-44 md:w-60 md:h-60 rounded-[3.5rem] bg-white overflow-hidden border-4 border-white shadow-sm ring-1 ring-slate-100">
                <div className="w-full h-full relative group transition-transform duration-500 hover:scale-105">
                  {displayImage && !imgBroken ? (
                    <img
                      src={displayImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImgBroken(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-8xl font-black text-slate-200">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  {isEditing && (
                    <label className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="w-10 h-10 text-white mb-2" />
                      <span className="text-[11px] text-white font-black uppercase tracking-widest">Update Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>
              {!isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-400 rounded-2xl p-3 border-4 border-white text-white shadow-md">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Info Area */}
            <div className="flex-1 text-center md:text-left text-slate-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-none mb-3">{user.name}</h1>
                  <p className="text-slate-700 font-black uppercase tracking-[0.3em] text-[12px]">Faculty Member Registry</p>
                </div>

                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDigitalId(true)}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                  >
                    <IdCard className="w-5 h-5" />
                    AUTHENTICATE ID
                  </motion.button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <InfoChip icon={Building} value={department?.name} label="Department" variant="dark" />
                <InfoChip icon={Briefcase} value={profileData.specialization} label="Specialization" variant="dark" />
                <InfoChip icon={GraduationCap} value={profileData.education} label="Education" variant="dark" />
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-12">
                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm`}>
                  <div className={`p-1.5 rounded-lg ${premiumColors.blue.icon} text-white shadow-sm`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Office: {profileData.office_location || "---"}</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-50/50 text-emerald-500 border border-emerald-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">ACTIVE NODE</span>
                </div>
              </div>

              {/* Actions */}
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="px-12 py-4 rounded-2xl bg-white text-slate-800 border border-slate-200 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                  Modify Professional Profile
                </motion.button>
              ) : (
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="px-12 py-4 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3"
                  >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Commit Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setIsEditing(false); setImagePreview(null); }}
                    disabled={saving}
                    className="px-10 py-4 rounded-2xl bg-white text-slate-600 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-200"
                  >
                    Cancel Edit
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ================= CLEAN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

          {/* Main Content Area */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {/* Constant Info Registry */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 border border-white shadow-xl relative overflow-hidden group">
              <h3 className="text-3xl font-black text-slate-800 mb-12 flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-2.5 h-10 bg-blue-500 rounded-full" />
                Contact Registry
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[12px] font-black text-slate-700 uppercase tracking-[0.3em] ml-2">Universal Email</label>
                  <div className="relative group/input">
                    <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-blue-400 transition-colors`} />
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-slate-100 focus:border-blue-300 outline-none transition-all font-black text-slate-700 disabled:opacity-60 uppercase text-[12px] tracking-widest shadow-sm`}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Secure Mobile</label>
                  <div className="relative group/input">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-emerald-400 transition-colors" />
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-slate-100 focus:border-emerald-300 outline-none transition-all font-black text-slate-700 disabled:opacity-60 uppercase text-[11px] tracking-widest shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Office Node Location</label>
                  <div className="relative group/input">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.office}
                      onChange={e => setFormData({ ...formData, office: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-slate-100 focus:border-blue-300 outline-none transition-all font-black text-slate-700 disabled:opacity-60 uppercase text-[11px] tracking-widest shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Credentials */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 border border-white shadow-xl relative overflow-hidden group">
              <h3 className="text-3xl font-black text-slate-800 mb-12 flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-2.5 h-10 bg-emerald-500 rounded-full" />
                Expertise Nodes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Specialization</label>
                  <div className="relative group/input">
                    <Star className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-blue-300 transition-colors" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-slate-100 focus:border-blue-300 outline-none transition-all font-black text-slate-700 disabled:opacity-60 uppercase text-[11px] tracking-widest shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">High Education</label>
                  <div className="relative group/input">
                    <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-indigo-300 transition-colors" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.education}
                      onChange={e => setFormData({ ...formData, education: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-slate-100 focus:border-indigo-300 outline-none transition-all font-black text-slate-700 disabled:opacity-60 uppercase text-[11px] tracking-widest shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Stats Area */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Tenure Card - Soft Glass */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Academic Tenure</p>
                <div className="text-7xl font-black text-slate-800 mb-10 flex items-baseline gap-3">
                  {profileData.join_date ? new Date().getFullYear() - new Date(profileData.join_date).getFullYear() : 0}
                  <span className="text-xl font-bold text-slate-300 uppercase tracking-widest">Yrs</span>
                </div>

                <div className="h-1 bg-slate-100 rounded-full my-10" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Node</span>
                    <span className="text-[10px] font-black bg-white text-slate-600 px-5 py-2 rounded-xl uppercase border border-slate-50 shadow-sm">{department?.code || "GEN"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Status</span>
                    <span className="text-[10px] font-black bg-blue-50/50 text-blue-400 px-5 py-2 rounded-xl uppercase border border-blue-100 shadow-sm">{user.role}</span>
                  </div>
                </div>
              </div>

              {/* Decorative background icon */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.05] transition-transform group-hover:scale-110 pointer-events-none">
                <Award className="w-60 h-60 text-slate-400" />
              </div>
            </div>

            {/* Node Status - Soft Glass Dark */}
            <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 relative overflow-hidden group shadow-2xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Node Connectivity</h4>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-300 shadow-inner">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Active State</p>
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">Synced & Secure Node</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-300 shadow-inner">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Registry Date</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Digital Faculty ID Modal */}
      {
        showDigitalId && createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60"
              onClick={() => setShowDigitalId(false)}
            >
              <motion.div
                initial={{ scale: 0.9, rotateY: 90 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0.9, rotateY: -90 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[380px] aspect-[1/1.6] bg-white rounded-[3rem] p-8 border border-slate-200 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full items-center text-center">
                  <div className="w-full flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-white text-xs">N</div>
                      <span className="font-bold text-slate-900 tracking-wide">NOVATECH</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase">Faculty Node</span>
                  </div>

                  <div className="w-36 h-36 rounded-2xl border-4 border-slate-50 p-1 bg-slate-100 mb-6 shadow-sm">
                    {displayImage && !imgBroken ? (
                      <img
                        src={displayImage}
                        alt="ID"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-6xl font-black text-white rounded-xl">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1 uppercase tracking-tight">{user.name}</h2>
                  <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">{profileData.specialization || "Faculty Member"}</p>

                  <div className="grid grid-cols-2 gap-4 w-full mb-auto mt-4">
                    <div className="text-left p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Unit</p>
                      <p className="text-[10px] font-black text-slate-700 truncate capitalize">{department?.code || "N/A"}</p>
                    </div>
                    <div className="text-left p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Node ID</p>
                      <p className="text-[10px] font-black text-slate-700">FAC-{user.id?.toString().padStart(4, '0')}</p>
                    </div>
                  </div>

                  <div className="w-full pt-6 border-t border-slate-100 mt-8 text-center">
                    <div className="h-10 w-full bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden mb-3 border border-slate-100">
                      <div className="flex gap-1 opacity-40">
                        {[...Array(24)].map((_, i) => (
                          <div key={i} className={`w-0.5 h-6 ${Math.random() > 0.3 ? 'bg-slate-900' : 'bg-transparent'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Authenticated Faculty Token</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      }
    </div>
  );
};

export default ProfilePage;
