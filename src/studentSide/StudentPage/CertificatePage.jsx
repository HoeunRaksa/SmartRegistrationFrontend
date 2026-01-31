import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Send,
    Loader,
    Plus,
    ChevronRight,
    Info,
    Calendar,
    X
} from 'lucide-react';
import { fetchCertificateRequests, submitCertificateRequest } from '../../api/certificate_api';

const CertificatePage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'enrollment',
        remarks: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const response = await fetchCertificateRequests();
            setRequests(response.data?.data || []);
        } catch (error) {
            console.error('Failed to load certificate requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await submitCertificateRequest(formData);
            setMessage({ type: 'success', text: 'Certificate request submitted successfully!' });
            setShowModal(false);
            setFormData({ type: 'enrollment', remarks: '' });
            await loadRequests();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit request' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'from-orange-500 to-amber-500';
            case 'approved': return 'from-blue-500 to-indigo-500';
            case 'ready': return 'from-green-500 to-emerald-500';
            case 'rejected': return 'from-red-500 to-rose-500';
            default: return 'from-gray-500 to-slate-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return Clock;
            case 'approved': return Info;
            case 'ready': return CheckCircle;
            case 'rejected': return X;
            default: return AlertCircle;
        }
    };

    const certTypes = [
        { value: 'enrollment', label: 'Enrollment Certificate', description: 'Proof that you are currently enrolled in the university.' },
        { value: 'good_standing', label: 'Good Standing Certificate', description: 'Certifies that you have a satisfactory academic and disciplinary record.' },
        { value: 'completion', label: 'Course Completion', description: 'Proof of completed courses for the current semester.' },
        { value: 'transcript_official', label: 'Official Transcript', description: 'Official certified academic record of all grades and credits.' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader className="w-12 h-12 text-blue-600" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Certificate Requests
                    </h2>
                    <p className="text-gray-600 mt-1 font-medium">Request and track your academic documents</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </motion.button>
            </div>

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="font-medium">{message.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 ? (
                    <div className="text-center py-16 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                        <p className="text-xl font-semibold text-gray-600">No requests yet</p>
                        <p className="text-gray-500">Need an official document? Submit a new request above.</p>
                    </div>
                ) : (
                    requests.map((req, index) => {
                        const StatusIcon = getStatusIcon(req.status);
                        return (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${getStatusColor(req.status)} shadow-lg`}>
                                        <StatusIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 capitalize">{req.type.replace('_', ' ')}</h3>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Requested on {new Date(req.created_at).toLocaleDateString()}
                                        </p>
                                        {req.remarks && <p className="text-sm text-gray-500 mt-1 italic">"{req.remarks}"</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${getStatusColor(req.status)} text-white shadow-sm`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {req.status}
                                        </span>
                                        {req.processed_at && (
                                            <p className="text-[10px] text-gray-500 mt-1">Processed: {new Date(req.processed_at).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 hidden md:block" />
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {showModal && createPortal(
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg backdrop-blur-2xl bg-white/95 rounded-3xl p-8 border border-white/40 shadow-2xl overflow-hidden relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Plus className="w-6 h-6 text-blue-600" />
                                New Document Request
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Document Type</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {certTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.type === type.value
                                                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                                                    : 'border-white/40 bg-white/40 hover:bg-white/80'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="type"
                                                    value={type.value}
                                                    checked={formData.type === type.value}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                />
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.type === type.value ? 'border-blue-500' : 'border-gray-300'
                                                    }`}>
                                                    {formData.type === type.value && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{type.label}</p>
                                                    <p className="text-xs text-gray-600 mt-0.5">{type.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Additional Remarks (Optional)</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium transition-all"
                                        placeholder="E.g. Purpose of request, delivery preference..."
                                        value={formData.remarks}
                                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default CertificatePage;
