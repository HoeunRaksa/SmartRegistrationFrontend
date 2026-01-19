import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader,
  AlertCircle
} from 'lucide-react';
import { fetchStudentSchedule, fetchTodaySchedule, downloadSchedule } from '../../api/schedule_api';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const [scheduleRes, todayRes] = await Promise.all([
        fetchStudentSchedule().catch(() => ({ data: { data: [] } })),
        fetchTodaySchedule().catch(() => ({ data: { data: [] } }))
      ]);

      // Mock data if API fails
      const mockSchedule = [
        {
          id: 1,
          course_code: 'CS101',
          course_name: 'Introduction to Computer Science',
          instructor: 'Dr. Sarah Johnson',
          day: 'Monday',
          start_time: '10:00',
          end_time: '11:30',
          room: 'Room 301',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 2,
          course_code: 'CS101',
          course_name: 'Introduction to Computer Science',
          instructor: 'Dr. Sarah Johnson',
          day: 'Wednesday',
          start_time: '10:00',
          end_time: '11:30',
          room: 'Room 301',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 3,
          course_code: 'MATH201',
          course_name: 'Calculus II',
          instructor: 'Prof. Michael Chen',
          day: 'Tuesday',
          start_time: '14:00',
          end_time: '15:30',
          room: 'Room 205',
          color: 'from-purple-500 to-pink-500'
        },
        {
          id: 4,
          course_code: 'MATH201',
          course_name: 'Calculus II',
          instructor: 'Prof. Michael Chen',
          day: 'Thursday',
          start_time: '14:00',
          end_time: '15:30',
          room: 'Room 205',
          color: 'from-purple-500 to-pink-500'
        },
        {
          id: 5,
          course_code: 'ENG102',
          course_name: 'Academic Writing',
          instructor: 'Dr. Emily White',
          day: 'Monday',
          start_time: '13:00',
          end_time: '14:00',
          room: 'Room 112',
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 6,
          course_code: 'ENG102',
          course_name: 'Academic Writing',
          instructor: 'Dr. Emily White',
          day: 'Wednesday',
          start_time: '13:00',
          end_time: '14:00',
          room: 'Room 112',
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 7,
          course_code: 'ENG102',
          course_name: 'Academic Writing',
          instructor: 'Dr. Emily White',
          day: 'Friday',
          start_time: '13:00',
          end_time: '14:00',
          room: 'Room 112',
          color: 'from-green-500 to-emerald-500'
        }
      ];

      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const mockToday = mockSchedule.filter(item => item.day === today);

      setSchedule(scheduleRes.data?.data?.length > 0 ? scheduleRes.data.data : mockSchedule);
      setTodayClasses(todayRes.data?.data?.length > 0 ? todayRes.data.data : mockToday);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadSchedule();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-schedule.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download schedule:', error);
    }
  };

  const getClassForSlot = (day, time) => {
    return schedule.find(item => {
      const itemHour = parseInt(item.start_time?.split(':')[0] || '0');
      const slotHour = parseInt(time.split(':')[0]);
      return item.day === day && itemHour === slotHour;
    });
  };

  const calculateGridRow = (startTime, endTime) => {
    const startHour = parseInt(startTime?.split(':')[0] || '0');
    const endHour = parseInt(endTime?.split(':')[0] || '0');
    const startMinute = parseInt(startTime?.split(':')[1] || '0');
    const endMinute = parseInt(endTime?.split(':')[1] || '0');

    const startRow = (startHour - 8) * 2 + (startMinute >= 30 ? 2 : 1);
    const duration = (endHour - startHour) * 2 + (endMinute - startMinute) / 30;

    return { start: startRow + 1, span: Math.max(1, Math.floor(duration)) };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Class Schedule</h2>
          <p className="text-gray-600">View your weekly class timetable</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              viewMode === 'week'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              viewMode === 'day'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80'
            }`}
          >
            Day View
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Today's Classes Quick View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 border border-white/20 shadow-lg"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Today's Classes ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
        </h3>
        {todayClasses.length === 0 ? (
          <p className="text-white/80">No classes scheduled for today</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayClasses.map((classItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl bg-white/20 rounded-xl p-4 border border-white/30"
              >
                <div className="text-sm font-semibold text-white/90 mb-2">{classItem.course_code}</div>
                <h4 className="text-white font-bold mb-2">{classItem.course_name}</h4>
                <div className="space-y-1 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {classItem.start_time} - {classItem.end_time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {classItem.room}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {classItem.instructor}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Weekly Schedule Grid */}
      {viewMode === 'week' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg overflow-x-auto"
        >
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="text-center font-semibold text-gray-600 text-sm">Time</div>
              {daysOfWeek.slice(0, 5).map((day) => (
                <div key={day} className="text-center font-bold text-gray-900">
                  <div className="text-base">{day.substring(0, 3)}</div>
                  <div className="text-xs text-gray-500">{day}</div>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-2">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 gap-2">
                  <div className="text-center text-sm text-gray-600 font-medium py-3">
                    {time}
                  </div>
                  {daysOfWeek.slice(0, 5).map((day) => {
                    const classItem = getClassForSlot(day, time);
                    return (
                      <div key={`${day}-${time}`} className="relative">
                        {classItem ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`backdrop-blur-xl bg-gradient-to-br ${classItem.color} rounded-xl p-3 border border-white/30 shadow-md h-full min-h-[80px]`}
                          >
                            <div className="text-xs font-bold text-white mb-1">
                              {classItem.course_code}
                            </div>
                            <div className="text-xs text-white/90 mb-1 line-clamp-2">
                              {classItem.course_name}
                            </div>
                            <div className="text-xs text-white/80 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {classItem.room}
                            </div>
                          </motion.div>
                        ) : (
                          <div className="backdrop-blur-xl bg-gray-100/50 rounded-xl h-20 border border-gray-200/30" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <div className="space-y-4">
            {todayClasses.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">No classes today</p>
                <p className="text-sm text-gray-500">Enjoy your day off!</p>
              </div>
            ) : (
              todayClasses.map((classItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`backdrop-blur-xl bg-gradient-to-br ${classItem.color} rounded-2xl p-6 border border-white/20 shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="inline-block px-3 py-1 bg-white/30 rounded-lg text-sm font-bold text-white mb-2">
                        {classItem.course_code}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{classItem.course_name}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Time</div>
                        <div className="font-semibold">{classItem.start_time} - {classItem.end_time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Location</div>
                        <div className="font-semibold">{classItem.room}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Instructor</div>
                        <div className="font-semibold">{classItem.instructor}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SchedulePage;
