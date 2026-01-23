import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function makeEcho() {
  const token = localStorage.getItem("token");
  const host = "study.learner-teach.online";

  return new Echo({
    broadcaster: "reverb",
    key: "local",

    // ✅ IMPORTANT
    wsHost: host,
    wsPath: "/ws",
    wssPort: 443,
    wsPort: 443,
    forceTLS: true,

    // ✅ allow both so it can try ws in dev and wss in prod
    enabledTransports: ["wss", "ws"],
    disableStats: true,

    // ✅ must be full https URL
    authEndpoint: `https://${host}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });
}
