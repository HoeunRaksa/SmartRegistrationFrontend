import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function makeEcho() {
  const token = localStorage.getItem("token");

  const echo = new Echo({
    broadcaster: "reverb",
    key: "local",

    wsHost: "study.learner-teach.online",
    wsPort: 443,
    wssPort: 443,
    wsPath: "/ws",
    forceTLS: true,
    enabledTransports: ["wss"],
    disableStats: true,

    authEndpoint: "https://study.learner-teach.online/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  // ✅ Wait a tick so connector is fully built
  setTimeout(() => {
    const pusher = echo?.connector?.pusher;

    console.log("echo?", !!echo);
    console.log("connector?", !!echo?.connector);
    console.log("pusher?", !!pusher);

    // ✅ Snapshot (not live reference)
    const cfg = pusher?.config ? JSON.parse(JSON.stringify(pusher.config)) : null;
    console.log("PUSHER CONFIG SNAPSHOT:", cfg);

    // ✅ Show exactly what URL it will hit
    if (cfg) {
      const path = cfg.wsPath || "";
      console.log("WS URL SHOULD BE:",
        `wss://${cfg.wsHost}${path}/app/${cfg.key}?protocol=7&client=js&version=8.x&flash=false`
      );
    }
  }, 0);

  return echo;
}
