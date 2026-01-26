import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Camera,
    Save,
    Loader,
    CheckCircle,
    AlertCircle,
    Mail,
    Phone,
    MapPin,
    Shield,
    Eye,
    EyeOff,
    LogOut
} from 'lucide-react';
import {
    fetchStudentProfile,
    updateStudentProfile,
    changeStudentPassword,
    uploadStudentProfilePicture
} from '../../api/student_api';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    // Profile Form State
    const [formData, setFormData] = useState({
        phone_number: '',
        address: '',
        parent_name: '',
        parent_phone: ''
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await fetchStudentProfile();
            const data = response.data?.data || response.data || {};
            setProfile(data);
            setFormData({
                phone_number: data.phone_number || '',
                address: data.address || '',
                parent_name: data.parent_name || '',
                parent_phone: data.parent_phone || ''
            });
        } catch (error) {
            console.error('Failed to load profile:', error);
            showMessage('error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateStudentProfile(formData);
            showMessage('success', 'Profile updated successfully');
            await loadProfile(); // Reload to sync
        } catch (error) {
            console.error('Update error:', error);
            showMessage('error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            showMessage('error', 'New passwords do not match');
            return;
        }
        try {
            setSaving(true);
            await changeStudentPassword(
                passwordData.current_password,
                passwordData.new_password,
                passwordData.new_password_confirmation
            );
            showMessage('success', 'Password changed successfully');
            setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (error) {
            console.error('Password error:', error);
            showMessage('error', error.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showMessage('error', 'Image size must be less than 2MB');
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('profile_picture', file);

            await uploadStudentProfilePicture(formData);
            showMessage('success', 'Profile picture updated');

            // small delay to allow backend to process/propagate if needed
            setTimeout(() => {
                loadProfile();
                // Reload page to refresh all image instances (header, sidebar)
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Upload error:', error);
            showMessage('error', error.response?.data?.message || 'Failed to upload image');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Edit Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-6"
            >
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-black bg-clip-text text-transparent flex items-center gap-3">
                        <User className="w-8 h-8 text-gray-700" />
                        Account Settings
                    </h2>
                    <p className="text-gray-600 mt-1 font-medium">Manage your personal information and preferences</p>
                </div>
            </motion.div>

            {/* Message Alert */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className={`overflow-hidden rounded-2xl border ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <div className="p-4 flex items-center gap-3">
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <p className={`font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                {message.text}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white/60 hover:bg-white text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Profile Picture Card */}
                                <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 border border-white/40 shadow-lg">
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                                <img
                                                    src={profile?.profile_picture_url || `https://ui-avatars.com/api/?name=${profile?.name}&background=random`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h3 className="text-xl font-bold text-gray-900">{profile?.name}</h3>
                                            <p className="text-gray-500">{profile?.student_code}</p>
                                            <p className="text-xs text-blue-600 font-medium mt-1">
                                                Allowed: JPG, PNG. Max 2MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Form */}
                                <form onSubmit={handleProfileUpdate} className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 border border-white/40 shadow-lg space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={formData.phone_number}
                                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Parent's Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.parent_name}
                                                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder="Parent or Guardian Name"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Parent's Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={formData.parent_phone}
                                                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder="Parent Contact Number"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <textarea
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                                                    placeholder="Your residential address"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 border border-white/40 shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-gray-700" />
                                    Change Password
                                </h3>

                                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.current ? "text" : "password"}
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.new ? "text" : "password"}
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.confirm ? "text" : "password"}
                                                value={passwordData.new_password_confirmation}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                                        Update Password
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 border border-white/40 shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-gray-700" />
                                    Notification Preferences (Demo)
                                </h3>
                                <div className="space-y-4 text-gray-600">
                                    <div className="flex items-center justify-between p-4 bg-white/40 rounded-xl">
                                        <span>Email Notifications for Grades</span>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/40 rounded-xl">
                                        <span>Email Notifications for Assignments</span>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/40 rounded-xl">
                                        <span>SMS Alerts for Urgent Updates</span>
                                        <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
