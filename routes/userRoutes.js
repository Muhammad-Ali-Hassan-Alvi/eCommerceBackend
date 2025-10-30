import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  deleteProfile,
  getUserProfile,
  handleLogoutUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateUserProfile,
  verifyToken,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.post("/logout", protect, handleLogoutUser);
router.post("/verify", protect, verifyToken);
router.post("/refresh", protect, refreshAccessToken);
router.patch("/update", protect, updateUserProfile);
router.delete("/delete", protect, deleteProfile);


export default router