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
