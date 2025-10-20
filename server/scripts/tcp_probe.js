// server/scripts/tcp-probe.js
// Purpose: check if the host running this code can reach your mail server (IONOS) on ports 465 and 587.

import net from "net";
import dns from "dns/promises";

const host = process.env.SMTP_HOST || "smtp.ionos.com";
const ports = [465, 587];

(async () => {
  try {
    const addrs = await dns.resolve(host);
    console.log(`[TCP PROBE] DNS ${host} resolved to:`, addrs);
  } catch (e) {
    console.log("[TCP PROBE] DNS lookup failed:", e.message);
  }

  for (const port of ports) {
    await new Promise((resolve) => {
      const start = Date.now();
      const socket = new net.Socket();
      socket.setTimeout(8000);

      socket
        .connect(port, host, () => {
          console.log(`[TCP PROBE] ✅ CONNECT OK ${host}:${port} (${Date.now() - start}ms)`);
          socket.destroy();
          resolve();
        })
        .on("error", (err) => {
          console.log(`[TCP PROBE] ❌ CONNECT FAIL ${host}:${port} -> ${err.code || err.message}`);
          resolve();
        })
        .on("timeout", () => {
          console.log(`[TCP PROBE] ⏱️ CONNECT TIMEOUT ${host}:${port}`);
          socket.destroy();
          resolve();
        });
    });
  }
})();
