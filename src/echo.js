import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function makeEcho() {
  const token = localStorage.getItem("token"); // your auth token
  const host = "study.learner-teach.online";

  return new Echo({
    broadcaster: "reverb",
    key: "local",

    wsHost: host,
    wsPath: "/ws",
    wssPort: 443,
    wsPort: 443,
    forceTLS: true,
    enabledTransports: ["wss"],

    authEndpoint: `https://${host}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });
}
