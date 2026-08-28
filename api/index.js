import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";

// Fix DNS for MongoDB Atlas SRV on local/dev environments
try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch {}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "https://mahnoorimranawan22.github.io",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (cached across warm invocations)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (err) {
    console.error("MongoDB error:", err.message);
  }
}

// Import routes from server/ directory
import authRoutes from "../server/routes/auth.js";
import tourRoutes from "../server/routes/tours.js";
import hotelRoutes from "../server/routes/hotels.js";
import bookingRoutes from "../server/routes/bookings.js";
import destinationRoutes from "../server/routes/destinations.js";
import reviewRoutes from "../server/routes/reviews.js";
import userRoutes from "../server/routes/users.js";

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/users", userRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  await connectDB();
  res.status(200).json({
    success: true,
    message: "NorthRoutes PK API is running",
    db: isConnected ? "connected" : "disconnected",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Vercel serverless handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
