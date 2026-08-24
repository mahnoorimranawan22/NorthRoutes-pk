import { Router } from "express";
import { getTours, getTourBySlug, getTourAvailability } from "../controllers/tourController.js";

const router = Router();

router.get("/", getTours);
router.get("/:slug", getTourBySlug);
router.get("/:slug/availability", getTourAvailability);

export default router;
