import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { fetchTeacherSchedule } from '../../api/teacher_api';

const SchedulePage = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetchTeacherSchedule();
      const raw = res.data?.data || [];

      // Transform to { Monday: [], Tuesday: [], ... }
      const grouped = raw.reduce((acc, item) => {
        const day = item.day_of_week;
        if (!acc[day]) acc[day] = [];
        acc[day].push({
          time: `${item.start_time} - ${item.end_time}`,
          course: item.course_name,
          course_id: item.course_id,
          code: item.course_code,
          room: item.room,
          color: 'from-blue-500 to-cyan-500'
        });
        return acc;
      }, {});

      setScheduleData(grouped);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
        className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 border border-gray-200 shadow-lg"
      >
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-gray-600">Active Schedule</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all">
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </motion.div>

      {/* Weekly Schedule Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {days.map((day, dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <h3 className="font-bold text-lg">{day}</h3>
                <p className="text-xs opacity-90">Class Session</p>
              </div>
              <div className="p-4 space-y-3">
                {scheduleData[day] ? (
                  scheduleData[day].map((classItem, index) => (
                    <div
                      key={index}
                      onClick={() => navigate('/teacher/attendance', {
                        state: {
                          courseId: classItem.course_id,
                          startTime: classItem.time.split(' - ')[0],
                          endTime: classItem.time.split(' - ')[1],
                          room: classItem.room
                        }
                      })}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all shadow-sm group"
                    >
                      <div className={`inline-flex px-2 py-1 rounded-lg bg-gradient-to-r ${classItem.color} text-white text-[10px] font-bold mb-2 group-hover:scale-105 transition-transform`}>
                        {classItem.time}
                      </div>
                      <h4 className="font-bold text-gray-800 text-xs mb-1 group-hover:text-blue-700">{classItem.course}</h4>
                      <p className="text-[10px] text-gray-500 mb-2 truncate">{classItem.code}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span className="truncate">{classItem.room}</span>
                      </div>
                      <div className="mt-2 text-[10px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Take Attendance →
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs italic">No classes</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Summary */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 bg-white/60 rounded-3xl border border-gray-200 text-center"
        >
          <p className="text-gray-600 text-sm italic">Showing your formal academic teaching schedule for the current semester.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SchedulePage;
