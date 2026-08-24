import { Router } from "express";
import { createBooking, getMyBookings, getBookingByRef } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createBooking);
router.get("/", protect, getMyBookings);
router.get("/:ref", protect, getBookingByRef);

export default router;
