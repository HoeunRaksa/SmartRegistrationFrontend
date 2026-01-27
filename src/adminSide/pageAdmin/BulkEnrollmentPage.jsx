import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Users, AlertCircle, CheckCircle, X, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';

const BulkEnrollmentPage = () => {
    const [file, setFile] = useState(null);
    const [courseId, setCourseId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
                setFile(selectedFile);
                setResult(null);
            } else {
                alert('Please select a CSV or Excel file');
            }
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get('/api/admin/bulk/enrollment/template', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bulk_enrollment_template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download template');
        }
    };

    const handleUpload = async () => {
        if (!file || !courseId) {
            alert('Please select a file and enter course ID');
            return;
        }

        try {
            setUploading(true);
            setResult(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('course_id', courseId);

            const response = await axios.post('/api/admin/bulk/enrollment', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult({
                success: true,
                message: response.data.message,
                count: response.data.success_count,
                details: response.data.details || []
            });

            setFile(null);
            setCourseId('');
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
            <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Bulk Enrollment</h2>
                            <p className="text-sm text-gray-600">Upload CSV/Excel to enroll multiple students</p>
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

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course ID
                        </label>
                        <input
                            type="text"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            placeholder="Enter course ID"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload File
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                className="hidden"
                                id="bulk-file-upload"
                            />
                            <label
                                htmlFor="bulk-file-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-all bg-white/40"
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
                        disabled={uploading || !file || !courseId}
                        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all ${uploading || !file || !courseId
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg'
                            }`}
                    >
                        <Upload className="w-5 h-5" />
                        {uploading ? 'Uploading...' : 'Upload & Enroll'}
                    </button>
                </div>

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
                                        Successfully enrolled {result.count} student{result.count !== 1 ? 's' : ''}
                                    </p>
                                )}
                                {result.errors && result.errors.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {result.errors.slice(0, 5).map((error, i) => (
                                            <p key={i} className="text-sm text-red-700">• {error}</p>
                                        ))}
                                        {result.errors.length > 5 && (
                                            <p className="text-sm text-red-600">... and {result.errors.length - 5} more errors</p>
                                        )}
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

export default BulkEnrollmentPage;
