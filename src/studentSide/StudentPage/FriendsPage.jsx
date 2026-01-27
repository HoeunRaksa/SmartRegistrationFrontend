import React, { useEffect, useState } from "react";
import { UserPlus, UserCheck, Search, Users, Shield, MessageSquare, Plus, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/index";

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        loadPotentialFriends();
    }, []);

    const loadPotentialFriends = async (query = "") => {
        try {
            setSearching(!!query);
            setLoading(true);
            const res = await API.get(`/social/students/search?search=${query}`);
            if (query) {
                setSearchResults(res.data?.data || []);
            } else {
                setFriends(res.data?.data || []);
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
            alert("Friend request sent!");
            // Optionally refresh to show status
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send request");
        }
    };

    return (
        <div className="min-h-screen space-y-8 pb-20">
            {/* Search Section */}
            <section className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 shadow-2xl">
                <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center justify-center gap-3">
                        <Users className="w-10 h-10 text-indigo-600" />
                        Social Network
                    </h1>
                    <p className="text-gray-600 text-lg">Connect with classmates and friends to enable private messaging and group visibility.</p>
                </div>

                <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                        placeholder="Search by name or student code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-2 right-2 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                    >
                        Find
                    </button>
                </form>
            </section>

            {/* Results or Friend List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Search Results / Suggestions */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <UserPlus className="w-6 h-6 text-indigo-500" />
                            {searching ? "Search Results" : "Classmates"}
                        </h2>
                        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest">
                            {searching ? searchResults.length : friends.length} Found
                        </span>
                    </div>

                    <div className="space-y-4">
                        {(searching ? searchResults : friends).map((student, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={student.id}
                                className="bg-white/80 hover:bg-white rounded-3xl p-5 border border-white shadow-sm hover:shadow-xl transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner group-hover:scale-110 transition-transform">
                                        <span className="text-xl font-bold">{student.full_name_en?.charAt(0) || 'S'}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{student.full_name_en}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-medium text-gray-400">ID: {student.student_code}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="text-xs font-bold text-indigo-500 uppercase">Class Peer</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => sendFriendRequest(student.id)}
                                        className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
                                        title="Add Friend"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {(searching ? searchResults : friends).length === 0 && (
                            <div className="text-center py-12 bg-white/40 border border-dashed border-gray-200 rounded-3xl">
                                <p className="text-gray-400 italic">No classmates found. Try searching for someone specific.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Security / Info Sidebar */}
                <section className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold">Privacy by Default</h2>
                                <p className="text-indigo-100 mt-2 text-lg">Your profile and activity are only visible to students in your same administrative <span className="text-white font-bold underline decoration-indigo-300 underline-offset-4">Class Group</span>.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="bg-black/10 p-4 rounded-3xl border border-white/10">
                                    <p className="text-2xl font-bold">100%</p>
                                    <p className="text-xs text-indigo-200 uppercase font-bold tracking-widest mt-1">Encrypted</p>
                                </div>
                                <div className="bg-black/10 p-4 rounded-3xl border border-white/10">
                                    <p className="text-2xl font-bold">Limit</p>
                                    <p className="text-xs text-indigo-200 uppercase font-bold tracking-widest mt-1">Class Only</p>
                                </div>
                            </div>
                            <p className="text-sm text-indigo-200 pt-2 italic">To chat with students outside your class group, you must first send and have them accept a friend request.</p>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/40 shadow-xl space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Social Features</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0"><MessageSquare className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Private Messaging</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Secure one-on-one chat with approved friends.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0"><Clock className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Status Updates</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">See when your friends are online and active.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FriendsPage;
