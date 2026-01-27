import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Plus,
    Trash2,
    Edit2,
    Search,
    X,
    Play,
    CheckCircle,
    Loader
} from "lucide-react";
import {
    fetchAcademicSessions,
    createAcademicSession,
    updateAcademicSession,
    deleteAcademicSession,
    generateSessionSchedules
} from "../../api/admin_session_api";

const AcademicSessionsPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        start_date: "",
        end_date: "",
        academic_year: "",
        semester: "",
    });

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const res = await fetchAcademicSessions();
            setSessions(res?.data || []);
        } catch (error) {
            console.error("Failed to load sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateAcademicSession(editingItem.id, formData);
            } else {
                await createAcademicSession(formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ name: "", start_date: "", end_date: "", academic_year: "", semester: "" });
            loadSessions();
        } catch (error) {
            alert("Failed to save session. Check inputs.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will not delete created class sessions, only this record.")) return;
        try {
            await deleteAcademicSession(id);
            loadSessions();
        } catch (error) {
            alert("Failed to delete session.");
        }
    };

    const handleGenerate = async (session) => {
        if (!window.confirm(`Generate class schedules for ${session.name}? This may take a moment.`)) return;

        try {
            setProcessingId(session.id);
            const res = await generateSessionSchedules(session.id);
            alert(`${res.message} Created ${res.count} sessions.`);
        } catch (error) {
            alert("Failed to generate schedules. Ensure courses exist for this Year/Semester.");
        } finally {
            setProcessingId(null);
        }
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            start_date: item.start_date,
            end_date: item.end_date,
            academic_year: item.academic_year,
            semester: item.semester,
        });
        setShowModal(true);
    };

    const openNew = () => {
        setEditingItem(null);
        setFormData({ name: "", start_date: "", end_date: "", academic_year: "", semester: "" });
        setShowModal(true);
    };

    const filtered = sessions.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.academic_year.includes(searchQuery)
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Academic Sessions</h1>
                    <p className="text-slate-500">Manage terms and generate class schedules automatically.</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                >
                    <Plus size={18} />
                    New Session
                </button>
            </div>

            {/* Search & List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search sessions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 font-bold">Session Name</th>
                                <th className="px-6 py-4 font-bold">Duration</th>
                                <th className="px-6 py-4 font-bold">Academic Year</th>
                                <th className="px-6 py-4 font-bold">Semester</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No sessions found.</td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(item.start_date).toLocaleDateString()} — {new Date(item.end_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100">
                                                {item.academic_year}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold border border-purple-100">
                                                Sem {item.semester}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleGenerate(item)}
                                                    disabled={processingId === item.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors border border-emerald-200 disabled:opacity-50"
                                                    title="Generate Schedules"
                                                >
                                                    {processingId === item.id ? <Loader className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                                                    Generate
                                                </button>
                                                <button onClick={() => openEdit(item)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-lg text-slate-900">{editingItem ? "Edit Session" : "New Session"}</h3>
                                <button onClick={() => setShowModal(false)}><X className="text-slate-400 hover:text-slate-600 w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Session Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Fall 2024"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.start_date}
                                            onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.end_date}
                                            onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Academic Year</label>
                                        <input
                                            required
                                            value={formData.academic_year}
                                            onChange={e => setFormData({ ...formData, academic_year: e.target.value })}
                                            placeholder="e.g. 2024-2025"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Semester</label>
                                        <select
                                            required
                                            value={formData.semester}
                                            onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Select...</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Summer</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold shadow-sm transition-all">Save Session</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AcademicSessionsPage;
