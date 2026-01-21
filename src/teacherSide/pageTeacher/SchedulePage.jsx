import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const SchedulePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const schedule = {
    Monday: [
      { time: '09:00 - 10:30', course: 'Web Development', code: 'CS301', room: 'Room 301', students: 28, color: 'from-blue-500 to-cyan-500' },
      { time: '14:00 - 15:30', course: 'Software Engineering', code: 'CS501', room: 'Room 401', students: 24, color: 'from-green-500 to-emerald-500' },
    ],
    Tuesday: [
      { time: '11:00 - 12:30', course: 'Database Systems', code: 'CS402', room: 'Room 205', students: 32, color: 'from-purple-500 to-pink-500' },
      { time: '15:00 - 16:30', course: 'Computer Networks', code: 'CS403', room: 'Room 302', students: 30, color: 'from-orange-500 to-red-500' },
    ],
    Wednesday: [
      { time: '09:00 - 10:30', course: 'Web Development', code: 'CS301', room: 'Room 301', students: 28, color: 'from-blue-500 to-cyan-500' },
      { time: '14:00 - 15:30', course: 'Software Engineering', code: 'CS501', room: 'Room 401', students: 24, color: 'from-green-500 to-emerald-500' },
    ],
    Thursday: [
      { time: '11:00 - 12:30', course: 'Database Systems', code: 'CS402', room: 'Room 205', students: 32, color: 'from-purple-500 to-pink-500' },
      { time: '15:00 - 16:30', course: 'Computer Networks', code: 'CS403', room: 'Room 302', students: 30, color: 'from-orange-500 to-red-500' },
    ],
    Friday: [
      { time: '09:00 - 10:30', course: 'Web Development', code: 'CS301', room: 'Room 301', students: 28, color: 'from-blue-500 to-cyan-500' },
    ],
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Schedule</h1>
        <p className="text-gray-600">View your teaching schedule and upcoming classes</p>
      </motion.div>

      {/* Week Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6 backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-lg"
      >
        <button className="p-2 rounded-lg hover:bg-white/60 transition-all">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-gray-600">Week {Math.ceil(currentWeek.getDate() / 7)}</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-white/60 transition-all">
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </motion.div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day, dayIndex) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.05 }}
            className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <h3 className="font-bold text-lg">{day}</h3>
              <p className="text-sm opacity-90">
                {new Date(currentWeek.getTime() + dayIndex * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="p-4 space-y-3">
              {schedule[day] ? (
                schedule[day].map((classItem, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-white/50 border border-white/60 hover:bg-white/70 transition-all"
                  >
                    <div className={`inline-flex px-2 py-1 rounded-lg bg-gradient-to-r ${classItem.color} text-white text-xs font-semibold mb-2`}>
                      {classItem.time}
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{classItem.course}</h4>
                    <p className="text-xs text-gray-600 mb-2">{classItem.code}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{classItem.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Users className="w-3 h-3" />
                      <span>{classItem.students} students</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No classes</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Classes', value: '11', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
          { label: 'Teaching Hours', value: '16.5', icon: Clock, color: 'from-purple-500 to-pink-500' },
          { label: 'Total Students', value: '172', icon: Users, color: 'from-green-500 to-emerald-500' },
          { label: 'Rooms Used', value: '4', icon: MapPin, color: 'from-orange-500 to-red-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-lg"
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SchedulePage;
