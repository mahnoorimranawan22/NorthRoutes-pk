import Review from "../models/Review.js";

// POST /api/reviews - Create a review
export async function createReview(req, res) {
  try {
    const { targetType, targetId, rating, title, comment, visitDate, travelType, wouldRecommend } = req.body;

    // Validate
    if (!targetType || !targetId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "targetType, targetId, rating, and comment are required.",
      });
    }

    const validTypes = ["tour", "destination", "hotel"];
    if (!validTypes.includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: `targetType must be one of: ${validTypes.join(", ")}`,
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Map targetType to model name
    const modelMap = { tour: "Tour", destination: "Destination", hotel: "Hotel" };

    // Check duplicate
    const existing = await Review.findOne({
      user: req.user._id,
      targetId,
      targetType,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this. You can edit your existing review.",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      targetType,
      targetId,
      targetModel: modelMap[targetType],
      rating,
      title,
      comment,
      visitDate: visitDate ? new Date(visitDate) : undefined,
      travelType,
      wouldRecommend: wasRecommended(wouldRecommend),
    });

    await review.populate("user", "name avatar");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this item.",
      });
    }
    res.status(500).json({ success: false, message: "Failed to create review." });
  }
}

function wasRecommended(val) {
  return val !== false && val !== "false";
}

// GET /api/reviews/:targetType/:targetId - Get reviews for a target
export async function getReviewsForTarget(req, res) {
  try {
    const { targetType, targetId } = req.params;
    const { sort = "-createdAt", page = 1, limit = 10 } = req.query;

    const filter = {
      targetType,
      targetId,
      isApproved: true,
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name avatar");

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews." });
  }
}

// PUT /api/reviews/:id - Update a review (owner only)
export async function updateReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString() && req.user.role === "user") {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own reviews.",
      });
    }

    const { rating, title, comment, wouldRecommend } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (wouldRecommend !== undefined) review.wouldRecommend = wasRecommended(wouldRecommend);

    await review.save();

    // Recalculate parent rating
    await review.constructor.calcAverageRating(review.targetId, review.targetType);

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ success: false, message: "Failed to update review." });
  }
}

// DELETE /api/reviews/:id - Delete a review (owner or admin)
export async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role === "user") {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews.",
      });
    }

    const targetType = review.targetType;
    const targetId = review.targetId;

    await Review.findByIdAndDelete(req.params.id);

    // Recalculate parent rating
    await Review.calcAverageRating(targetId, targetType);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Failed to delete review." });
  }
}

// GET /api/admin/reviews - Get all reviews (admin)
export async function getAllReviews(req, res) {
  try {
    const { targetType, isApproved, sort = "-createdAt", page = 1, limit = 20 } = req.query;

    const filter = {};
    if (targetType) filter.targetType = targetType;
    if (isApproved !== undefined) filter.isApproved = isApproved === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email avatar");

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      data: reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews." });
  }
}

// PUT /api/admin/reviews/:id/moderate - Moderate a review (admin)
export async function moderateReview(req, res) {
  try {
    const { isApproved, isFeatured, moderationNote } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        isApproved,
        isFeatured,
        moderationNote,
        moderatedBy: req.user._id,
        moderatedAt: new Date(),
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    res.status(200).json({
      success: true,
      message: "Review moderated successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Moderate review error:", error);
    res.status(500).json({ success: false, message: "Failed to moderate review." });
  }
}
