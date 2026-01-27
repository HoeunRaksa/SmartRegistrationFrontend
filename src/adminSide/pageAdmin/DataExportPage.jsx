import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Users, GraduationCap, Calendar, DollarSign, Loader } from 'lucide-react';
import axios from 'axios';

const DataExportPage = () => {
    const [exporting, setExporting] = useState({});

    const handleExport = async (type, params = {}) => {
        try {
            setExporting(prev => ({ ...prev, [type]: true }));

            let endpoint = '';
            let filename = '';

            switch (type) {
                case 'students':
                    endpoint = '/api/admin/export/students';
                    filename = `students_${new Date().toISOString().split('T')[0]}.xlsx`;
                    break;
                case 'payments':
                    endpoint = `/api/admin/export/payments?semester=${params.semester || 1}`;
                    filename = `payments_sem${params.semester || 1}_${new Date().toISOString().split('T')[0]}.csv`;
                    break;
                case 'grades':
                    endpoint = `/api/teacher/export/grades/${params.courseId}`;
                    filename = `grades_course${params.courseId}_${new Date().toISOString().split('T')[0]}.xlsx`;
                    break;
                case 'attendance':
                    endpoint = `/api/teacher/export/attendance/${params.courseId}`;
                    filename = `attendance_course${params.courseId}_${new Date().toISOString().split('T')[0]}.csv`;
                    break;
                default:
                    return;
            }

            const response = await axios.get(endpoint, {
                responseType: 'blob',
                params: type === 'students' ? params : undefined
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExporting(prev => ({ ...prev, [type]: false }));
        }
    };

    const exportOptions = [
        {
            key: 'students',
            icon: Users,
            title: 'Export Students',
            description: 'Download complete student list with filters',
            color: 'from-blue-500 to-cyan-500',
            role: 'admin'
        },
        {
            key: 'payments',
            icon: DollarSign,
            title: 'Export Payment Report',
            description: 'Download financial report by semester',
            color: 'from-green-500 to-emerald-500',
            role: 'admin'
        },
        {
            key: 'grades',
            icon: GraduationCap,
            title: 'Export Grades',
            description: 'Download grade report for a course',
            color: 'from-purple-500 to-pink-500',
            role: 'teacher',
            needsCourseId: true
        },
        {
            key: 'attendance',
            icon: Calendar,
            title: 'Export Attendance',
            description: 'Download attendance summary for a course',
            color: 'from-orange-500 to-red-500',
            role: 'teacher',
            needsCourseId: true
        },
    ];

    const [courseIdInput, setCourseIdInput] = useState('');
    const [semesterInput, setSemesterInput] = useState('1');

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                        <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Data Export</h2>
                        <p className="text-sm text-gray-600">Download reports in Excel/CSV format</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exportOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isLoading = exporting[option.key];

                        return (
                            <motion.div
                                key={option.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/60 transition-all"
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${option.color} mb-4`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{option.description}</p>

                                {option.needsCourseId && (
                                    <input
                                        type="text"
                                        value={courseIdInput}
                                        onChange={(e) => setCourseIdInput(e.target.value)}
                                        placeholder="Enter Course ID"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-3 text-sm"
                                    />
                                )}

                                {option.key === 'payments' && (
                                    <select
                                        value={semesterInput}
                                        onChange={(e) => setSemesterInput(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-3 text-sm"
                                    >
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                    </select>
                                )}

                                <button
                                    onClick={() => handleExport(option.key, {
                                        courseId: courseIdInput,
                                        semester: semesterInput
                                    })}
                                    disabled={isLoading || (option.needsCourseId && !courseIdInput)}
                                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${isLoading || (option.needsCourseId && !courseIdInput)
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : `bg-gradient-to-r ${option.color} hover:shadow-lg`
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Export
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DataExportPage;
