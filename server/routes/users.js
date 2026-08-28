import { Router } from "express";
import { getAllUsers, getUserById, updateUserRole, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

// All admin-only
router.get("/", protect, authorize("admin", "super_admin"), getAllUsers);
router.get("/:id", protect, authorize("admin", "super_admin"), getUserById);
router.put("/:id/role", protect, authorize("super_admin"), updateUserRole);
router.delete("/:id", protect, authorize("super_admin"), deleteUser);

export default router;
