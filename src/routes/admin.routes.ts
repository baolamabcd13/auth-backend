import express from "express";
import {
  getAllUsers,
  deleteUser,
  getInviteCodes,
  invalidateInviteCode,
  getInviteCodeStats,
  updateUserRole,
} from "../controllers/auth/admin.controller";
import { protect, admin } from "../middleware/auth.middleware";
import { validateUserId } from "../middleware/validate.middleware";

const router = express.Router();

router.use(protect, admin); // Tất cả routes đều cần quyền admin

// User management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:userId/role", updateUserRole);

// Invite code management
router.get("/invite-codes", getInviteCodes);
router.put(
  "/invite-codes/:id/invalidate",
  validateUserId,
  invalidateInviteCode
);
router.get("/invite-codes/stats", getInviteCodeStats);

export default router;
