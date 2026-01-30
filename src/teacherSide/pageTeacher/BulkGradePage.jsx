import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, GraduationCap, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import API from '../../api/index';

const BulkGradePage = () => {
    const [file, setFile] = useState(null);
    const [courseId, setCourseId] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [totalPoints, setTotalPoints] = useState('');
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await API.get('/teacher/bulk/grades/template', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bulk_grades_template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download template');
        }
    };

    const handleUpload = async () => {
        if (!file || !courseId || !assignmentName || !totalPoints) {
            alert('Please fill in all fields and select a file');
            return;
        }

        try {
            setUploading(true);
            setResult(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('course_id', courseId);
            formData.append('assignment_name', assignmentName);
            formData.append('total_points', totalPoints);

            const response = await API.post('/teacher/bulk/grades', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult({
                success: true,
                message: response.data.message,
                count: response.data.success_count,
                details: response.data.details || []
            });

            setFile(null);
        } catch (error) {
            setResult({
                success: false,
                message: error.response?.data?.message || 'Upload failed',
                errors: error.response?.data?.errors || []
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Bulk Grade Import</h2>
                            <p className="text-sm text-gray-600">Upload grades for entire class</p>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadTemplate}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Download Template
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course ID *
                        </label>
                        <input
                            type="text"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            placeholder="Enter course ID"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Name *
                        </label>
                        <input
                            type="text"
                            value={assignmentName}
                            onChange={(e) => setAssignmentName(e.target.value)}
                            placeholder="e.g., Midterm Exam"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Points *
                    </label>
                    <input
                        type="number"
                        value={totalPoints}
                        onChange={(e) => setTotalPoints(e.target.value)}
                        placeholder="e.g., 100"
                        min="0"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
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
