import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance = null;
let echoToken = null;

export function getEcho() {
  const token = localStorage.getItem("token");

  // If we have an instance but the token has changed (or become null), destroy old instance
  if (echoInstance && echoToken !== token) {
    echoInstance.disconnect();
    echoInstance = null;
    echoToken = null;
  }

  if (echoInstance) return echoInstance;

  if (!token) return null; // Don't create instance without token

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

  echoToken = token;
  return echoInstance;
}

export function resetEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
    echoToken = null;
  }
}

// Backward compatibility
export function makeEcho() {
  return getEcho();
}
