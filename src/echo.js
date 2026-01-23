import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function makeEcho() {
  const token = localStorage.getItem("token");

  const echo = new Echo({
    broadcaster: "reverb",
    key: "local",

    // ✅ MUST match your nginx location ^~ /ws/
    wsHost: "study.learner-teach.online",
    wsPort: 443,
    wssPort: 443,
    wsPath: "/ws",              // ✅ THIS is the key fix
    forceTLS: true,
    enabledTransports: ["wss"],

    // ✅ auth to Laravel
    authEndpoint: "https://study.learner-teach.online/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },

    // optional but helps reduce noise
    disableStats: true,
  });

  // ✅ HARD PROOF what path it will use
  console.log("PUSHER CONFIG:", echo.connector.pusher.config);

  return echo;
}
