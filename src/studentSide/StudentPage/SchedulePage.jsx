import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
} from "lucide-react";
import {
  fetchStudentSchedule,
  fetchTodaySchedule,
  downloadSchedule,
} from "../../api/schedule_api";

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'day'
  const [error, setError] = useState("");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  useEffect(() => {
    loadSchedule();
  }, []);

  // Helper to flatten/normalize backend data
  const normalizeScheduleData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      const course = item.course || {};
      // Generate a consistent color based on course code
      const colors = [
        "from-blue-500 to-cyan-500",
        "from-purple-500 to-pink-500",
        "from-orange-500 to-red-500",
        "from-green-500 to-emerald-500",
        "from-indigo-500 to-purple-500",
        "from-pink-500 to-rose-500",
      ];
      const colorIndex = (course.course_code || "A").charCodeAt(0) % colors.length;

      return {
        id: item.id,
        course_id: course.id,
        course_code: course.course_code || course.code || "N/A",
        course_name: course.course_name || course.title || "N/A",
        instructor: course.instructor || course.instructor_name || "N/A",
        day: item.day_of_week || item.day,
        start_time: item.start_time?.slice(0, 5), // HH:MM
        end_time: item.end_time?.slice(0, 5),
        room: item.room || "N/A",
        session_type: item.session_type || "Class",
        color: colors[colorIndex],
        raw_date: item.date, // for today/upcoming
      };
    });
  };

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError("");

      const [scheduleRes, todayRes] = await Promise.all([
        fetchStudentSchedule(),
        fetchTodaySchedule(),
      ]);

      const scheduleData = normalizeScheduleData(scheduleRes?.data?.data);
      const todayData = normalizeScheduleData(todayRes?.data?.data);

      setSchedule(scheduleData);
      setTodayClasses(todayData);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      // Fallback or nice error message
      setError("Could not load schedule. Please checking your connection.");
      setSchedule([]);
      setTodayClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setError("");
      const response = await downloadSchedule();

      const blob = new Blob([response.data], {
        type: response.headers?.["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // backend may send filename via content-disposition
      const disposition = response.headers?.["content-disposition"] || "";
      const match = disposition.match(/filename="(.+)"/);
      const filename = match?.[1] || "my-schedule.json";

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download schedule:", err);
      setError(err?.response?.data?.message || "Failed to download schedule.");
    }
  };

  const getClassForSlot = (day, time) => {
    return schedule.find((item) => {
      const itemHour = parseInt(item.start_time?.split(":")[0] || "0");
      const slotHour = parseInt(time.split(":")[0]);
      return item.day === day && itemHour === slotHour;
    });
  };

  const calculateGridRow = (startTime, endTime) => {
    const startHour = parseInt(startTime?.split(":")[0] || "0");
    const endHour = parseInt(endTime?.split(":")[0] || "0");
    const startMinute = parseInt(startTime?.split(":")[1] || "0");
    const endMinute = parseInt(endTime?.split(":")[1] || "0");

    const startRow = (startHour - 8) * 2 + (startMinute >= 30 ? 2 : 1);
    const duration = (endHour - startHour) * 2 + (endMinute - startMinute) / 30;

    return { start: startRow + 1, span: Math.max(1, Math.floor(duration)) };
  };

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 Sunday - 6 Saturday
    const diff = (day === 0 ? -6 : 1) - day; // make Monday start
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfWeek = (date) => {
    const start = startOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const formatWeekRange = (date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    const opts = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString(
      "en-US",
      opts
    )}`;
  };

  const goPrevWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() - 7);
    setCurrentWeek(d);
  };

  const goNextWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + 7);
    setCurrentWeek(d);
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] grid place-items-center px-6">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-2xl" />
          <div className="rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl p-10 flex flex-col items-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader className="w-12 h-12 text-blue-600" />
            </motion.div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">Loading schedule</div>
              <div className="text-sm text-gray-500">Please wait a moment…</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="relative overflow-hidden rounded-[22px] border border-red-200/70 bg-red-50/70 backdrop-blur-xl shadow-sm"
          >
            <div className="p-4 flex items-start gap-3">
              <div className="mt-0.5 p-2 rounded-xl bg-red-500/10 border border-red-200/70">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-700">{error}</p>
                <button
                  onClick={loadSchedule}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800 underline underline-offset-4"
                >
                  Retry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO HEADER (Glass iOS style) */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />

        <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-white/60 border border-white/60 shadow-sm">
                <BookOpen className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Class Schedule
              </h2>
            </div>
            <p className="text-gray-600 mt-2">
              Manage your weekly academic timetable
            </p>

            {/* Week Navigator */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-sm p-1">
              <button
                onClick={goPrevWeek}
                className="p-2 rounded-xl hover:bg-white/80 transition-all text-gray-700 hover:text-blue-700"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="px-3 py-1.5 text-sm font-semibold text-gray-900 flex items-center gap-2 min-w-[170px] justify-center rounded-xl bg-white/60 border border-white/60">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                {formatWeekRange(currentWeek)}
              </div>

              <button
                onClick={goNextWeek}
                className="p-2 rounded-xl hover:bg-white/80 transition-all text-gray-700 hover:text-blue-700"
                aria-label="Next week"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex rounded-2xl bg-white/60 border border-white/60 shadow-sm p-1">
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  viewMode === "week"
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-white/60"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode("day")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  viewMode === "day"
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-white/60"
                }`}
              >
                Day
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-2xl bg-white/70 text-gray-900 border border-white/70 hover:bg-white/90 transition-all flex items-center justify-center gap-2 font-semibold text-sm shadow-sm"
            >
              <Download className="w-4 h-4 text-blue-700" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Today's Classes Quick View */}
      <AnimatePresence>
        {todayClasses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 to-indigo-600 p-[1px] shadow-xl"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative rounded-[27px] bg-white/10 backdrop-blur-xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-white/15 rounded-2xl border border-white/20">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Today’s Classes</h3>
                  <p className="text-blue-100 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayClasses.map((classItem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    className="group rounded-[22px] border border-white/40 bg-white/85 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                        {classItem.course_code}
                      </span>
                      <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            classItem.session_type === "Lab" ? "bg-purple-500" : "bg-green-500"
                          }`}
                        />
                        {classItem.session_type}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-gray-900 leading-tight mb-3 line-clamp-1 group-hover:line-clamp-none transition-all">
                      {classItem.course_name}
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50/80 border border-gray-100 rounded-xl p-2">
                        <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="font-semibold text-gray-900">
                          {classItem.start_time} - {classItem.end_time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 px-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-500" />
                          <span className="truncate max-w-[140px]">{classItem.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-500" />
                          <span className="truncate max-w-[140px]">{classItem.instructor}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Schedule Grid */}
      {viewMode === "week" && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 to-white/10" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="overflow-x-auto">
            <div className="min-w-[1000px] p-5 sm:p-6">
              {/* Days Header */}
              <div className="grid grid-cols-8 gap-4 mb-6 sticky top-0 z-10">
                <div className="text-center font-extrabold text-gray-400 text-[11px] uppercase tracking-widest pt-3">
                  Time
                </div>
                {daysOfWeek.map((day) => {
                  const isToday = todayName === day;
                  return (
                    <div
                      key={day}
                      className={`text-center p-2 rounded-2xl transition-colors border ${
                        isToday
                          ? "bg-blue-50/80 border-blue-200/70"
                          : "bg-white/50 border-white/60"
                      }`}
                    >
                      <div className={`text-sm font-extrabold ${isToday ? "text-blue-700" : "text-gray-900"}`}>
                        {day.substring(0, 3)}
                      </div>
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TIMETABLE GRID */}
              <div
                className="relative grid grid-cols-8 gap-4"
                style={{
                  gridTemplateRows: "repeat(26, 60px)",
                }}
              >
                {/* Background Grid Lines & Time Labels */}
                {Array.from({ length: 13 }).map((_, i) => {
                  const hour = 7 + i;
                  const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
                  return (
                    <React.Fragment key={hour}>
                      <div
                        className="text-center text-xs font-semibold text-gray-400 -mt-2.5 relative z-10"
                        style={{ gridRow: `${i * 2 + 1} / span 1`, gridColumn: "1" }}
                      >
                        {timeLabel}
                      </div>

                      <div
                        className="col-span-7 border-t border-gray-100/80 w-full h-0 absolute left-0 right-0 z-0"
                        style={{
                          gridRow: `${i * 2 + 1}`,
                          gridColumn: "2 / span 7",
                          top: 0,
                        }}
                      />
                      <div
                        className="col-span-7 border-t border-dashed border-gray-100/50 w-full h-0 absolute left-0 right-0 z-0"
                        style={{
                          gridRow: `${i * 2 + 2}`,
                          gridColumn: "2 / span 7",
                          top: 0,
                        }}
                      />
                    </React.Fragment>
                  );
                })}

                {/* CLASS BLOCKS */}
                <AnimatePresence>
                  {schedule.map((classItem, index) => {
                    const dayIndex = daysOfWeek.indexOf(classItem.day);
                    if (dayIndex === -1) return null;

                    const startH = parseInt(classItem.start_time.split(":")[0]);
                    const startM = parseInt(classItem.start_time.split(":")[1]);
                    const endH = parseInt(classItem.end_time.split(":")[0]);
                    const endM = parseInt(classItem.end_time.split(":")[1]);

                    const startMinutesFrom7 = (startH - 7) * 60 + startM;
                    const durationMinutes = endH * 60 + endM - (startH * 60 + startM);

                    const startRow = Math.floor(startMinutesFrom7 / 30) + 1;
                    const spanRows = Math.ceil(durationMinutes / 30);

                    if (startRow < 1) return null;

                    const isTodayCol = classItem.day === todayName;

                    return (
                      <motion.div
                        key={`${classItem.id}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        whileHover={{ scale: 1.02, zIndex: 50 }}
                        transition={{ duration: 0.28, delay: index * 0.035 }}
                        className={[
                          "rounded-[22px] p-3 border shadow-md cursor-pointer relative overflow-hidden",
                          "bg-gradient-to-br",
                          classItem.color,
                          "border-white/25 hover:shadow-xl",
                          isTodayCol ? "ring-2 ring-white/30" : "",
                        ].join(" ")}
                        style={{
                          gridColumn: dayIndex + 2,
                          gridRow: `${startRow} / span ${spanRows}`,
                          zIndex: 10,
                        }}
                      >
                        {/* Glass shine */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/12 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-28 h-28 bg-black/10 blur-2xl rounded-full -ml-12 -mb-12 pointer-events-none" />

                        <div className="flex flex-col h-full justify-between relative z-10">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <span className="text-[10px] font-extrabold text-white/95 bg-black/20 px-2 py-0.5 rounded-xl backdrop-blur-sm">
                                {classItem.course_code}
                              </span>
                              <span className="text-[10px] font-semibold text-white/85">
                                {classItem.start_time}
                              </span>
                            </div>

                            <h5 className="text-xs sm:text-sm font-extrabold text-white leading-tight mb-1 line-clamp-2 drop-shadow-sm">
                              {classItem.course_name}
                            </h5>
                          </div>

                          {spanRows > 2 && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] text-white/90 font-semibold">
                                <MapPin className="w-3 h-3 opacity-80" />
                                <span className="truncate">{classItem.room}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-white/85 font-medium">
                                <User className="w-3 h-3 opacity-80" />
                                <span className="truncate">{classItem.instructor}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Day View */}
      {viewMode === "day" && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
          {todayClasses.length === 0 ? (
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl p-10 text-center">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-extrabold text-gray-900">No classes scheduled</h3>
              <p className="text-gray-600 mt-1">Take a break or catch up on assignments!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayClasses.map((classItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl"
                >
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${classItem.color}`} />
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-sm font-extrabold text-gray-900 bg-white/80 border border-white/70 px-3 py-1 rounded-2xl">
                            {classItem.start_time} - {classItem.end_time}
                          </span>
                          <span className="text-[11px] font-extrabold text-gray-600 uppercase tracking-wider bg-white/60 border border-white/60 px-3 py-1 rounded-2xl">
                            {classItem.session_type}
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                          {classItem.course_name}
                        </h3>
                        <div className="text-sm text-gray-600 font-semibold">{classItem.course_code}</div>
                      </div>

                      <div className="flex flex-row sm:flex-col gap-3 sm:text-right sm:items-end">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">{classItem.room}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">{classItem.instructor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SchedulePage;
