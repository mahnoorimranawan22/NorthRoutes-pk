import { Router } from "express";
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  toggleFavorite,
  getFavorites,
} from "../controllers/destinationController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getDestinations);
router.get("/favorites", protect, getFavorites);
router.get("/:id", getDestinationById);

// Protected: favorites
router.post("/:id/favorite", protect, toggleFavorite);

// Admin CRUD routes
router.post("/", protect, authorize("admin", "super_admin"), createDestination);
router.put("/:id", protect, authorize("admin", "super_admin"), updateDestination);
router.delete("/:id", protect, authorize("admin", "super_admin"), deleteDestination);

export default router;
