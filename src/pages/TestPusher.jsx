import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle2, CreditCard } from "lucide-react";

const TestPusher = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Pusher.logToConsole = true;
    window.Pusher = Pusher;

    const echo = new Echo({
      broadcaster: "pusher",
      key: "d5dbf9e0355b62fddcdd",
      cluster: "ap1",
      forceTLS: true,
    });

    const channel = echo.channel("payments");
    channel.listen(".PaymentStatusUpdated", (data) => {
      // ✅ Now using custom UI notification
      setNotification({
        id: data.tran_id,
        status: data.status,
        message: `Payment ${data.tran_id} has been updated to ${data.status}`
      });

      // ✅ Play iOS-style sound (iOS 26 Style)
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
      audio.play().catch(e => console.log("Sound play error:", e));
    });

    echo.connector.pusher.connection.bind("connected", () => {
      console.log("✅ Pusher connected");
    });

    echo.connector.pusher.connection.bind("error", (err) => {
      console.error("❌ Pusher connection error:", err);
    });

    return () => {
      channel.stopListening(".PaymentStatusUpdated");
      echo.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pusher Real-time Test</h1>
        <p className="text-gray-600">Waiting for payment updates...</p>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden"
          >
            <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">Payment Updated</h3>
                  <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${notification.status.toLowerCase() === 'completed' || notification.status.toLowerCase() === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    {notification.status}
                  </span>
                </div>

                <button
                  onClick={() => setNotification(null)}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!notification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-gray-400"
        >
          <div className="relative">
            <Bell className="w-12 h-12 animate-pulse" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-50" />
          </div>
          <p className="text-sm font-medium italic">Listening on payments channel...</p>
        </motion.div>
      )}
    </div>
  );
};

export default TestPusher;
