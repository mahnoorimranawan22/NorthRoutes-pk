import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
process.env.PORT = process.env.PORT || "5000";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://north-routes:Z5WwzEw39dBSj6gQ@cluster0.211z2le.mongodb.net/northroutes-pk?retryWrites=true&w=majority&appName=Cluster0";
process.env.JWT_SECRET = process.env.JWT_SECRET || "nr-pk-secret-2026-production";
process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
await import("./server.js");
