import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Download,
    Filter,
    Search,
    ChevronRight,
    DollarSign,
    Wallet,
    Calendar,
    Receipt
} from 'lucide-react';
import { fetchStudentPayments } from '../../api/payment_api';

const PaymentPage = () => {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState({
        totalPaid: 0,
        outstanding: 0,
        lastPayment: null
    });

    useEffect(() => {
        const loadPayments = async () => {
            try {
                setLoading(true);
                const response = await fetchStudentPayments();

                // Expecting { data: { data: [...] } } or { data: [...] }
                const rawData = response?.data?.data || response?.data || [];
                const paymentData = Array.isArray(rawData) ? rawData : [];

                setPayments(paymentData);

                // Calculate stats based on real data
                // Statuses from backend are likely uppercase, let's normalize
                const paid = paymentData
                    .filter(p => ['PAID', 'COMPLETED', 'SUCCESS'].includes(String(p.status || p.payment_status || '').toUpperCase()))
                    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

                const pending = paymentData
                    .filter(p => ['PENDING', 'UNPAID'].includes(String(p.status || p.payment_status || '').toUpperCase()))
                    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

                const last = paymentData.length > 0 ? paymentData[0] : null;

                setStats({
                    totalPaid: paid,
                    outstanding: pending,
                    lastPayment: last
                });
            } catch (error) {
                console.error("Failed to fetch real payments:", error);
                // Fallback to empty if real call fails
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <CheckCircle2 className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'failed': return <AlertCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="p-8 rounded-full bg-white/50 backdrop-blur-xl border border-white shadow-2xl animate-pulse">
                    <CreditCard className="w-12 h-12 text-blue-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header section with Stats */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Total Paid */}
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Investment</p>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tight">${stats.totalPaid.toLocaleString()}</h3>
                            <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Fully Verified
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>

                {/* Outstanding */}
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Outstanding</p>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tight">${stats.outstanding.toLocaleString()}</h3>
                            <p className="text-amber-500 text-xs font-bold mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Payment Due soon
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>

                {/* Next/Last Payment */}
                <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl group overflow-hidden relative text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Recent Activity</p>
                            <h3 className="text-xl font-black tracking-tight mb-1">
                                {stats.lastPayment ? stats.lastPayment.description : 'No Activity'}
                            </h3>
                            <p className="text-white/50 text-xs font-medium">
                                {stats.lastPayment ? new Date(stats.lastPayment.date).toLocaleDateString() : '---'}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/10 text-blue-400 border border-white/10">
                            <Receipt className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* History Table/List */}
            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden"
            >
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Payment Ledger</h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Chronological transaction history</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search ledger..."
                                className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-xs font-bold text-slate-700 w-64 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-slate-500 hover:text-blue-600 hover:shadow-md transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">
                            <Download className="w-4 h-4" />
                            EXPORT PDF
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((payment) => {
                                const status = String(payment.status || payment.payment_status || 'pending').toLowerCase();
                                const amount = Number(payment.amount || payment.payment_amount || 0);
                                const method = payment.method || payment.payment_method || '---';
                                const description = payment.description || payment.remark || 'Payment Transaction';
                                const date = payment.date || payment.created_at || payment.payment_date || new Date().toISOString();
                                const txnId = payment.id || payment.tran_id || payment.transaction_id || '0';

                                return (
                                    <motion.tr
                                        key={txnId}
                                        whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }}
                                        className="group"
                                    >
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-slate-400">#TXN-{String(txnId).padStart(5, '0')}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-white shadow-sm">
                                                    <Receipt className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">{description}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-base font-black text-slate-800">${amount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                <span className="text-xs font-bold text-slate-600">{method}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${getStatusColor(status)}`}>
                                                {getStatusIcon(status)}
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-4 h-4 opacity-40" />
                                                <span className="text-xs font-medium">{new Date(date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 shadow-sm transition-all">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {payments.length} Transactions</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-slate-400 font-bold text-xs disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">Next</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentPage;
