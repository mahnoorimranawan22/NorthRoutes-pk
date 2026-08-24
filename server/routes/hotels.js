import { Router } from "express";
import { getHotels, getHotelById, getHotelAvailability } from "../controllers/hotelController.js";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);
router.get("/:id/availability", getHotelAvailability);

export default router;
