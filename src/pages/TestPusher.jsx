import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const TestPusher = () => {
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

      alert(`Payment: ${data.tran_id} -> ${data.status}`);
    });

    echo.connector.pusher.connection.bind("connected", () => {

    });

    echo.connector.pusher.connection.bind("error", (err) => {
      console.error("❌ Pusher connection error:", err);
    });

    return () => {
      channel.stopListening(".PaymentStatusUpdated");
      echo.disconnect();
    };
  }, []);

  return <div>Check console for Pusher events.</div>;
};

export default TestPusher;
