import React, { useEffect, useState } from "react";
import { Users, Plus, UserPlus, Grid, List as ListIcon, RefreshCw, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/index";
import { fetchCourses } from "../../api/course_api.jsx";
import { getCachedCourses } from "../../utils/dataCache";

const ProjectGroupsPage = () => {
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAutoAssign, setShowAutoAssign] = useState(false);
    const [membersPerGroup, setMembersPerGroup] = useState(5);
    const [viewMode, setViewMode] = useState("grid"); // grid or list

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadGroups(selectedCourse);
        } else {
            setGroups([]);
        }
    }, [selectedCourse]);

    const loadCourses = async () => {
        try {
            const res = await getCachedCourses(fetchCourses);
            const data = res.data?.data || res.data || [];
            setCourses(Array.isArray(data) ? data : []);
            if (data.length > 0) setSelectedCourse(data[0].id);
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

    const handleAutoAssign = async () => {
        if (!selectedCourse) return;
        try {
            setLoading(true);
            await API.post("/project-groups/auto-assign", {
                course_id: selectedCourse,
                members_per_group: membersPerGroup
            });
            loadGroups(selectedCourse);
            setShowAutoAssign(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to auto-assign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen space-y-6">
            {/* Header & Controls */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        Project Groups
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage project teams and auto-assignment for your courses.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm"
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.course_name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowAutoAssign(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all outline-none"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Auto Assign
                    </button>
                </div>
            </div>

            {/* Auto Assign Modal (Sub-form) */}
            <AnimatePresence>
                {showAutoAssign && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-indigo-50/50 backdrop-blur-sm border border-indigo-100 rounded-3xl p-6 shadow-sm"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-indigo-900">Smart Auto-Assignment</h3>
                                <p className="text-sm text-indigo-700">Set the maximum members per group. Students not already in a group will be randomly assigned.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={membersPerGroup}
                                    onChange={(e) => setMembersPerGroup(e.target.value)}
                                    className="w-20 bg-white border border-indigo-200 rounded-xl px-4 py-2 text-center font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    min="2"
                                    max="20"
                                />
                                <button
                                    onClick={handleAutoAssign}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                                >
                                    Generate Groups
                                </button>
                                <button
                                    onClick={() => setShowAutoAssign(false)}
                                    className="text-gray-500 font-medium hover:text-gray-700 px-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Groups Grid/List */}
            {loading && !groups.length ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-gray-500 font-medium italic">Assembling teams...</p>
                </div>
            ) : groups.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                    {groups.map((group, idx) => (
                        <motion.div
                            layout
                            key={group.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
                        >
                            <div className={viewMode === 'list' ? 'flex items-center gap-6' : ''}>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{group.name}</h3>
                                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{group.students?.length} / {group.max_capacity} Members</p>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? "mt-4 space-y-2" : "flex items-center gap-4"}>
                                <div className={viewMode === 'grid' ? "flex flex-wrap gap-1.5" : "flex -space-x-2 overflow-hidden"}>
                                    {group.students?.map((student, sidx) => (
                                        viewMode === 'grid' ? (
                                            <span key={student.id} className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2 py-1 rounded-lg border border-gray-100">
                                                {student.student_code}
                                            </span>
                                        ) : (
                                            <div key={student.id} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                {student.student_code.slice(-2)}
                                            </div>
                                        )
                                    ))}
                                    {group.students?.length === 0 && (
                                        <p className="text-xs text-gray-400 italic">No students assigned yet</p>
                                    )}
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? 'mt-4 flex justify-end' : ''}>
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-20 border border-white/40 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <UserPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">No Groups Found</h3>
                        <p className="text-gray-500 max-w-sm mt-1">Select a course and use "Auto Assign" to automatically create project groups for your students.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectGroupsPage;
