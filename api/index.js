import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "https://mahnoorimranawan22.github.io",
    "https://north-routes-pk.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (cached across warm invocations)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI not set");
      return;
    }
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB error:", err.message);
  }
}

// ===== Inline Models (to avoid import path issues) =====

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin", "super_admin"], default: "user" },
  phone: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  loginCount: { type: Number, default: 0 },
  refreshToken: { type: String, select: false },
}, { timestamps: true });

// Tour Model
const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  destinations: [{ type: String }],
  pickupPoints: [{ type: String }],
  duration: { type: String, required: true },
  totalDays: { type: Number },
  totalNights: { type: Number },
  pricePerPerson: { type: Number, required: true },
  currency: { type: String, default: "PKR" },
  groupPricing: [{ minPersons: Number, maxPersons: Number, discountPercent: Number }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  availableDates: [{ startDate: Date, endDate: Date, availableSpots: Number, status: String }],
  maxGroupSize: { type: Number },
  image: { type: String },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  category: { type: String },
  difficulty: { type: String },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hotel Model
const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  destination: { type: String },
  address: { type: String },
  city: { type: String },
  starRating: { type: Number },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  amenities: [{ name: String, icon: String, category: String }],
  totalRooms: { type: Number },
  startingPricePerNight: { type: Number },
  currency: { type: String, default: "PKR" },
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Room Model
const RoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  type: { type: String, required: true },
  slug: { type: String },
  description: { type: String },
  bedType: { type: String },
  sizeSqm: { type: Number },
  maxGuests: { type: Number },
  pricePerNight: { type: Number },
  totalRooms: { type: Number },
  totalRoomsCount: { type: Number },
  amenities: [{ name: String }],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Booking Model
const BookingSchema = new mongoose.Schema({
  bookingRef: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookingType: { type: String, required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
  tourTitle: { type: String },
  tourStartDate: { type: Date },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  hotelName: { type: String },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  roomType: { type: String },
  pickupPoint: { type: String },
  guests: [{ name: String, isChild: Boolean }],
  totalGuests: { type: Number },
  adultCount: { type: Number },
  childCount: { type: Number },
  priceBreakdown: { type: mongoose.Schema.Types.Mixed },
  paymentMethod: { type: String },
  paymentStatus: { type: String, default: "pending" },
  status: { type: String, default: "pending" },
  specialRequests: { type: String },
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  totalNights: { type: Number },
}, { timestamps: true });

// Destination Model
const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  location: { type: String },
  province: { type: String },
  description: { type: String },
  shortDescription: { type: String },
  images: [{ type: String }],
  coverImage: { type: String },
  activities: [{ type: String }],
  bestSeason: { type: String },
  altitude: { type: String },
  climate: { type: String },
  category: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  howToReach: { type: mongoose.Schema.Types.Mixed },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Review Model
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetType: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetModel: { type: String },
  rating: { type: Number, required: true },
  title: { type: String },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

// Get or create models
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Tour = mongoose.models.Tour || mongoose.model("Tour", TourSchema);
const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);
const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
const Destination = mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

// ===== JWT Helpers (inline) =====
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "nr-pk-secret-2026-production";

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
}

// Auth middleware
async function protect(req, res, next) {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(401).json({ success: false, message: "Not authorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Not authorized" });
    next();
  };
}

// ===== Routes =====

// Health
app.get("/api/health", async (req, res) => {
  await connectDB();
  res.json({ success: true, message: "Passu Peaks Travels API is running", db: isConnected ? "connected" : "disconnected" });
});

// Auth
app.post("/api/auth/register", async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "All fields required" });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword, phone });
    const token = generateToken(user);
    res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "All fields required" });
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user);
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/auth/me", protect, async (req, res) => {
  res.json({ success: true, data: { user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } } });
});

// Tours
app.get("/api/tours", async (req, res) => {
  try {
    await connectDB();
    const { destination, pickup, budget, category, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (destination) filter.destinations = { $in: [destination] };
    if (pickup) filter.pickupPoints = { $in: [pickup] };
    if (category) filter.category = category;
    if (search) filter.$or = [{ title: { $regex: search, $options: "i" } }, { destinations: { $regex: search, $options: "i" } }];
    if (budget) {
      const ranges = { "under-25000": { $lt: 25000 }, "25000-35000": { $gte: 25000, $lte: 35000 }, "35000-50000": { $gte: 35000, $lte: 50000 }, "above-50000": { $gt: 50000 } };
      if (ranges[budget]) filter.pricePerPerson = ranges[budget];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Tour.countDocuments(filter);
    const tours = await Tour.find(filter).sort("-createdAt").skip(skip).limit(parseInt(limit));
    res.json({ success: true, count: tours.length, total, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/tours/:slug", async (req, res) => {
  try {
    await connectDB();
    const tour = await Tour.findOne({ slug: req.params.slug, isActive: true });
    if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Hotels
app.get("/api/hotels", async (req, res) => {
  try {
    await connectDB();
    const { destination, starRating, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (destination) filter.destination = destination;
    if (starRating) filter.starRating = parseInt(starRating);
    if (minPrice || maxPrice) {
      filter.startingPricePerNight = {};
      if (minPrice) filter.startingPricePerNight.$gte = parseInt(minPrice);
      if (maxPrice) filter.startingPricePerNight.$lte = parseInt(maxPrice);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Hotel.countDocuments(filter);
    const hotels = await Hotel.find(filter).sort("-rating").skip(skip).limit(parseInt(limit));
    res.json({ success: true, count: hotels.length, total, data: hotels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/hotels/:id", async (req, res) => {
  try {
    await connectDB();
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    const rooms = await Room.find({ hotel: hotel._id, isActive: true });
    res.json({ success: true, data: { ...hotel.toObject(), rooms } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Destinations
app.get("/api/destinations", async (req, res) => {
  try {
    await connectDB();
    const { search, province, category, featured, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    if (province) filter.province = province;
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Destination.countDocuments(filter);
    const destinations = await Destination.find(filter).sort("-createdAt").skip(skip).limit(parseInt(limit));
    res.json({ success: true, count: destinations.length, total, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/destinations/:id", async (req, res) => {
  try {
    await connectDB();
    const dest = await Destination.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true });
    if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });
    res.json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Bookings
app.post("/api/bookings", protect, async (req, res) => {
  try {
    await connectDB();
    const { bookingType, tourId, guests, pickupPoint, paymentMethod, specialRequests } = req.body;
    if (!guests || !guests.length) return res.status(400).json({ success: false, message: "Guests required" });

    let tourTitle = "", tour = null, pricePerPerson = 0;
    if (tourId) {
      tour = await Tour.findById(tourId);
      if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });
      tourTitle = tour.title;
      pricePerPerson = tour.pricePerPerson;
    }

    const totalGuests = guests.length;
    const grandTotal = pricePerPerson * totalGuests;
    const taxes = Math.round(grandTotal * 0.10);
    const total = grandTotal + taxes;
    const depositPaid = Math.round(total * 0.20);

    const prefix = bookingType === "tour_only" ? "TR" : "HT";
    const bookingRef = `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const booking = await Booking.create({
      bookingRef, user: req.user._id, bookingType, tour: tourId || null, tourTitle,
      tourStartDate: req.body.tourStartDate, pickupPoint, guests, totalGuests,
      adultCount: totalGuests, paymentMethod: paymentMethod || "bank_transfer",
      priceBreakdown: { tourTotal: grandTotal, taxes, grandTotal: total, depositPaid, balanceDue: total - depositPaid, currency: "PKR" },
      specialRequests,
    });

    res.status(201).json({ success: true, data: { bookingRef: booking.bookingRef, id: booking._id, status: booking.status, priceBreakdown: booking.priceBreakdown } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/bookings/my-bookings", protect, async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find({ user: req.user._id }).sort("-createdAt");
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reviews
app.get("/api/reviews/:targetType/:targetId", async (req, res) => {
  try {
    await connectDB();
    const reviews = await Review.find({ targetType: req.params.targetType, targetId: req.params.targetId, isApproved: true }).sort("-createdAt").populate("user", "name");
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Favorites
app.post("/api/destinations/:id/favorite", protect, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user._id);
    const idx = user.favorites.findIndex(f => f.toString() === req.params.id);
    if (idx > -1) { user.favorites.splice(idx, 1); await user.save({ validateBeforeSave: false }); res.json({ success: true, data: { isFavorited: false } }); }
    else { user.favorites.push(req.params.id); await user.save({ validateBeforeSave: false }); res.json({ success: true, data: { isFavorited: true } }); }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Tour CRUD (Admin) =====
app.post("/api/tours", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const data = req.body;
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const tour = await Tour.create(data);
    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/tours/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/tours/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });
    res.json({ success: true, message: "Tour deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/tours/:slug/availability", async (req, res) => {
  try {
    await connectDB();
    const tour = await Tour.findOne({ slug: req.params.slug, isActive: true });
    if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });
    res.json({ success: true, data: { availableDates: tour.availableDates || [], maxGroupSize: tour.maxGroupSize } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Hotel CRUD (Admin) =====
app.post("/api/hotels", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const data = req.body;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const hotel = await Hotel.create(data);
    if (data.rooms && data.rooms.length) {
      for (const r of data.rooms) { await Room.create({ ...r, hotel: hotel._id }); }
    }
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/hotels/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    res.json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/hotels/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    await Room.deleteMany({ hotel: req.params.id });
    res.json({ success: true, message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/hotels/:id/availability", async (req, res) => {
  try {
    await connectDB();
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    const rooms = await Room.find({ hotel: hotel._id, isActive: true });
    res.json({ success: true, data: { rooms, totalRooms: hotel.totalRooms } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Destination CRUD (Admin) =====
app.post("/api/destinations", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const data = req.body;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const dest = await Destination.create(data);
    res.status(201).json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/destinations/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });
    res.json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/destinations/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const dest = await Destination.findByIdAndDelete(req.params.id);
    if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });
    res.json({ success: true, message: "Destination deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/destinations/favorites", protect, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user._id).populate("favorites");
    res.json({ success: true, data: user.favorites || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Booking Extended =====
app.get("/api/bookings/admin/all", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const { status, bookingType, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (bookingType) filter.bookingType = bookingType;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter).sort("-createdAt").skip(skip).limit(parseInt(limit)).populate("user", "name email");
    res.json({ success: true, count: bookings.length, total, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/bookings/admin/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const booking = await Booking.findById(req.params.id).populate("user", "name email phone");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/bookings/admin/:id/status", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const { status, paymentStatus, internalNotes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (internalNotes) update.internalNotes = internalNotes;
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/bookings/:ref", protect, async (req, res) => {
  try {
    await connectDB();
    const booking = await Booking.findOne({ bookingRef: req.params.ref });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/bookings/:id/cancel", protect, async (req, res) => {
  try {
    await connectDB();
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "cancelled", cancellationReason: req.body.reason },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Reviews CRUD =====
app.post("/api/reviews", protect, async (req, res) => {
  try {
    await connectDB();
    const { targetType, targetId, rating, title, comment } = req.body;
    if (!targetType || !targetId || !rating || !comment) return res.status(400).json({ success: false, message: "All fields required" });
    const review = await Review.create({ user: req.user._id, targetType, targetId, targetModel: targetType, rating, title, comment });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/reviews/:id", protect, async (req, res) => {
  try {
    await connectDB();
    const review = await Review.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/reviews/:id", protect, async (req, res) => {
  try {
    await connectDB();
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/reviews/admin/all", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const { targetType, isApproved, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (targetType) filter.targetType = targetType;
    if (isApproved !== undefined) filter.isApproved = isApproved === "true";
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find(filter).sort("-createdAt").skip(skip).limit(parseInt(limit)).populate("user", "name email");
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/reviews/admin/:id/moderate", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const { isApproved, isFeatured, moderationNote } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved, isFeatured, moderationNote }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Admin Users =====
app.get("/api/admin/users", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).select("-password").sort("-createdAt").skip(skip).limit(parseInt(limit));
    res.json({ success: true, count: users.length, total, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/admin/users/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/admin/users/:id/role", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "admin" && req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Admin only" });
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/admin/users/:id", protect, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== "super_admin") return res.status(403).json({ success: false, message: "Super admin only" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin setup - promote user to admin (one-time setup)
app.post("/api/admin/setup-admin", async (req, res) => {
  try {
    await connectDB();
    const { email, secret } = req.body;
    if (secret !== "passupeaks-setup-2026") return res.status(403).json({ success: false, message: "Invalid setup secret" });
    const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: `User ${email} promoted to admin`, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Root - health check (Vercel rewrites frontend to index.html)
app.get("/", (req, res) => {
  res.json({ success: true, message: "Passu Peaks Travels - Full Stack API", frontend: process.env.CLIENT_URL || "https://mahnoorimranawan22.github.io/NorthRoutes-pk/" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found. Use /api/* endpoints." });
});

// Vercel handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
