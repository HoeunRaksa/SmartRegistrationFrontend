import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance = null;

export function getEcho() {
  if (echoInstance) return echoInstance;

  const token = localStorage.getItem("token");

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: "local",

    wsHost: "study.learner-teach.online",
    wsPath: "/ws",
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

  return echoInstance;
}

// Backward compatibility
export function makeEcho() {
  return getEcho();
}
