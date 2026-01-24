import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Save } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. Teacher Name',
    email: user?.email || 'teacher@novatech.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    office: 'Building A, Room 301',
    joinDate: 'September 2020',
    specialization: 'Web Development & Software Engineering',
    education: 'Ph.D. in Computer Science',
  });

  const stats = [
    { label: 'Courses Teaching', value: '4', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Students', value: '114', icon: User, color: 'from-purple-500 to-pink-500' },
    { label: 'Years Teaching', value: '4', icon: Calendar, color: 'from-green-500 to-emerald-500' },
    { label: 'Avg. Rating', value: '4.8', icon: Award, color: 'from-orange-500 to-red-500' },
  ];

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg p-8 mb-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h2>
            <p className="text-lg text-gray-600 mb-4">{profile.specialization}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {profile.department}
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                {profile.education}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Office Location
            </label>
            <input
              type="text"
              value={profile.office}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, office: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Join Date
            </label>
            <input
              type="text"
              value={profile.joinDate}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 text-gray-700 opacity-60"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <BookOpen className="w-4 h-4" />
              Specialization
            </label>
            <input
              type="text"
              value={profile.specialization}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 disabled:opacity-60"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;




// /* ========================= ProfilePage.jsx (REAL DATA ONLY) =========================
//    - Uses ONLY fields returned by your UserSettingsController::profile()
//      { user: { id, name, email, role, profile_picture_url, created_at } }
//    - Updates using ONLY your controller methods:
//      updateName, updateEmail, uploadProfilePicture, deleteProfilePicture
//    - ✅ No fake data (no phone/department/office/stats)
// */
// import React, { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { User, Mail, Shield, Calendar, Save, UploadCloud, Trash2, XCircle } from "lucide-react";

// // ✅ IMPORTANT: These functions MUST call your existing backend routes.
// // Put them in: src/api/user_settings_api.js (code below)
// import {
//   getMyProfile,
//   updateMyName,
//   updateMyEmail,
//   uploadMyProfilePicture,
//   deleteMyProfilePicture,
// } from "../api/user_settings_api.js";

// const safeStr = (v) => (v === null || v === undefined ? "" : String(v));

// const ProfilePage = () => {
//   const localUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "null");
//     } catch {
//       return null;
//     }
//   }, []);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [user, setUser] = useState(() => localUser || null);

//   const [form, setForm] = useState({
//     name: safeStr(localUser?.name),
//     email: safeStr(localUser?.email),
//     current_password: "",
//   });

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await getMyProfile();
//         const u = res?.data?.user || res?.data?.data?.user || null;

//         if (mounted && u) {
//           setUser(u);
//           setForm((p) => ({
//             ...p,
//             name: safeStr(u.name),
//             email: safeStr(u.email),
//           }));

//           // ✅ keep localStorage in sync (so refresh still works)
//           localStorage.setItem("user", JSON.stringify(u));
//         }
//       } catch (e) {
//         if (mounted) {
//           const status = e?.response?.status;
//           setError(
//             status === 429
//               ? "Too many requests. Please wait a bit and refresh."
//               : e?.response?.data?.message || "Failed to load profile."
//           );
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const profileUrl = user?.profile_picture_url || "";
//   const initials = (safeStr(user?.name) || "U").trim().charAt(0).toUpperCase();
//   const createdAt = user?.created_at ? new Date(user.created_at) : null;

//   const clearMessagesSoon = () => {
//     setTimeout(() => {
//       setSuccess("");
//       setError("");
//     }, 2500);
//   };

//   const handleUpdateName = async () => {
//     const name = (form.name || "").trim();
//     if (!name) {
//       setError("Name is required.");
//       clearMessagesSoon();
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       const res = await updateMyName({ name });
//       const updated = res?.data?.user || null;

//       if (updated) {
//         setUser(updated);
//         localStorage.setItem("user", JSON.stringify(updated));
//         setSuccess("Name updated.");
//       } else {
//         setSuccess("Name updated.");
//       }
//     } catch (e) {
//       const status = e?.response?.status;
//       setError(
//         status === 429
//           ? "Too many requests. Please wait and try again."
//           : e?.response?.data?.message || "Failed to update name."
//       );
//     } finally {
//       setSaving(false);
//       clearMessagesSoon();
//     }
//   };

//   const handleUpdateEmail = async () => {
//     const email = (form.email || "").trim();
//     const current_password = form.current_password || "";

//     if (!email) {
//       setError("Email is required.");
//       clearMessagesSoon();
//       return;
//     }
//     if (!current_password) {
//       setError("Current password is required to change email.");
//       clearMessagesSoon();
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       const res = await updateMyEmail({ email, current_password });
//       const updated = res?.data?.user || null;

//       if (updated) {
//         setUser(updated);
//         localStorage.setItem("user", JSON.stringify(updated));
//       }
//       setForm((p) => ({ ...p, current_password: "" }));
//       setSuccess(res?.data?.message || "Email updated.");
//     } catch (e) {
//       const status = e?.response?.status;
//       const msg =
//         status === 429
//           ? "Too many requests. Please wait and try again."
//           : e?.response?.data?.message ||
//             (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join(", ") : "") ||
//             "Failed to update email.";
//       setError(msg);
//     } finally {
//       setSaving(false);
//       clearMessagesSoon();
//     }
//   };

//   const handleUploadImage = async (file) => {
//     if (!file) return;

//     setUploading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const fd = new FormData();
//       fd.append("profile_picture", file);

//       const res = await uploadMyProfilePicture(fd);
//       const updated = res?.data?.user || null;

//       if (updated) {
//         setUser(updated);
//         localStorage.setItem("user", JSON.stringify(updated));
//       }
//       setSuccess(res?.data?.message || "Profile picture uploaded.");
//     } catch (e) {
//       const status = e?.response?.status;
//       const msg =
//         status === 429
//           ? "Too many requests. Please wait and try again."
//           : e?.response?.data?.message ||
//             (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join(", ") : "") ||
//             "Failed to upload profile picture.";
//       setError(msg);
//     } finally {
//       setUploading(false);
//       clearMessagesSoon();
//     }
//   };

//   const handleDeleteImage = async () => {
//     setUploading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const res = await deleteMyProfilePicture();
//       const updated = res?.data?.user || null;

//       if (updated) {
//         setUser(updated);
//         localStorage.setItem("user", JSON.stringify(updated));
//       } else {
//         // fallback: remove locally if backend doesn't return user
//         setUser((p) => (p ? { ...p, profile_picture_url: null } : p));
//       }

//       setSuccess(res?.data?.message || "Profile picture deleted.");
//     } catch (e) {
//       const status = e?.response?.status;
//       setError(
//         status === 429
//           ? "Too many requests. Please wait and try again."
//           : e?.response?.data?.message || "Failed to delete profile picture."
//       );
//     } finally {
//       setUploading(false);
//       clearMessagesSoon();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen px-4 md:px-6 pb-10">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
//         <p className="text-gray-600">Account details (from API)</p>
//       </div>

//       <AnimatePresence>
//         {(error || success) && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -8, scale: 0.98 }}
//             className={`mb-5 rounded-2xl px-4 py-3 text-sm border-2 shadow-lg flex items-center gap-2 ${
//               error
//                 ? "bg-red-50/80 text-red-700 border-red-200/60"
//                 : "bg-emerald-50/80 text-emerald-800 border-emerald-200/60"
//             }`}
//           >
//             {error ? <XCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
//             <span>{error || success}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 18 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg p-8 mb-6"
//       >
//         <div className="flex flex-col md:flex-row items-center gap-6">
//           <div className="relative">
//             <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
//               {profileUrl ? (
//                 <img
//                   src={profileUrl}
//                   alt={safeStr(user?.name) || "User"}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.style.display = "none";
//                   }}
//                 />
//               ) : (
//                 <span>{initials}</span>
//               )}
//             </div>

//             <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-white/60 shadow cursor-pointer hover:bg-white transition">
//               <UploadCloud className="w-4 h-4 text-blue-600" />
//               <span className="text-sm font-semibold text-gray-700">
//                 {uploading ? "Uploading..." : "Upload"}
//               </span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 disabled={uploading}
//                 onChange={(e) => {
//                   const f = e.target.files?.[0];
//                   e.target.value = "";
//                   handleUploadImage(f);
//                 }}
//               />
//             </label>

//             <button
//               type="button"
//               onClick={handleDeleteImage}
//               disabled={uploading || !profileUrl}
//               className="ml-2 mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-white/60 shadow hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               <Trash2 className="w-4 h-4 text-red-600" />
//               <span className="text-sm font-semibold text-gray-700">Delete</span>
//             </button>
//           </div>

//           <div className="flex-1 text-center md:text-left">
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">{safeStr(user?.name) || "User"}</h2>

//             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
//               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
//                 <Mail className="w-4 h-4" />
//                 {safeStr(user?.email) || "—"}
//               </span>
//               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
//                 <Shield className="w-4 h-4" />
//                 {safeStr(user?.role) || "—"}
//               </span>
//               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
//                 <User className="w-4 h-4" />
//                 ID #{user?.id ?? "—"}
//               </span>
//             </div>

//             {createdAt && (
//               <div className="mt-3 text-sm text-gray-600 inline-flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 Joined: {createdAt.toLocaleString()}
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* Update Forms */}
//       <motion.div
//         initial={{ opacity: 0, y: 18 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.06 }}
//         className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg p-8"
//       >
//         <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h3>

//         {/* Update Name */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <User className="w-4 h-4" /> Name
//             </label>
//             <input
//               value={form.name}
//               onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
//               className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//               placeholder="Your name"
//               disabled={saving}
//             />
//           </div>
//           <div className="flex items-end">
//             <button
//               type="button"
//               onClick={handleUpdateName}
//               disabled={saving}
//               className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
//             >
//               {saving ? "Saving..." : "Update Name"}
//             </button>
//           </div>
//         </div>

//         {/* Update Email (requires current_password by your controller) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <Mail className="w-4 h-4" /> Email
//             </label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
//               className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//               placeholder="Your email"
//               disabled={saving}
//             />

//             <label className="block text-xs font-semibold text-gray-600 mt-3 mb-2">
//               Current password (required to change email)
//             </label>
//             <input
//               type="password"
//               value={form.current_password}
//               onChange={(e) => setForm((p) => ({ ...p, current_password: e.target.value }))}
//               className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//               placeholder="••••••••"
//               disabled={saving}
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               type="button"
//               onClick={handleUpdateEmail}
//               disabled={saving}
//               className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
//             >
//               {saving ? "Saving..." : "Update Email"}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ProfilePage;
