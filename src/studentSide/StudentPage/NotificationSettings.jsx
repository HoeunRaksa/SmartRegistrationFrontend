import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, DollarSign, GraduationCap, FileText, Save, Loader } from 'lucide-react';
import axios from 'axios';

const NotificationSettings = () => {
    const [preferences, setPreferences] = useState({
        registration_emails: true,
        payment_emails: true,
        grade_emails: true,
        assignment_emails: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/student/notification-preferences');
            if (response.data.success) {
                setPreferences(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage('');

            const response = await axios.put('/api/student/notification-preferences', preferences);

            if (response.data.success) {
                setMessage('Preferences saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Failed to save preferences. Please try again.');
            console.error('Save error:', error);
        } finally {
            setSaving(false);
        }
    };

    const notificationTypes = [
        {
            key: 'registration_emails',
            icon: FileText,
            title: 'Registration Notifications',
            description: 'Get notified about registration confirmations and updates',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            key: 'payment_emails',
            icon: DollarSign,
            title: 'Payment Reminders',
            description: 'Receive reminders about pending tuition payments',
            color: 'from-green-500 to-emerald-500'
        },
        {
            key: 'grade_emails',
            icon: GraduationCap,
            title: 'Grade Alerts',
            description: 'Get notified when new grades are published',
            color: 'from-purple-500 to-pink-500'
        },
        {
            key: 'assignment_emails',
            icon: Bell,
            title: 'Assignment Reminders',
            description: 'Receive alerts about upcoming assignment deadlines',
            color: 'from-orange-500 to-red-500'
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] grid place-items-center">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Email Notifications</h2>
                        <p className="text-sm text-gray-600">Manage your notification preferences</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {notificationTypes.map((type, index) => {
                        const Icon = type.icon;
                        const isEnabled = preferences[type.key];

                        return (
                            <motion.div
                                key={type.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/60 transition-all"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${type.color}`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{type.title}</h3>
                                        <p className="text-sm text-gray-600">{type.description}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleToggle(type.key)}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${isEnabled ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-4 rounded-xl ${message.includes('success')
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                    >
                        {message}
                    </motion.div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all ${saving
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                            }`}
                    >
                        {saving ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Preferences
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
