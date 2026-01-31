import React, { useEffect, useState } from "react";
import { Users, Plus, UserPlus, Grid, List as ListIcon, RefreshCw, Trash2, CheckCircle, Settings, Users2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/index";
import { fetchCourses } from "../../api/course_api.jsx";
import { getCachedCourses } from "../../utils/dataCache";
import FormModal from "../../Components/FormModal";
import Alert from "../../gobalConponent/Alert.jsx";

const ProjectGroupsPage = () => {
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAutoAssign, setShowAutoAssign] = useState(false);
    const [membersPerGroup, setMembersPerGroup] = useState(5);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

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
            setAlert({ show: true, message: "Groups auto-assigned successfully!", type: "success" });
        } catch (err) {
            setAlert({ show: true, message: err.response?.data?.message || "Failed to auto-assign", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen space-y-6">
            <Alert
                isOpen={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            {/* Header & Controls */}
            <div className="bg-white rounded-3xl p-6 border border-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        Project Groups
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage project teams and auto-assignment for your courses.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
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

            {/* Auto Assign Modal (Portalled) */}
            <FormModal
                isOpen={showAutoAssign}
                onClose={() => setShowAutoAssign(false)}
                title="Smart Auto-Assignment"
            >
                <div className="bg-white p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
                            <Users2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Assign Teams</h3>
                            <p className="text-sm text-gray-500">Create balanced project teams automatically.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                            <label className="block text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Max Members Per Group
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="2"
                                    max="15"
                                    value={membersPerGroup}
                                    onChange={(e) => setMembersPerGroup(e.target.value)}
                                    className="flex-1 accent-indigo-600"
                                />
                                <span className="w-12 h-12 flex items-center justify-center bg-white border-2 border-indigo-200 rounded-xl font-black text-indigo-600 shadow-sm">
                                    {membersPerGroup}
                                </span>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
                            <RefreshCw className="w-5 h-5 text-amber-600 shrink-0" />
                            <p className="text-sm text-amber-800">
                                This will randomly distribute students who are currently without a group. Existing groups will not be affected.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setShowAutoAssign(false)}
                            className="flex-1 py-4 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-all font-sans"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAutoAssign}
                            className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Generate Groups
                        </button>
                    </div>
                </div>
            </FormModal>

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
                <div className="bg-white rounded-3xl p-20 border border-gray-200 shadow-sm flex flex-col items-center text-center gap-4">
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
