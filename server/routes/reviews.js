import { Router } from "express";
import {
  createReview,
  getReviewsForTarget,
  updateReview,
  deleteReview,
  getAllReviews,
  moderateReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

// Public: get reviews for any target
router.get("/:targetType/:targetId", getReviewsForTarget);

// Protected: create, update, delete own reviews
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

// Admin routes
router.get("/admin/all", protect, authorize("admin", "super_admin"), getAllReviews);
router.put("/admin/:id/moderate", protect, authorize("admin", "super_admin"), moderateReview);

export default router;
