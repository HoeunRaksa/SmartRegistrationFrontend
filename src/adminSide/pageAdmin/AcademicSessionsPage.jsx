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
    Loader,
    AlertCircle
} from "lucide-react";
import Alert from "../../gobalConponent/Alert.jsx";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";
import FormModal from "../../Components/FormModal.jsx";
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

    // Dynamic UI State
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
    const [confirm, setConfirm] = useState({ show: false, id: null, title: "", message: "", onConfirm: null });

    const showAlert = (message, type = "success") => {
        setAlert({ show: true, message, type });
        if (type === "success") setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 5000);
    };

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
            // API returns { data: [...] }; extractData may return array or { data }
            const list = Array.isArray(res) ? res : (res?.data ?? []);
            setSessions(list);
        } catch (error) {
            console.error("Failed to load sessions:", error);
            setSessions([]);
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
            showAlert("Failed to save session. Check inputs.", "error");
        }
    };

    const handleDelete = (id) => {
        setConfirm({
            show: true,
            id,
            title: "Delete Session",
            message: "Are you sure? This will not delete created class sessions, only this record.",
            onConfirm: () => executeDelete(id)
        });
    };

    const executeDelete = async (id) => {
        const previous = sessions;
        setSessions(prev => prev.filter(s => Number(s.id) !== Number(id)));
        try {
            await deleteAcademicSession(id);
            showAlert("Session deleted successfully", "success");
        } catch (error) {
            setSessions(previous);
            showAlert("Failed to delete session.", "error");
        }
    };

    const handleGenerate = (session) => {
        setConfirm({
            show: true,
            id: session.id,
            title: "Generate Schedules",
            message: `Generate class schedules for ${session.name}? This may take a moment.`,
            onConfirm: () => executeGenerate(session)
        });
    };

    const executeGenerate = async (session) => {
        try {
            setProcessingId(session.id);
            const res = await generateSessionSchedules(session.id);
            const msg = res?.message ?? "Done.";
            const count = res?.count ?? 0;
            showAlert(`${msg} Created ${count} sessions.`, "success");
        } catch (error) {
            showAlert("Failed to generate schedules. Ensure courses exist for this Year/Semester.", "error");
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
            semester: String(item.semester || ""),
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
        <div className="min-h-screen space-y-6">
            <Alert
                isOpen={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />

            <ConfirmDialog
                isOpen={confirm.show}
                title={confirm.title}
                message={confirm.message}
                onConfirm={confirm.onConfirm}
                onCancel={() => setConfirm({ show: false, id: null, title: "", message: "", onConfirm: null })}
                confirmText="Continue"
                type={confirm.title.includes("Delete") ? "danger" : "info"}
            />
            <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Academic Sessions</h1>
                        <p className="text-slate-500">Manage terms and generate class schedules automatically.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadSessions}
                            className="p-2 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white/80 transition-all shadow-sm"
                        >
                            <Loader className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={openNew}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                        >
                            <Plus size={18} />
                            New Session
                        </button>
                    </div>
                </div>

                {/* Search & List */}
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm glass"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-white/30">
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
                                                {item.start_date?.split('T')[0]?.replace(/-/g, '/')} — {item.end_date?.split('T')[0]?.replace(/-/g, '/')}
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
                <FormModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingItem ? "Edit Session" : "New Session"}
                >
                    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/40 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-600 text-white">
                                    <Plus size={18} />
                                </div>
                                <h3 className="font-bold text-xl text-slate-900">{editingItem ? "Edit Session" : "New Session"}</h3>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Session Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Fall 2024"
                                        className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                <div className="md:col-span-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-[11px] text-amber-800 font-bold uppercase flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Important Notice
                                    </p>
                                    <p className="text-[10px] text-amber-700 mt-1">
                                        To generate schedules, ensure the <b>Academic Year</b> and <b>Semester</b> match the courses you want to include in this session.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Start Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.start_date}
                                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">End Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.end_date}
                                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Academic Year</label>
                                    <select
                                        required
                                        value={formData.academic_year}
                                        onChange={e => setFormData({ ...formData, academic_year: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 outline-none transition-all shadow-sm"
                                    >
                                        <option value="">Select Year...</option>
                                        {Array.from({ length: 11 }, (_, i) => {
                                            const startYear = new Date().getFullYear() - 5 + i;
                                            const yearLabel = `${startYear}-${startYear + 1}`;
                                            return <option key={yearLabel} value={yearLabel}>{yearLabel}</option>;
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Semester</label>
                                    <select
                                        required
                                        value={formData.semester}
                                        onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 outline-none transition-all shadow-sm"
                                    >
                                        <option value="">Select...</option>
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                        <option value="3">Summer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg rounded-xl font-bold shadow-md transition-all"
                                >
                                    Save Session
                                </button>
                            </div>
                        </form>
                    </div>
                </FormModal>
            </div>
        </div>
    );
};

export default AcademicSessionsPage;
