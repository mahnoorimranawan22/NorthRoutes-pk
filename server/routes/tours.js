import { Router } from "express";
import { getTours, getTourBySlug, getTourAvailability, createTour, updateTour, deleteTour } from "../controllers/tourController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getTours);
router.get("/:slug", getTourBySlug);
router.get("/:slug/availability", getTourAvailability);

// Admin CRUD routes (protected)
router.post("/", protect, authorize("admin", "super_admin"), createTour);
router.put("/:id", protect, authorize("admin", "super_admin"), updateTour);
router.delete("/:id", protect, authorize("admin", "super_admin"), deleteTour);

export default router;
