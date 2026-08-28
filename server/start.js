// Local development startup with DNS fix for MongoDB Atlas SRV
// On Render/cloud, use "node server.js" directly (env vars set in dashboard)
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
await import("./server.js");
