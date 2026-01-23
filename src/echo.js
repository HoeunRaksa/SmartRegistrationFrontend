// src/echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function makeEcho() {
  const token = localStorage.getItem("token");

  return new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY || "local",

    wsHost: "study.learner-teach.online",

    // ✅ THIS is the missing piece
    wsPath: "/ws",

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
}
