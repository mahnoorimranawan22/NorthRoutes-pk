import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  category: {
    type: String,
    enum: ["general", "room", "dining", "recreation", "business", "transport"],
    default: "general",
  },
}, { _id: false });

const AvailabilityDateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalRooms: { type: Number, required: true },
  bookedRooms: { type: Number, default: 0 },
  priceOverride: { type: Number, default: null },
}, { _id: false });

const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },

    // Location
    destination: {
      type: String,
      required: true,
      enum: ["Naran", "Batakundi", "Babusar Top", "Hunza", "Skardu", "Fairy Meadows", "Swat", "Deosai", "Murree"],
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // Star rating
    starRating: { type: Number, min: 1, max: 5, default: 3 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // Amenities
    amenities: { type: [AmenitySchema], default: [] },

    // Room Summary
    totalRooms: { type: Number, required: true, min: 1 },
    roomTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],

    // Pricing
    startingPricePerNight: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PKR" },

    // Availability Calendar
    availability: { type: [AvailabilityDateSchema], default: [] },

    // Policies
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "12:00" },
    cancellationPolicy: { type: String, default: "Free cancellation up to 48 hours before check-in." },
    childPolicy: { type: String, default: "Children under 5 stay free." },
    petPolicy: { type: String, default: "Pets not allowed." },

    // Media
    images: [{ type: String }],
    logo: { type: String },
    virtualTourUrl: { type: String },

    // Contact
    phone: { type: String },
    email: { type: String },
    website: { type: String },

    // Meta
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
HotelSchema.index({ slug: 1 });
HotelSchema.index({ destination: 1 });
HotelSchema.index({ isActive: 1, isFeatured: -1 });
HotelSchema.index({ starRating: 1 });
HotelSchema.index({ startingPricePerNight: 1 });
HotelSchema.index({ "availability.date": 1 });

// Virtual: available rooms count
HotelSchema.virtual("availableRoomTypesCount").get(function () {
  return this.roomTypes.length;
});

// Pre-save: auto-generate slug
HotelSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const Hotel = mongoose.model("Hotel", HotelSchema);
export default Hotel;
