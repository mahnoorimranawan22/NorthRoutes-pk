import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingByRef,
  cancelBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

// User routes
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/:ref", protect, getBookingByRef);
router.put("/:id/cancel", protect, cancelBooking);

// Admin routes
router.get("/admin/all", protect, authorize("admin", "super_admin"), getAllBookings);
router.get("/admin/:id", protect, authorize("admin", "super_admin"), getBookingById);
router.put("/admin/:id/status", protect, authorize("admin", "super_admin"), updateBookingStatus);

export default router;
