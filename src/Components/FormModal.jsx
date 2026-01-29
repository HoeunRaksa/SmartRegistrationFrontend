import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * FormModal - A reusable modal wrapper using React Portals.
 * 
 * @param {boolean} isOpen - Whether the modal is visible.
 * @param {function} onClose - Function to call when closing the modal.
 * @param {React.ReactNode} children - The form or content to render inside.
 * @param {string} title - Optional title for the modal.
 * @param {string} maxWidth - Tailwind max-width class (default: 'max-w-2xl').
 */
const FormModal = ({ isOpen, onClose, children, title, maxWidth = "max-w-2xl" }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[9999] overflow-y-auto px-4 py-8 flex items-start justify-center pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`relative w-full ${maxWidth} pointer-events-auto`}
                        >
                            {/* Optional Close Button (Top-Right) */}
                            <button
                                onClick={onClose}
                                className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content Wrapper */}
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default FormModal;
