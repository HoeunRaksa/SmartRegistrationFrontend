import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function makeEcho() {
  const token = localStorage.getItem("token");

  return new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY || "local",

    // ✅ IMPORTANT: use host+port+scheme
    wsHost: "study.learner-teach.online",
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ["ws", "wss"],

    // ✅ MUST be POST and must hit Laravel API
    authEndpoint: "https://study.learner-teach.online/broadcasting/auth",

    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });
}
