// Toast.jsx - Standardized Glassmorphic Notifications
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastStyle = {
  background: "rgba(255, 255, 255, 0.7)",
  color: "#1f2937",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "2px solid rgba(255, 255, 255, 0.6)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  borderRadius: "16px",
  padding: "16px",
  fontWeight: "600",
  fontSize: "14px",
};

const options = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progressStyle: {
    background: "linear-gradient(to right, #2563eb, #7c3aed)",
  }
};

const showSuccess = (message) => {
  toast.success(message, { ...options, style: { ...toastStyle, borderLeft: "6px solid #10b981" } });
};

const showError = (message) => {
  toast.error(message, { ...options, style: { ...toastStyle, borderLeft: "6px solid #ef4444" } });
};

const showInfo = (message) => {
  toast.info(message, { ...options, style: { ...toastStyle, borderLeft: "6px solid #3b82f6" } });
};

const showWarning = (message) => {
  toast.warning(message, { ...options, style: { ...toastStyle, borderLeft: "6px solid #f59e0b" } });
};

export { showSuccess, showError, showInfo, showWarning, ToastContainer };
