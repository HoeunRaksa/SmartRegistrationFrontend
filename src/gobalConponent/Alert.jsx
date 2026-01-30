import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

const Alert = ({ type = "success", message, onClose, duration = 5000 }) => {
    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${type === "success"
                    ? "bg-green-50/90 border-green-200 text-green-800"
                    : type === "error"
                        ? "bg-red-50/90 border-red-200 text-red-800"
                        : "bg-blue-50/90 border-blue-200 text-blue-800"
                }`}
        >
            <div className="mt-0.5">
                {type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : type === "error" ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                    <Info className="w-5 h-5 text-blue-600" />
                )}
            </div>

            <div className="flex-1">
                <p className="text-sm font-semibold">{type === "success" ? "Success" : type === "error" ? "Error" : "Note"}</p>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed font-medium">{message}</p>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className={`p-1 rounded-lg hover:bg-black/5 transition-colors ${type === "success" ? "text-green-600" : type === "error" ? "text-red-600" : "text-blue-600"
                        }`}
                    type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
};

export default Alert;
