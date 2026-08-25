import { Router } from "express";
import { getHotels, getHotelById, getHotelAvailability, createHotel, updateHotel, deleteHotel } from "../controllers/hotelController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getHotels);
router.get("/:id", getHotelById);
router.get("/:id/availability", getHotelAvailability);

// Admin CRUD routes (protected)
router.post("/", protect, authorize("admin", "super_admin"), createHotel);
router.put("/:id", protect, authorize("admin", "super_admin"), updateHotel);
router.delete("/:id", protect, authorize("admin", "super_admin"), deleteHotel);

export default router;
