import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    location: { type: String, required: true },
    province: {
      type: String,
      required: true,
      enum: ["Gilgit-Baltistan", "Khyber Pakhtunkhwa", "Azad Kashmir", "Punjab"],
    },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },

    // Media
    images: [{ type: String }],
    coverImage: { type: String },
    videoUrl: { type: String },

    // Activities & Info
    activities: [{ type: String }],
    bestSeason: {
      type: String,
      enum: ["Spring", "Summer", "Autumn", "Winter", "All Year"],
      default: "Summer",
    },
    altitude: { type: String },
    climate: { type: String },

    // Category & Rating
    category: {
      type: String,
      enum: ["mountain", "lake", "valley", "adventure", "cultural", "religious", "all"],
      default: "mountain",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // Getting There
    howToReach: {
      fromIslamabad: { type: String },
      fromAbbottabad: { type: String },
      totalDistanceKm: { type: Number },
      travelTimeHours: { type: Number },
    },

    // Featured
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
DestinationSchema.index({ slug: 1 });
DestinationSchema.index({ province: 1 });
DestinationSchema.index({ category: 1 });
DestinationSchema.index({ isActive: 1, isFeatured: -1, sortOrder: 1 });
DestinationSchema.index({ name: "text", description: "text" });

// Virtual: average rating display
DestinationSchema.virtual("ratingDisplay").get(function () {
  return this.rating.toFixed(1);
});

// Pre-save: auto-generate slug
DestinationSchema.pre("save", function () {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Destination = mongoose.model("Destination", DestinationSchema);
export default Destination;
