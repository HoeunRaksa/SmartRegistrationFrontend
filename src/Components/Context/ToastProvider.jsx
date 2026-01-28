import React, { createContext, useCallback, useMemo, useState } from "react";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = crypto.randomUUID?.() || String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, type, message }]);

    // auto close
    setTimeout(() => remove(id), 3000);
  }, [remove]);

  const api = useMemo(() => ({
    success: (msg) => push("success", msg),
    error: (msg) => push("error", msg),
    info: (msg) => push("info", msg),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* UI */}
      <div className="fixed top-5 right-5 z-[9999] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-[360px] rounded-2xl border border-white/30 px-4 py-3 shadow-2xl transition-all duration-300 ${t.type === "success" ? "toast-success" :
                t.type === "error" ? "toast-error" :
                  "toast-info"
              }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  {t.type === "success" && "✅ Success"}
                  {t.type === "error" && "❌ Error"}
                  {t.type === "info" && "ℹ️ Info"}
                </div>
                <div className="mt-1 text-sm font-normal text-white/90 break-words">
                  {t.message}
                </div>
              </div>

              <button
                onClick={() => remove(t.id)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
