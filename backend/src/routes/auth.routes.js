import express from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import { checkRole } from "../middlewares/roleCheck.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Get user profile
router.get("/profile", verifyUser, getProfile);

// Example protected routes
router.get("/admin-data", verifyUser, checkRole(["admin"]), (req, res) => {
  res.json({ message: "Only accessible by admin" });
});

router.get("/accountant-data", verifyUser, checkRole(["accountant"]), (req, res) => {
  res.json({ message: "Only accessible by accountant" });
});

export default router;
