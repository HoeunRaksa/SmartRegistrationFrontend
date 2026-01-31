import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info, Loader2 } from "lucide-react";

const Alert = ({ isOpen, type = "success", message, onClose, duration = 5000 }) => {
    React.useEffect(() => {
        if (isOpen && message) {
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
            audio.play().catch(e => console.log("Sound play error:", e));

            if (duration && onClose) {
                const timer = setTimeout(onClose, duration);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, message, duration, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-24 right-6 z-[999999] w-80 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${type === "success"
                            ? "bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-500/10"
                            : type === "error"
                                ? "bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-500/10"
                                : type === "loading"
                                    ? "bg-blue-50/95 border-blue-200 text-blue-800 shadow-blue-500/10"
                                    : "bg-amber-50/95 border-amber-200 text-amber-800 shadow-amber-500/10"
                            }`}
                    >
                        <div className={`mt-0.5 p-2 rounded-xl ${type === "success" ? "bg-emerald-100" : type === "error" ? "bg-rose-100" : "bg-blue-100"}`}>
                            {type === "success" ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : type === "error" ? (
                                <AlertCircle className="w-5 h-5 text-rose-600" />
                            ) : type === "loading" ? (
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            ) : (
                                <Info className="w-5 h-5 text-amber-600" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold tracking-tight mb-0.5">
                                {type === "success" ? "Success" : type === "error" ? "Error" : type === "loading" ? "Processing" : "Notice"}
                            </p>
                            <p className="text-xs opacity-90 leading-relaxed font-semibold break-words">{message}</p>
                        </div>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className={`p-1.5 rounded-lg hover:bg-black/5 transition-all outline-none focus:ring-2 focus:ring-black/5 ${type === "success" ? "text-emerald-600" : type === "error" ? "text-rose-600" : "text-blue-600"
                                    }`}
                                type="button"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Alert;
