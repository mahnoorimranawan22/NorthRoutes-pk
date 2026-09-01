import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Fix DNS for MongoDB Atlas SRV on local networks (safe to ignore on cloud)
import dns from "dns";
try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch { }

// Trust proxy for Render/Railway
const app = express();
app.set("trust proxy", 1);

// Import routes
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import hotelRoutes from "./routes/hotels.js";
import bookingRoutes from "./routes/bookings.js";
import destinationRoutes from "./routes/destinations.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/users.js";

const PORT = parseInt(process.env.PORT, 10) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/passupeaks-travels";

// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Passu Peaks Travels API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ===== DATABASE & SERVER START =====
async function startServer() {
  try {
    // Connect to MongoDB (skip if no URI provided — for testing)
    if (MONGODB_URI && MONGODB_URI !== "mongodb://localhost:27017/passupeaks-travels") {
      await mongoose.connect(MONGODB_URI);
      console.log("✅ Connected to MongoDB");
    } else {
      console.log("⚠️  No MongoDB URI — running in API-only mode");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Passu Peaks Travels API running on http://localhost:${PORT}`);
      console.log(`📋 Routes:`);
      console.log(`   POST /api/auth/register`);
      console.log(`   POST /api/auth/login`);
      console.log(`   GET  /api/auth/me`);
      console.log(`   GET  /api/tours?destination=&pickup=&budget=&date=`);
      console.log(`   GET  /api/tours/:slug`);
      console.log(`   GET  /api/tours/:slug/availability`);
      console.log(`   GET  /api/hotels?destination=&starRating=&minPrice=&maxPrice=`);
      console.log(`   GET  /api/hotels/:id`);
      console.log(`   GET  /api/hotels/:id/availability?checkIn=&checkOut=`);
      console.log(`   POST /api/bookings`);
      console.log(`   GET  /api/bookings`);
      console.log(`   GET  /api/bookings/:ref\n`);
      console.log(`   GET  /api/destinations\n`);
      console.log(`   GET  /api/reviews/:targetType/:targetId\n`);
      console.log(`   GET  /api/admin/users\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
