import mongoose from "mongoose";

const RoomAmenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
}, { _id: false });

const RoomAvailabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalRooms: { type: Number, required: true },
  bookedRooms: { type: Number, default: 0 },
  priceOverride: { type: Number, default: null },
}, { _id: false });

const SeasonalPricingSchema = new mongoose.Schema({
  seasonName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priceMultiplier: { type: Number, required: true, default: 1.0 },
}, { _id: false });

const RoomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    type: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },

    // Room specs
    bedType: {
      type: String,
      required: true,
      enum: ["Single Bed", "Twin Beds", "Queen Bed", "King Bed", "2 Queen Beds", "King Bed + Sofa Bed", "Suite Layout"],
    },
    sizeSqm: { type: Number, required: true, min: 1 },
    maxGuests: { type: Number, required: true, min: 1 },
    floorLevel: { type: String },

    // Pricing
    pricePerNight: { type: Number, required: true, min: 0 },
    weekendPricePerNight: { type: Number, default: null },
    currency: { type: String, default: "PKR" },
    seasonalPricing: { type: [SeasonalPricingSchema], default: [] },

    // Taxes & Fees
    taxPercent: { type: Number, default: 0 },
    serviceChargePercent: { type: Number, default: 0 },

    // Amenities
    amenities: { type: [RoomAmenitySchema], default: [] },

    // Inventory
    totalRooms: { type: Number, required: true, min: 1 },
    totalRoomsCount: { type: Number, required: true, min: 1 },

    // Availability Calendar
    availability: { type: [RoomAvailabilitySchema], default: [] },

    // Policies
    smokingAllowed: { type: Boolean, default: false },
    extraBedAllowed: { type: Boolean, default: false },
    extraBedPrice: { type: Number, default: 0 },
    minNights: { type: Number, default: 1 },
    maxNights: { type: Number, default: 30 },

    // Media
    images: [{ type: String }],
    floorPlan: { type: String },

    // Meta
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
RoomSchema.index({ hotel: 1 });
RoomSchema.index({ hotel: 1, type: 1 });
RoomSchema.index({ hotel: 1, isActive: 1 });
RoomSchema.index({ pricePerNight: 1 });
RoomSchema.index({ "availability.date": 1 });

// Virtual: available rooms count
RoomSchema.virtual("availableCount").get(function () {
  const today = new Date().toISOString().split("T")[0];
  const todayAvail = this.availability.find(
    (a) => a.date.toISOString().split("T")[0] === today
  );
  return todayAvail ? todayAvail.totalRooms - todayAvail.bookedRooms : this.totalRooms;
});

// Virtual: is available
RoomSchema.virtual("isAvailable").get(function () {
  return this.availableCount > 0;
});

// Pre-save: auto-generate slug
RoomSchema.pre("save", function (next) {
  if (this.isModified("type") && !this.slug) {
    this.slug = this.type
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (this.isModified("totalRooms")) {
    this.totalRoomsCount = this.totalRooms;
  }
  next();
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
