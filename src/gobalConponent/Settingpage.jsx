import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
  Shield,
  Bell,
  Palette,
  LogOut,
  Key,
  SlidersHorizontal,
} from "lucide-react";
import userSettingsApi from "../api/setting_api.jsx";
import profileFallback from "../assets/images/profile.png";
import Alert from "./Alert.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";

const SettingPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef(null);

  // Profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email change states
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  // Delete account states
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // UI states
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
  const [confirm, setConfirm] = useState({ show: false, title: "", message: "", action: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setName(userData.name || "");
        setEmail(userData.email || "");
        setLoading(false);
      } catch {
        localStorage.removeItem("user");
      }
    }
    fetchProfile();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userSettingsApi.getProfile();
      const userData = response.data.user;
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to load profile:", error);
      showMessage("error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setAlert({ show: true, message: text, type });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "Image size must be less than 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"].includes(file.type)) {
      showMessage("error", "Please upload a valid image file (JPG, PNG, GIF, WEBP)");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadImage = async () => {
    if (!profilePicture) return;

    try {
      setIsSubmitting(true);
      const response = await userSettingsApi.uploadProfilePicture(profilePicture);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfilePicture(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);

      showMessage("success", "Profile picture updated successfully!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = () => {
    setConfirm({
      show: true,
      title: "Remove Profile Picture",
      message: "Are you sure you want to remove your profile picture?",
      action: async () => {
        try {
          setIsSubmitting(true);
          const response = await userSettingsApi.deleteProfilePicture();
          const updatedUser = response.data.user;

          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);

          showMessage("success", "Profile picture removed successfully!");
          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          showMessage("error", "Failed to delete profile picture");
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showMessage("error", "Name cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await userSettingsApi.updateName(name);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showMessage("success", "Name updated successfully!");
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to update name");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !emailPassword.trim()) {
      showMessage("error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showMessage("error", "Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await userSettingsApi.updateEmail(newEmail, emailPassword);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      setEmail(updatedUser.email);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setNewEmail("");
      setEmailPassword("");
      showMessage("success", "Email updated successfully!");
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to update email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("error", "Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      showMessage("error", "Password must be at least 8 characters");
      return;
    }

    if (newPassword === currentPassword) {
      showMessage("error", "New password must be different from current password");
      return;
    }

    try {
      setIsSubmitting(true);
      await userSettingsApi.changePassword(currentPassword, newPassword, confirmPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showMessage("success", "Password changed successfully!");
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      showMessage("error", "Please enter your password");
      return;
    }

    try {
      setIsSubmitting(true);
      await userSettingsApi.deleteAccount(deletePassword);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      showMessage("success", "Account deleted successfully");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to delete account");
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, description: "Personal information & avatar" },
    { id: "security", label: "Security", icon: Shield, description: "Password & account safety" },
    { id: "preferences", label: "Preferences", icon: Palette, description: "Customize your experience" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts & activity updates" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  const ActiveTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen space-y-6">


      {/* MESSAGE ALERT */}
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <ConfirmDialog
        isOpen={confirm.show}
        title={confirm.title}
        message={confirm.message}
        onConfirm={async () => {
          if (confirm.action) await confirm.action();
          setConfirm({ ...confirm, show: false });
        }}
        onCancel={() => setConfirm({ ...confirm, show: false })}
        confirmText="Confirm"
        type="danger"
      />

      {/* TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.015, y: -3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative overflow-hidden p-6 rounded-2xl border transition-all text-left ${isActive
                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent shadow-xl"
                : "bg-white/50 backdrop-blur-2xl border-white/30 text-gray-700 hover:border-blue-300/50 shadow-md"
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-2xl ${isActive ? "bg-white/15" : "bg-blue-500/10"}`}>
                  <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-blue-600"}`} />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-bold text-lg ${isActive ? "text-white" : "text-gray-900"}`}>{tab.label}</h3>
                  <p className={`text-xs mt-1 ${isActive ? "text-white/80" : "text-gray-600"}`}>{tab.description}</p>
                </div>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            {/* PROFILE PICTURE */}
            <div className="rounded-3xl p-8 border border-white/30 bg-white/55 backdrop-blur-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                Profile Picture
              </h3>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 blur group-hover:opacity-90 transition duration-300" />
                  <img
                    src={previewUrl || user?.profile_picture_url || profileFallback}
                    alt="Profile"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    type="button"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="flex-1 w-full space-y-4">
                  <div className="rounded-2xl p-4 border border-blue-200/40 bg-blue-50/50">
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Max size: 2MB. Formats: JPG, PNG, GIF, WEBP</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      type="button"
                    >
                      <Camera className="w-5 h-5" />
                      Choose Image
                    </motion.button>

                    {profilePicture && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleUploadImage}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                        type="button"
                      >
                        {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Upload
                      </motion.button>
                    )}

                    {user?.profile_picture_url && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleDeleteImage}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                        type="button"
                      >
                        {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        Remove
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* UPDATE NAME */}
            <div className="rounded-3xl p-8 border border-white/30 bg-white/55 backdrop-blur-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                Full Name
              </h3>

              <form onSubmit={handleUpdateName} className="space-y-4">
                <Field
                  label="Your Name"
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  type="text"
                />
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting || name === user?.name}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Update Name
                </motion.button>
              </form>
            </div>

            {/* UPDATE EMAIL */}
            <div className="rounded-3xl p-8 border border-white/30 bg-white/55 backdrop-blur-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-green-500/10">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                Email Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl border border-white/30 bg-gray-100/70 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <Field
                    label="New Email Address"
                    icon={Mail}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    type="email"
                  />
                  <Field
                    label="Confirm with Password"
                    icon={Lock}
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="Enter your current password"
                    type="password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                    Update Email
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            {/* CHANGE PASSWORD */}
            <div className="rounded-3xl p-8 border border-white/30 bg-white/55 backdrop-blur-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                Change Password
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  show={showCurrentPassword}
                  setShow={setShowCurrentPassword}
                  placeholder="Enter current password"
                />

                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                  placeholder="Enter new password (min. 8 characters)"
                />

                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  placeholder="Confirm new password"
                />

                {newPassword && (
                  <div className="rounded-2xl p-4 border border-blue-200/40 bg-blue-50/50">
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <Key className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>
                        Password strength:{" "}
                        {newPassword.length < 8 ? "Too short" : newPassword.length < 12 ? "Good" : "Strong"}
                      </span>
                    </p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                  Change Password
                </motion.button>
              </form>
            </div>

            {/* DANGER ZONE */}
            <div className="rounded-3xl p-8 border border-red-200/50 bg-red-50/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(220,38,38,0.15)]">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/10">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                Danger Zone
              </h3>
              <p className="text-gray-700 mb-6">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowDeleteModal(true)}
                className="px-8 py-3 bg-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                type="button"
              >
                <Trash2 className="w-5 h-5" />
                Delete My Account
              </motion.button>
            </div>

            {/* LOGOUT */}
            <div className="rounded-3xl p-8 border border-white/30 bg-white/55 backdrop-blur-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10">
                  <LogOut className="w-6 h-6 text-orange-600" />
                </div>
                Session Management
              </h3>
              <p className="text-gray-700 mb-6">
                Sign out of your account on this device. You&apos;ll need to sign in again to access your account.
              </p>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                type="button"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeTab === "preferences" && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-3xl p-8 border border-white/30 bg-white/55 backdrop-blur-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              Appearance & Preferences
            </h3>
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Preference settings coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">Theme customization, language options, and more</p>
            </div>
          </motion.div>
        )}

        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-3xl p-8 border border-white/30 bg-white/55 backdrop-blur-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              Notification Preferences
            </h3>
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Notification settings coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">Email alerts, push notifications, and activity updates</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => !isSubmitting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-3xl p-8 border border-red-200/50 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Account?</h3>
                <p className="text-gray-600">
                  This action <span className="font-bold text-red-600">cannot be undone</span>. All your data will be
                  permanently deleted.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter your password to confirm</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-red-200/50 bg-gray-100/70 focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all outline-none"
                  placeholder="Your password"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                  type="button"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting || !deletePassword}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  type="button"
                >
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete Forever
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===================== REUSABLE UI ===================== */

const Field = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  );
};

const PasswordField = ({ label, value, onChange, show, setShow, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 bg-white/60 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default SettingPage;
