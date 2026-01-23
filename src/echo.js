import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function makeEcho() {
  const token = localStorage.getItem("token");

  const echo = new Echo({
    broadcaster: "reverb",

    // ✅ FORCE KEY (stop relying on VITE env until it works)
    key: "local",

    wsHost: "study.learner-teach.online",
    wsPath: "/ws",
    wssPort: 443,
    wsPort: 443,
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

  // ✅ DEBUG: confirm key is not undefined
  const p = echo?.connector?.pusher;
  console.log("PUSHER KEY =", p?.key);
  console.log("PUSHER OPTIONS =", p?.config);

  return echo;
}
