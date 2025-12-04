// src/Context/ToastProvider.jsx
import React, { createContext, useState } from "react";
import { CheckCircle } from "lucide-react";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showSuccess = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type: "success" }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showSuccess }}>
      {children}
      <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-lg text-white ${t.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            <CheckCircle size={20} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
