import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Polymorphic review target
    targetType: {
      type: String,
      required: true,
      enum: ["tour", "destination", "hotel"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["Tour", "Destination", "Hotel"],
    },

    // Review content
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100 },
    comment: { type: String, required: true, maxlength: 2000 },

    // Review metadata
    visitDate: { type: Date },
    travelType: {
      type: String,
      enum: ["solo", "couple", "family", "friends", "business"],
    },
    wouldRecommend: { type: Boolean, default: true },

    // Photos
    images: [{ type: String }],

    // Moderation
    isApproved: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moderatedAt: { type: Date },
    moderationNote: { type: String },

    // Helpful votes
    helpfulCount: { type: Number, default: 0 },
    reportedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// One review per user per target
ReviewSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });
ReviewSchema.index({ targetId: 1, targetType: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ isApproved: 1, isFeatured: -1 });
ReviewSchema.index({ createdAt: -1 });

// Static: calculate average rating for a target
ReviewSchema.statics.calcAverageRating = async function (targetId, targetType) {
  const stats = await this.aggregate([
    { $match: { targetId, targetType, isApproved: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return stats.length > 0
    ? { rating: Math.round(stats[0].avgRating * 10) / 10, count: stats[0].count }
    : { rating: 0, count: 0 };
};

// Post-save: update parent rating
ReviewSchema.post("save", async function () {
  const { calcAverageRating } = this.constructor;
  const stats = await calcAverageRating(this.targetId, this.targetType);

  // Dynamically update the parent model
  let Model;
  if (this.targetType === "tour") Model = (await import("./Tour.js")).default;
  else if (this.targetType === "destination") Model = (await import("./Destination.js")).default;
  else if (this.targetType === "hotel") Model = (await import("./Hotel.js")).default;

  if (Model) {
    await Model.findByIdAndUpdate(this.targetId, {
      rating: stats.rating,
      reviewCount: stats.count,
    });
  }
});

// Post-remove: update parent rating
ReviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const { calcAverageRating } = doc.constructor;
    const stats = await calcAverageRating(doc.targetId, doc.targetType);

    let Model;
    if (doc.targetType === "tour") Model = (await import("./Tour.js")).default;
    else if (doc.targetType === "destination") Model = (await import("./Destination.js")).default;
    else if (doc.targetType === "hotel") Model = (await import("./Hotel.js")).default;

    if (Model) {
      await Model.findByIdAndUpdate(doc.targetId, {
        rating: stats.rating,
        reviewCount: stats.count,
      });
    }
  }
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
