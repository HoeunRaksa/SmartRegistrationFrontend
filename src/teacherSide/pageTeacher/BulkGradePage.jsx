import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, GraduationCap, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import API from '../../api/index';

const BulkGradePage = () => {
    const [courses, setCourses] = React.useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    React.useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoadingCourses(true);
            const res = await fetchTeacherCourses();
            const list = res?.data?.data ?? (Array.isArray(res?.data) ? res.data : []);
            setCourses(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
        }
    };

    // ... rest of functions ...
    // (I'll keep handleDownloadTemplate and handleUpload as they are, but I need to make sure they use the state)

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Bulk Grade Import</h2>
                            <p className="text-sm text-gray-500">Fast import for entire class from Excel/CSV</p>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadTemplate}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-indigo-100 text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download CSV Template
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">
                            Select Subject / Course *
                        </label>
                        <div className="relative">
                            <select
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                disabled={loadingCourses}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-bold text-gray-700 shadow-sm transition-all"
                            >
                                <option value="">{loadingCourses ? "Loading..." : "Choose which course to grade"}</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-[10px] text-gray-500 ml-1 italic italic">Which class are these grades for?</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">
                            Assignment Type / Name *
                        </label>
                        <input
                            type="text"
                            value={assignmentName}
                            onChange={(e) => setAssignmentName(e.target.value)}
                            placeholder="e.g., Midterm Exam, Final Project"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-bold text-gray-700 shadow-sm transition-all"
                        />
                        <p className="text-[10px] text-gray-500 ml-1 italic italic">The title that will appear on student's record</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">
                            Total Points Possible *
                        </label>
                        <input
                            type="number"
                            value={totalPoints}
                            onChange={(e) => setTotalPoints(e.target.value)}
                            placeholder="e.g., 100 or 50"
                            min="0"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-bold text-gray-700 shadow-sm transition-all"
                        />
                        <p className="text-[10px] text-gray-500 ml-1 italic italic">Maximum achievable score for this task</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">
                            File Upload *
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                className="hidden"
                                id="grade-file-upload"
                            />
                            <label
                                htmlFor="grade-file-upload"
                                className="flex items-center gap-3 w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/30 transition-all bg-gray-50/50 shadow-sm"
                            >
                                <FileSpreadsheet className="w-5 h-5 text-purple-500" />
                                <span className={`text-sm font-bold ${file ? 'text-gray-800' : 'text-gray-500'}`}>
                                    {file ? file.name : 'Select CSV/Excel file...'}
                                </span>
                            </label>
                        </div>
                        <p className="text-[10px] text-gray-500 ml-1 italic italic">Ensure student IDs in file are correct</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File *
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="grade-file-upload"
                        />
                        <label
                            htmlFor="grade-file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 transition-all bg-gray-50/50"
                        >
                            <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                {file ? file.name : 'Click to upload CSV or Excel'}
                            </p>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={uploading || !file || !courseId || !assignmentName || !totalPoints}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all ${uploading || !file || !courseId || !assignmentName || !totalPoints
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg'
                        }`}
                >
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Upload Grades'}
                </button>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-xl border ${result.success
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                                {result.success ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                    {result.message}
                                </p>
                                {result.count > 0 && (
                                    <p className="text-sm text-green-700 mt-1">
                                        Imported {result.count} grade{result.count !== 1 ? 's' : ''}
                                    </p>
                                )}
                                {result.errors && result.errors.length > 0 && (
                                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                                        {result.errors.map((error, i) => (
                                            <p key={i} className="text-sm text-red-700">• {error}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BulkGradePage;
