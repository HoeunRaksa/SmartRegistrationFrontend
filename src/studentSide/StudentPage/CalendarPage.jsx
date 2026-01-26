import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    BookOpen,
    AlertCircle,
    Loader,
    CheckCircle2
} from "lucide-react";
import { fetchAcademicCalendar } from "../../api/schedule_api";

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCalendarEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const loadCalendarEvents = async () => {
        try {
            setLoading(true);
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();

            const response = await fetchAcademicCalendar(month, year);
            const data = response?.data?.data || [];
            setEvents(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Failed to load calendar:", err);
            setError("Failed to load calendar events.");
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDayEvents = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return events.filter((e) => e.date === dateStr);
    };

    const renderCalendarGrid = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate); // 0 = Sunday
        const blanks = Array(startDay).fill(null);
        const days = Array.from({ length: totalDays }, (_, i) => i + 1);

        return (
            <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2">
                        {d}
                    </div>
                ))}

                {blanks.map((_, i) => (
                    <div key={`blank-${i}`} className="min-h-[100px] rounded-2xl bg-gray-50/30 border border-transparent" />
                ))}

                {days.map((day) => {
                    const dayEvents = getDayEvents(day);
                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

                    return (
                        <motion.button
                            key={day}
                            whileHover={{ scale: 0.98, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                            className={`min-h-[100px] rounded-2xl p-2 border text-left flex flex-col transition-all relative overflow-hidden group ${isSelected
                                ? "bg-blue-50/80 border-blue-500 shadow-lg ring-2 ring-blue-200"
                                : "backdrop-blur-md bg-white/60 border-white/50 hover:border-blue-300 hover:shadow-md hover:bg-white/80"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isToday
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-300"
                                        : isSelected ? "text-blue-700 bg-blue-100" : "text-gray-700 group-hover:text-blue-600"
                                    }`}>
                                    {day}
                                </span>
                                {dayEvents.length > 0 && (
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium border border-gray-200">
                                        {dayEvents.length}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 space-y-1 w-full">
                                {dayEvents.slice(0, 3).map((evt, idx) => (
                                    <div
                                        key={evt.id || idx}
                                        className="text-[10px] px-2 py-1 rounded-lg truncate font-medium text-white shadow-sm flex items-center gap-1"
                                        style={{
                                            background: evt.type === 'exam'
                                                ? 'linear-gradient(135deg, #EF4444, #B91C1C)'
                                                : evt.type === 'assignment'
                                                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                                                    : 'linear-gradient(135deg, #3B82F6, #2563EB)'
                                        }}
                                    >
                                        <div className="w-1 h-1 rounded-full bg-white/50" />
                                        {evt.title}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-[10px] text-center text-gray-500 font-medium">
                                        +{dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        );
    };

    const selectedDayEvents = events.filter((e) => {
        const d = new Date(e.date);
        return (
            d.getDate() === selectedDate.getDate() &&
            d.getMonth() === selectedDate.getMonth() &&
            d.getFullYear() === selectedDate.getFullYear()
        );
    });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-6"
            >
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-blue-600" />
                        Academic Calendar
                    </h2>
                    <p className="text-gray-600 mt-1 font-medium">
                        Schedule for {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                </div>

                <div className="flex items-center gap-3 backdrop-blur-xl bg-white/60 border border-white/50 shadow-lg rounded-2xl p-1.5">
                    <button
                        onClick={prevMonth}
                        className="p-2.5 hover:bg-white rounded-xl transition-all hover:shadow-md text-gray-600 hover:text-blue-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-6 py-1 font-bold text-gray-800 min-w-[160px] text-center text-lg">
                        {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </div>
                    <button
                        onClick={nextMonth}
                        className="p-2.5 hover:bg-white rounded-xl transition-all hover:shadow-md text-gray-600 hover:text-blue-600"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Calendar Grid */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-3 bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl"
                >
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[500px] text-blue-600">
                            <Loader className="w-12 h-12 animate-spin mb-3" />
                            <p className="font-semibold animate-pulse">Loading schedule...</p>
                        </div>
                    ) : (
                        renderCalendarGrid()
                    )}
                </motion.div>

                {/* Selected Day Details */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="backdrop-blur-xl bg-gradient-to-b from-white/80 to-white/40 rounded-3xl p-6 border border-white/60 shadow-xl sticky top-24"
                    >
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Selected Date</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {selectedDate.getDate()}
                                </h3>
                                <p className="text-sm font-medium text-gray-500">
                                    {selectedDate.toLocaleDateString("en-US", { month: 'long', weekday: 'long' })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar">
                            {loading ? (
                                <p className="text-sm text-gray-500 text-center py-8">Updating...</p>
                            ) : selectedDayEvents.length === 0 ? (
                                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                        <CalendarIcon className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="font-semibold text-gray-600">No events</p>
                                    <p className="text-xs text-gray-400 mt-1">Free day! Relax or catch up on studies.</p>
                                </div>
                            ) : (
                                selectedDayEvents.map((evt, idx) => (
                                    <motion.div
                                        key={evt.id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="group relative bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200"
                                    >
                                        <div
                                            className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
                                            style={{
                                                backgroundColor: evt.type === 'exam' ? '#EF4444' : evt.type === 'assignment' ? '#F59E0B' : '#3B82F6'
                                            }}
                                        />

                                        <div className="pl-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${evt.type === 'exam'
                                                            ? 'bg-red-50 text-red-600'
                                                            : evt.type === 'assignment'
                                                                ? 'bg-amber-50 text-amber-600'
                                                                : 'bg-blue-50 text-blue-600'
                                                        }`}
                                                >
                                                    {evt.type || "Class"}
                                                </span>
                                                <span className="text-xs font-bold text-gray-700 font-mono">
                                                    {evt.start_time ? evt.start_time.slice(0, 5) : evt.due_time?.slice(0, 5)}
                                                </span>
                                            </div>

                                            <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">
                                                {evt.title}
                                            </h4>

                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span className="truncate">{evt.course_name}</span>
                                            </div>

                                            <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                                                {evt.room && (
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                        {evt.room}
                                                    </div>
                                                )}
                                                {evt.instructor && (
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                                                        {evt.instructor}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
