import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance = null;

export function makeEcho(userId1, userId2) {
  if (echoInstance) return echoInstance;

  const token = localStorage.getItem("token");

  // Ensure we calculate the private channel name the same way as your backend
  const a = Math.min(userId1, userId2);
  const b = Math.max(userId1, userId2);
  const channelName = `private-chat.${a}.${b}`;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY || "local",
    wsHost: import.meta.env.VITE_REVERB_HOST || "study.learner-teach.online",
    wsPath: import.meta.env.VITE_REVERB_PATH || "/ws",
    wsPort: import.meta.env.VITE_REVERB_PORT || 443,
    wssPort: import.meta.env.VITE_REVERB_PORT || 443,
    forceTLS: true,
    enabledTransports: ["wss"],

    authEndpoint: "https://study.learner-teach.online/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  // Debug connections
  const pusher = echoInstance.connector.pusher;
  pusher.connection.bind("state_change", (s) => console.log("🔁 WS state:", s));
  pusher.connection.bind("connected", () => console.log("✅ WS CONNECTED"));
  pusher.connection.bind("error", (e) => console.log("❌ WS ERROR", e));
  pusher.connection.bind("disconnected", () => console.log("⚠️ WS DISCONNECTED"));

  // Listen to the private chat channel
  echoInstance.private(channelName).listen("message.sent", (event) => {
    console.log("📨 New Message:", event);
  });

  return echoInstance;
}

export function destroyEcho() {
  if (!echoInstance) return;
  echoInstance.disconnect();
  echoInstance = null;
}
