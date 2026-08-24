import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  meals: { type: [String], enum: ["breakfast", "lunch", "dinner"], default: [] },
  accommodation: { type: String, default: "" },
  highlights: { type: [String], default: [] },
}, { _id: false });

const GroupPricingSchema = new mongoose.Schema({
  minPersons: { type: Number, required: true },
  maxPersons: { type: Number, required: true },
  discountPercent: { type: Number, required: true, min: 0, max: 100 },
}, { _id: false });

const AvailableDateSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  availableSpots: { type: Number, required: true, min: 0 },
  priceOverride: { type: Number, default: null },
  status: { type: String, enum: ["open", "full", "cancelled"], default: "open" },
}, { _id: false });

const TourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },

    // Route & Destinations
    destinations: {
      type: [String],
      required: true,
      enum: ["Naran", "Batakundi", "Babusar Top", "Hunza", "Skardu", "Fairy Meadows", "Swat", "Deosai"],
    },
    route: {
      startCity: { type: String, required: true },
      endCity: { type: String, required: true },
      waypoints: [{ type: String }],
      totalDistanceKm: { type: Number },
    },

    // Pickup & Drop
    pickupPoints: {
      type: [String],
      required: true,
      enum: ["Islamabad", "Abbottabad"],
    },
    pickupLocations: [{
      city: { type: String, required: true },
      address: { type: String },
      coordinates: { lat: Number, lng: Number },
    }],

    // Duration & Itinerary
    duration: { type: String, required: true },
    totalDays: { type: Number, required: true },
    totalNights: { type: Number, required: true },
    itinerary: { type: [ItinerarySchema], required: true },

    // Pricing
    pricePerPerson: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PKR" },
    groupPricing: { type: [GroupPricingSchema], default: [] },
    childDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
    singleOccupancySurcharge: { type: Number, default: 0 },

    // Inclusions & Exclusions
    inclusions: { type: [String], required: true },
    exclusions: { type: [String], required: true },

    // Availability
    availableDates: { type: [AvailableDateSchema], default: [] },
    maxGroupSize: { type: Number, required: true, min: 1 },
    minimumPersons: { type: Number, default: 1 },

    // Media
    image: { type: String, required: true },
    images: [{ type: String }],
    videoUrl: { type: String },

    // Ratings
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // Meta
    category: {
      type: String,
      enum: ["adventure", "cultural", "family", "luxury", "budget", "honeymoon"],
      default: "adventure",
    },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "challenging", "difficult"],
      default: "moderate",
    },
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
TourSchema.index({ slug: 1 });
TourSchema.index({ destinations: 1 });
TourSchema.index({ pickupPoints: 1 });
TourSchema.index({ isActive: 1, isFeatured: -1, sortOrder: 1 });
TourSchema.index({ pricePerPerson: 1 });
TourSchema.index({ "availableDates.startDate": 1 });

// Virtual: cheapest price
TourSchema.virtual("startingPrice").get(function () {
  return this.pricePerPerson;
});

// Virtual: available dates count
TourSchema.virtual("availableDatesCount").get(function () {
  return this.availableDates.filter((d) => d.status === "open" && d.availableSpots > 0).length;
});

// Pre-save: auto-generate slug
TourSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const Tour = mongoose.model("Tour", TourSchema);
export default Tour;
