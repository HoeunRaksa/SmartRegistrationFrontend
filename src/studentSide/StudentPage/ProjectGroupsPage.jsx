import React, { useEffect, useState } from "react";
import { Users, Plus, UserPlus, Grid, List as ListIcon, RefreshCw, Trash2, CheckCircle, Settings, Users2, X, LogOut, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/index";
import FormModal from "../../Components/FormModal";
import Alert from "../../gobalConponent/Alert.jsx";

const ProjectGroupsPage = () => {
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [maxCapacity, setMaxCapacity] = useState(5);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setCurrentUser(user);
        loadEnrolledCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadGroups(selectedCourse);
        } else {
            setGroups([]);
        }
    }, [selectedCourse]);

    const loadEnrolledCourses = async () => {
        try {
            const res = await API.get("/student/courses/enrolled");
            const data = res.data?.data || [];
            setCourses(data);
            if (data.length > 0) setSelectedCourse(data[0].id || data[0].course_id);
        } catch (err) {
            console.error("Failed to load courses", err);
        }
    };

    const loadGroups = async (courseId) => {
        try {
            setLoading(true);
            const res = await API.get(`/project-groups?course_id=${courseId}`);
            setGroups(res.data?.data || []);
        } catch (err) {
            console.error("Failed to load groups", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!selectedCourse || !newGroupName) return;
        try {
            setLoading(true);
            await API.post("/project-groups", {
                course_id: selectedCourse,
                name: newGroupName,
                max_capacity: maxCapacity
            });
            loadGroups(selectedCourse);
            setShowCreateModal(false);
            setNewGroupName("");
            setAlert({ show: true, message: "Group created successfully!", type: "success" });
        } catch (err) {
            setAlert({ show: true, message: err.response?.data?.message || "Failed to create group", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            setLoading(true);
            await API.post(`/project-groups/${groupId}/join`);
            loadGroups(selectedCourse);
            setAlert({ show: true, message: "Joined group successfully!", type: "success" });
        } catch (err) {
            setAlert({ show: true, message: err.response?.data?.message || "Failed to join", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveGroup = async (groupId) => {
        try {
            setLoading(true);
            await API.post(`/project-groups/${groupId}/leave`);
            loadGroups(selectedCourse);
            setAlert({ show: true, message: "Left group successfully!", type: "success" });
        } catch (err) {
            setAlert({ show: true, message: err.response?.data?.message || "Failed to leave", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            setLoading(true);
            await API.delete(`/project-groups/${groupId}`);
            loadGroups(selectedCourse);
            setAlert({ show: true, message: "Group deleted successfully!", type: "success" });
        } catch (err) {
            setAlert({ show: true, message: err.response?.data?.message || "Failed to delete", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const isMember = (group) => {
        return group.students?.some(s => s.id === currentUser?.student_id || s.id === currentUser?.id);
    };

    const isCreator = (group) => {
        return group.creator_id === currentUser?.id;
    };

    return (
        <div className="space-y-6">
            <Alert
                isOpen={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            {/* Header & Controls */}
            <div className="backdrop-blur-xl bg-white/60 rounded-[2.5rem] p-8 border border-white/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Users2 className="w-8 h-8 text-blue-600" />
                        Project Teams
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Collaborate with classmates on course projects.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-2xl border border-white/40 shadow-inner">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="bg-white/80 border border-white/40 rounded-2xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm"
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => (
                            <option key={c.id || c.course_id} value={c.id || c.course_id}>{c.course_name || c.name || c.display_name}</option>
                        ))}
                    </select>

                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg hover:shadow-indigo-200 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create Team
                    </motion.button>
                </div>
            </div>

            {/* Create Group Modal */}
            <FormModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Team"
            >
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Team Name</label>
                            <input
                                type="text"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="E.g. The Innovators"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Max Members: {maxCapacity}</label>
                            <input
                                type="range"
                                min="2"
                                max="10"
                                value={maxCapacity}
                                onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateGroup}
                            disabled={!newGroupName || loading}
                            className="flex-[2] py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Team"}
                        </button>
                    </div>
                </div>
            </FormModal>

            {/* Groups View */}
            {loading && !groups.length ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-gray-500 font-bold italic">Finding teams...</p>
                </div>
            ) : groups.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {groups.map((group, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={group.id}
                            className={`backdrop-blur-xl bg-white/60 rounded-[2rem] p-6 border border-white/40 shadow-lg hover:shadow-2xl transition-all ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
                        >
                            <div className={viewMode === 'list' ? 'flex items-center gap-6' : ''}>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg mb-4">
                                    {group.name.charAt(0)}
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                        {group.name}
                                        {isCreator(group) && (
                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Leader</span>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1 min-w-[100px]">
                                            <div
                                                className="h-full bg-indigo-500 transition-all duration-500"
                                                style={{ width: `${(group.students?.length / group.max_capacity) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">
                                            {group.students?.length} / {group.max_capacity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? "space-y-4" : "flex items-center gap-4"}>
                                <div className="flex -space-x-3 overflow-hidden">
                                    {group.students?.map((student, sidx) => (
                                        <div
                                            key={student.id}
                                            title={student.name || student.student_code}
                                            className="w-10 h-10 rounded-full bg-white border-2 border-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 shadow-sm"
                                        >
                                            {student.name?.charAt(0) || student.student_code?.slice(-2)}
                                        </div>
                                    ))}
                                    {Array.from({ length: Math.max(0, group.max_capacity - group.students?.length) }).map((_, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                    {isMember(group) ? (
                                        <button
                                            onClick={() => handleLeaveGroup(group.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Leave Team
                                        </button>
                                    ) : (
                                        <button
                                            disabled={group.students?.length >= group.max_capacity}
                                            onClick={() => handleJoinGroup(group.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs hover:bg-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            {group.students?.length >= group.max_capacity ? "Full" : "Join Team"}
                                        </button>
                                    )}

                                    {isCreator(group) && (
                                        <button
                                            onClick={() => handleDeleteGroup(group.id)}
                                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all"
                                            title="Delete Team"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="backdrop-blur-xl bg-white/60 rounded-[3rem] p-20 border border-white/40 shadow-sm flex flex-col items-center text-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center shadow-inner">
                        <Users2 className="w-12 h-12 text-indigo-300" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">No Teams Yet</h3>
                        <p className="text-gray-500 max-w-sm mt-2 font-medium">Be the first to start a team for this course! Click the button above to create one.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200"
                    >
                        Start a Team
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default ProjectGroupsPage;
