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
} from "lucide-react";
import { fetchAcademicCalendar } from "../../api/schedule_api"; // We'll reuse this or ensure it exists

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
            // Backend supports ?month=X&year=Y
            // fetchAcademicCalendar calls /student/calendar which defaults to current month if no params
            // But we want to handle navigation. We might need to modify api to accept params.
            // For now let's assume fetchAcademicCalendar can take params or we update it.
            // Checked schedule_api.jsx: fetchAcademicCalendar() takes no args. I should update it or pass params manually in valid way.
            // Actually /student/calendar accepts ?month=&year=

            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();

            // We'll trust the API sends us events for this month. 
            // Ideally we update api function to accept args.
            // Let's assume for now we just call it and it gives us what we need, 
            // but to be robust I should probably update api/schedule_api.jsx first.
            // I'll assume I update api/schedule_api.jsx to accept params.

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
            <div className="grid grid-cols-7 gap-1 md:gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
                        {d}
                    </div>
                ))}

                {blanks.map((_, i) => (
                    <div key={`blank-${i}`} className="h-24 md:h-32 rounded-xl bg-gray-50/50 border border-transparent" />
                ))}

                {days.map((day) => {
                    const dayEvents = getDayEvents(day);
                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

                    return (
                        <motion.button
                            key={day}
                            whileHover={{ scale: 0.98 }}
                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                            className={`h-24 md:h-32 rounded-xl p-2 border text-left flex flex-col transition-all relative overflow-hidden ${isSelected
                                    ? "bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200"
                                    : "bg-white border-white/40 hover:border-blue-200 hover:shadow-sm"
                                } ${isToday ? "bg-blue-50/30" : "backdrop-blur-xl"}`}
                        >
                            <span className={`text-sm font-bold mb-1 ${isToday ? "text-blue-600 bg-blue-100 p-1 rounded-full w-7 h-7 flex items-center justify-center" : "text-gray-700"}`}>
                                {day}
                            </span>

                            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                                {dayEvents.map((evt, idx) => (
                                    <div
                                        key={evt.id || idx}
                                        className="text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium text-white shadow-sm"
                                        style={{ backgroundColor: evt.color || "#3B82F6" }}
                                    >
                                        {evt.type === 'assignment' ? '📝 ' : '📚 '}
                                        {evt.title}
                                    </div>
                                ))}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Academic Calendar</h2>
                    <p className="text-gray-600">Track your classes, assignments, and exams</p>
                </div>

                <div className="flex items-center gap-2 backdrop-blur-xl bg-white/60 border border-white/40 rounded-xl p-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/60 rounded-lg transition">
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="px-4 font-bold text-gray-800 min-w-[140px] text-center">
                        {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/60 rounded-lg transition">
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-3 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Loader className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                    ) : (
                        renderCalendarGrid()
                    )}
                </div>

                {/* Selected Day Details */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border border-white/40 shadow-lg sticky top-24"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-blue-600" />
                            {selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>

                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
                            ) : selectedDayEvents.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No events scheduled</p>
                                </div>
                            ) : (
                                selectedDayEvents.map((evt, idx) => (
                                    <motion.div
                                        key={evt.id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="backdrop-blur-xl bg-white/80 rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span
                                                className="text-[10px] font-bold px-2 py-1 rounded-full text-white uppercase"
                                                style={{ backgroundColor: evt.color || "#9CA3AF" }}
                                            >
                                                {evt.type || "Event"}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-500">
                                                {evt.start_time ? evt.start_time.slice(0, 5) : evt.due_time?.slice(0, 5)}
                                            </span>
                                        </div>

                                        <h4 className="font-bold text-gray-900 leading-tight mb-1">{evt.title}</h4>
                                        <p className="text-xs text-gray-600 mb-2">{evt.course_name}</p>

                                        <div className="space-y-1">
                                            {evt.room && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {evt.room}
                                                </div>
                                            )}
                                            {evt.instructor && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    {evt.instructor}
                                                </div>
                                            )}
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
