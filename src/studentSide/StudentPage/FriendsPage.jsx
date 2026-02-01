import React, { useEffect, useState } from "react";
import { UserPlus, UserCheck, UserMinus, Search, Users, Shield, MessageSquare, Plus, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/index";
import Alert from "../../gobalConponent/Alert.jsx";

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

    useEffect(() => {
        loadPotentialFriends();
    }, []);

    const loadPotentialFriends = async (query = "") => {
        try {
            setSearching(!!query);
            setLoading(true);
            const res = await API.get(`/social/students/search?search=${query}`);
            const data = res.data?.data || [];
            if (query) {
                setSearchResults(data);
            } else {
                setFriends(data);
            }
        } catch (err) {
            console.error("Failed to load students", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadPotentialFriends(searchTerm);
    };

    const sendFriendRequest = async (studentId) => {
        try {
            await API.post("/social/friend-requests", { receiver_id: studentId });
            setAlert({ show: true, message: "Connection request sent successfully!", type: "success" });
            // Optionally refresh to show pending state if backend supported it
            loadPotentialFriends(searchTerm);
        } catch (err) {
            if (err.response?.status === 409) {
                setAlert({
                    show: true,
                    message: "A connection request is already pending or you are already connected with this student.",
                    type: "warning"
                });
            } else {
                setAlert({ show: true, message: err.response?.data?.message || "Failed to send request", type: "error" });
            }
        }
    };

    const removeConnection = async (connectionId) => {
        if (!window.confirm("Are you sure you want to remove this connection?")) return;
        try {
            await API.delete(`/social/friend-requests/${connectionId}`);
            setAlert({ show: true, message: "Connection removed.", type: "success" });
            loadPotentialFriends(searchTerm);
        } catch (err) {
            setAlert({ show: true, message: "Failed to remove connection", type: "error" });
        }
    };

    return (
        <div className="min-h-screen space-y-10 pb-20">
            <Alert
                isOpen={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            {/* Premium Header */}
            <section className="relative overflow-hidden rounded-[3rem] p-1 md:p-1.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative bg-white/90 backdrop-blur-3xl rounded-[2.8rem] p-8 md:p-12 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

                    <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-xs font-black uppercase tracking-widest shadow-sm"
                        >
                            <Users className="w-4 h-4" />
                            Global Campus Directory
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                            Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Every Student</span>
                        </h1>

                        <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                            Search for classmates, find study partners, and build your academic network with our intelligent directory.
                        </p>

                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group mt-8">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2">
                                <Search className="w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-100 rounded-3xl text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-xl text-lg font-medium"
                                placeholder="Student name or index code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm hover:shadow-xl hover:scale-105 active:scale-95 transition-all shadow-indigo-200"
                            >
                                SEARCH
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <main className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                {searching ? "Search Results" : "Featured Classmates"}
                            </h2>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                                {searching ? searchResults.length : friends.length} Active Records
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-28 bg-white/40 rounded-[2rem] border border-white/60 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(searching ? searchResults : friends).map((student, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={student.id}
                                    className="group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
                                            {student.profile_picture_url ? (
                                                <img src={student.profile_picture_url} alt="" className="w-full h-full object-cover rounded-3xl" />
                                            ) : (
                                                student.full_name_en?.charAt(0) || 'S'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-slate-900 text-lg truncate group-hover:text-indigo-600 transition-colors uppercase">
                                                {student.full_name_en}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">ID: {student.student_code}</span>
                                                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <div className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-tighter">
                                                    Peer
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {student.connection_status === 'accepted' ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                                        <UserCheck className="w-5 h-5" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Connected</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeConnection(student.connection_id)}
                                                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all border border-rose-100"
                                                        title="Remove Connection"
                                                    >
                                                        <UserMinus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : student.connection_status === 'pending' ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                                                        <Clock className="w-5 h-5" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeConnection(student.connection_id)}
                                                        className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border border-slate-100"
                                                        title="Cancel Request"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => sendFriendRequest(student.id)}
                                                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg transition-all active:scale-90 flex items-center justify-center"
                                                >
                                                    <Plus className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>

                <aside className="space-y-8">
                    {/* Dynamic Sidebar Card */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-blue-300 text-[10px] font-black uppercase tracking-widest transition-all">
                                <Shield className="w-4 h-4" />
                                Security Verified
                            </div>

                            <h2 className="text-3xl font-black leading-tight italic">
                                Private by <span className="text-indigo-400">Design</span>
                            </h2>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                Students can only communicate within their administrative Class Groups until a connection request is accepted.
                            </p>

                            <div className="space-y-4">
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4">
                                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Messaging</p>
                                        <p className="text-sm font-bold">End-to-End Encryption</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4">
                                    <Clock className="w-5 h-5 text-purple-400" />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Visibility</p>
                                        <p className="text-sm font-bold">Smart Status Tracking</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default FriendsPage;
