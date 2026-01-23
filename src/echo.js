import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance = null;

export function makeEcho() {
  if (echoInstance) return echoInstance;

  const token = localStorage.getItem("token");

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY || "local",

    wsHost: "study.learner-teach.online",
    wsPath: "/ws",            // IMPORTANT
    wsPort: 443,
    wssPort: 443,
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

  // global connection logs (bind ONCE)
  const pusher = echoInstance.connector.pusher;
  pusher.connection.bind("state_change", (s) => console.log("🔁 WS state", s));
  pusher.connection.bind("connected", () => console.log("✅ WS CONNECTED"));
  pusher.connection.bind("error", (e) => console.log("❌ WS ERROR", e));
  pusher.connection.bind("disconnected", () => console.log("⚠️ WS DISCONNECTED"));

  return echoInstance;
}

export function destroyEcho() {
  if (!echoInstance) return;
  echoInstance.disconnect();
  echoInstance = null;
}
