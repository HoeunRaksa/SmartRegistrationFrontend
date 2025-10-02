// Toast.jsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const toastStyle = {
  background: "rgba(255, 255, 255, 0.3)",
  color: "#000",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "0.5px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
  borderRadius: "8px",
};
const showSuccess = (message, customClass = "") => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: `glass ${customClass}`,
    style: toastStyle,
  });
};
const showError = (message, customClass = "") => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    className: `glass ${customClass}`,
    style: toastStyle,
  });
};

const showInfo = (message, customClass = "") => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    className: `glass ${customClass}`,
    style: toastStyle,
  });
};

const showWarning = (message, customClass = "") => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
    className: `glass ${customClass}`,
    style: toastStyle,
  });
};
export { showSuccess, showError, showInfo, showWarning, ToastContainer };
