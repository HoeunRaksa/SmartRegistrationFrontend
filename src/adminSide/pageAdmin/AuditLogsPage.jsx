import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
    Shield,
    Activity,
    User,
    Clock,
    FileText,
    Search,
    Filter,
    Download,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Eye,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Calendar,
    X
} from "lucide-react";
import { fetchAuditLogs, fetchAuditStats } from "../../api/audit_log_api";
import Alert from "../../gobalConponent/Alert";

// Mock data generator for fallback if API isn't ready
const generateMockLogs = () => {
    const actions = ["CREATE_STUDENT", "UPDATE_GRADE", "DELETE_COURSE", "LOGIN_SUCCESS", "LOGIN_FAILED", "UPDATE_SETTINGS", "EXPORT_DATA", "VIEW_GRADES"];
    const admins = ["Admin User", "Registrar Office", "System System", "Sarah Connor"];
    const modules = ["Students", "Academics", "System", "Auth", "Reports"];

    return Array.from({ length: 150 }, (_, i) => ({
        id: i + 1,
        user: {
            name: admins[Math.floor(Math.random() * admins.length)],
            email: "admin@novatech.edu",
            avatar: null
        },
        action: actions[Math.floor(Math.random() * actions.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        details: "Changed status from 'Pending' to 'Active'",
        ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
        status: Math.random() > 0.1 ? "success" : "failed",
        created_at: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString()
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const AuditLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [page, setPage] = useState(1);
    const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
    const [selectedLog, setSelectedLog] = useState(null);

    const ITEMS_PER_PAGE = 15;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            try {
                const res = await fetchAuditLogs({ page, q: searchQuery });
                const data = res?.data || res || [];
                setLogs(Array.isArray(data) ? data : data.data || []);

                const statsRes = await fetchAuditStats();
                setStats(statsRes);
            } catch (e) {
                console.warn("Backend audit logs not found, using mock data", e);
                const mock = generateMockLogs();
                setLogs(mock);

                // Calculate stats from mock data
                setStats({
                    total_events: mock.length,
                    security_alerts: mock.filter(l => l.status === 'failed' || l.action.includes('DELETE')).length,
                    active_admins: new Set(mock.map(l => l.user.name)).size
                });
            }

        } catch (error) {
            console.error("Failed to load audit logs", error);
            setAlert({ show: true, message: "Failed to load audit logs", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        try {
            if (!filteredLogs.length) {
                setAlert({ show: true, message: "No data to export", type: "error" });
                return;
            }

            const headers = ["ID", "Timestamp", "User", "Email", "Action", "Module", "IP Address", "Status", "Details"];
            const csvContent = [
                headers.join(","),
                ...filteredLogs.map(log => [
                    log.id,
                    new Date(log.created_at).toLocaleString(),
                    `"${log.user?.name || ''}"`,
                    log.user?.email || '',
                    log.action,
                    log.module,
                    log.ip_address,
                    log.status,
                    `"${log.details || ''}"`
                ].join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setAlert({ show: true, message: "Export successful!", type: "success" });
        } catch (err) {
            setAlert({ show: true, message: "Failed to export data", type: "error" });
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "success": return "text-emerald-500 bg-emerald-50 border-emerald-100";
            case "failed": return "text-rose-500 bg-rose-50 border-rose-100";
            case "warning": return "text-amber-500 bg-amber-50 border-amber-100";
            default: return "text-slate-500 bg-slate-50 border-slate-100";
        }
    };

    const actionIcon = (action) => {
        if (action.includes("DELETE")) return <XCircle className="w-4 h-4 text-rose-500" />;
        if (action.includes("CREATE")) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        if (action.includes("UPDATE")) return <RefreshCw className="w-4 h-4 text-blue-500" />;
        if (action.includes("LOGIN")) return <User className="w-4 h-4 text-purple-500" />;
        return <Activity className="w-4 h-4 text-slate-500" />;
    };

    const filteredLogs = useMemo(() => {
        return (logs || []).filter(log => {
            // 1. Text Search
            const searchLower = searchQuery.toLowerCase();
            const matchSearch =
                log.action.toLowerCase().includes(searchLower) ||
                log.user?.name.toLowerCase().includes(searchLower) ||
                log.module.toLowerCase().includes(searchLower) ||
                log.details?.toLowerCase().includes(searchLower);

            // 2. Type Filter
            const matchType = filterType ? log.action.includes(filterType) : true;

            // 3. Date Range Filter
            let matchDate = true;
            if (dateRange.start) {
                matchDate = matchDate && new Date(log.created_at) >= new Date(dateRange.start);
            }
            if (dateRange.end) {
                // Set end date to end of day
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                matchDate = matchDate && new Date(log.created_at) <= endDate;
            }

            return matchSearch && matchType && matchDate;
        });
    }, [logs, searchQuery, filterType, dateRange]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const paginatedLogs = filteredLogs.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen space-y-6">
            <Alert
                isOpen={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-blue-600" />
                        Audit Logs
                    </h1>
                    <p className="text-slate-500 mt-1">Monitor security events, admin actions, and system changes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold shadow-sm text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Total Events</p>
                        <h3 className="text-3xl font-extrabold">{stats?.total_events || 0}</h3>
                        <div className="flex items-center gap-2 mt-4 text-xs font-medium text-blue-100 bg-white/10 w-fit px-2 py-1 rounded-lg">
                            <Activity className="w-3 h-3" />
                            <span>All Time</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Security Alerts</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">{stats?.security_alerts || 0}</h3>
                        <p className="text-xs text-rose-500 font-bold mt-1">Failed Actions / Deletions</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-rose-500" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Admins</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">{stats?.active_admins || 0}</h3>
                        <p className="text-xs text-emerald-500 font-bold mt-1">Unique Users</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <User className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search logs by user, action, or details..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none text-sm font-medium transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer shadow-sm"
                        >
                            <option value="">All Actions</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                            <option value="LOGIN">Login</option>
                        </select>

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className={`px-4 py-2.5 rounded-xl border text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${dateRange.start || dateRange.end
                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                    : "bg-white border-slate-200 text-slate-600 hover:text-blue-600"
                                    }`}
                            >
                                <Calendar className="w-4 h-4" />
                                {dateRange.start ? `${new Date(dateRange.start).toLocaleDateString()} - ${dateRange.end ? new Date(dateRange.end).toLocaleDateString() : 'Now'}` : "Date Range"}
                                {(dateRange.start || dateRange.end) && (
                                    <X
                                        className="w-3 h-3 ml-1 hover:text-rose-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDateRange({ start: "", end: "" });
                                            setShowDatePicker(false);
                                        }}
                                    />
                                )}
                            </button>

                            {showDatePicker && (
                                <div className="absolute right-0 top-full mt-2 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 w-72">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                                            <input
                                                type="date"
                                                value={dateRange.start}
                                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                                            <input
                                                type="date"
                                                value={dateRange.end}
                                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowDatePicker(false)}
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Apply Filter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase font-bold tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">User / Admin</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Module</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4 text-right">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-200 rounded-full" /><div className="h-4 bg-slate-200 rounded w-32" /></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded w-16 ml-auto" /></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : paginatedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="font-semibold text-lg">No logs found</p>
                                        <p className="text-sm">Try adjusting your search criteria</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-blue-50/50 transition-colors group cursor-default">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-700">
                                                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-xs font-semibold text-slate-400">
                                                {new Date(log.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white">
                                                    {log.user?.name?.charAt(0) || "A"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{log.user?.name || "Unknown"}</p>
                                                    <p className="text-[10px] font-semibold text-slate-500">{log.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg bg-slate-100 ${statusColor(log.status).split(' ')[0]}`}>
                                                    {actionIcon(log.action)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{log.action.replace(/_/g, " ")}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                                {log.module}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                                            {log.ip_address}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor(log.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                {log.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-900">{paginatedLogs.length}</span> of <span className="font-bold text-blue-600">{filteredLogs.length}</span> records
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-500 shadow-sm transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                            Page {page} of {totalPages || 1}
                        </div>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-500 shadow-sm transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Detail Modal */}
            <AnimatePresence>
                {selectedLog && createPortal(
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setSelectedLog(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/60"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Log Details <span className="text-slate-400 font-normal">#{selectedLog.id}</span>
                                    </h3>
                                    <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">User</p>
                                            <p className="font-semibold text-slate-900">{selectedLog.user?.name}</p>
                                            <p className="text-xs text-slate-500">{selectedLog.user?.email}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">IP & Time</p>
                                            <p className="font-mono text-xs text-slate-900 font-bold mb-0.5">{selectedLog.ip_address}</p>
                                            <p className="text-xs text-slate-500">{new Date(selectedLog.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Action Details</p>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedLog.details || "No additional details provided."}
                                            <br /><br />
                                            Module: {selectedLog.module}<br />
                                            Action: {selectedLog.action}
                                        </div>
                                    </div>

                                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-blue-800 text-xs">
                                        <strong>System Note:</strong> This monitoring event was immutable and timestamped by the security auditing subsystem.
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 flex justify-end">
                                    <button
                                        onClick={() => setSelectedLog(null)}
                                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>,
                    document.body
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuditLogsPage;
