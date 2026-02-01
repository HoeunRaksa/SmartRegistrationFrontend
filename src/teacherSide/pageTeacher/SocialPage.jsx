import React, { useEffect, useState } from "react";
import { UserPlus, UserCheck, Search, Users, Shield, MessageSquare, Plus, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/index";
import Alert from "../../gobalConponent/Alert.jsx";

const SocialPage = () => {
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
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadPotentialFriends(searchTerm);
    };

    const sendFriendRequest = async (userId) => {
        try {
            await API.post("/social/friend-requests", { receiver_id: userId });
            setAlert({ show: true, message: "Connection request sent successfully!", type: "success" });
            loadPotentialFriends(searchTerm);
        } catch (err) {
            if (err.response?.status === 409) {
                setAlert({
                    show: true,
                    message: "A connection request is already pending or you are already connected.",
                    type: "warning"
                });
            } else {
                setAlert({ show: true, message: err.response?.data?.message || "Failed to send request", type: "error" });
            }
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
            <section className="relative overflow-hidden rounded-[3rem] p-1 md:p-1.5 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative bg-white/90 backdrop-blur-3xl rounded-[2.8rem] p-8 md:p-12 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

                    <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100/50 text-blue-600 text-xs font-black uppercase tracking-widest shadow-sm"
                        >
                            <Users className="w-4 h-4" />
                            Global Campus Directory
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Professional Network</span>
                        </h1>

                        <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                            Connect with students and faculty members across all departments to foster academic collaboration.
                        </p>

                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group mt-8">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2">
                                <Search className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-100 rounded-3xl text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-xl text-lg font-medium"
                                placeholder="Search by name, code or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm hover:shadow-xl hover:scale-105 active:scale-95 transition-all shadow-blue-200"
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
                                {searching ? "Search Results" : "Suggested Connections"}
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
                            {(searching ? searchResults : friends).map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.id}
                                    className="group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100 group-hover:rotate-6 transition-transform overflow-hidden">
                                            {item.profile_picture_url ? (
                                                <img src={item.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                item.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors uppercase">
                                                {item.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                {item.student_code && <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">ID: {item.student_code}</span>}
                                                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <div className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter">
                                                    {item.role || 'Member'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.connection_status === 'accepted' ? (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                                    <UserCheck className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Connected</span>
                                                </div>
                                            ) : item.connection_status === 'pending' ? (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                                                    <Clock className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => sendFriendRequest(item.id)}
                                                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg transition-all active:scale-90 flex items-center justify-center"
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
                    {(!loading && (searching ? searchResults : friends).length === 0) && (
                        <div className="text-center py-20 bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No records found</p>
                        </div>
                    )}
                </main>

                <aside className="space-y-8">
                    {/* Dynamic Sidebar Card */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-blue-300 text-[10px] font-black uppercase tracking-widest transition-all">
                                <Shield className="w-4 h-4" />
                                Administrative Faculty
                            </div>

                            <h2 className="text-3xl font-black leading-tight italic">
                                Teacher <span className="text-blue-400">Networking</span>
                            </h2>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                Connect with students and other faculty members to enable direct messaging and academic coordination features.
                            </p>

                            <div className="space-y-4">
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4">
                                    <MessageSquare className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Messaging</p>
                                        <p className="text-sm font-bold">Priority Communication</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Coordination</p>
                                        <p className="text-sm font-bold">Real-time Syncing</p>
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

export default SocialPage;
