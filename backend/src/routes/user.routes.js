import express from "express";
import {
  uploadDocument,
  getCharges,
  getAllUsers,
  toggleUserStatus,
  getUserById
} from "../controllers/user.controller.js";

import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Upload a document
router.post("/upload", verifyUser, upload.single("file"), uploadDocument);

// Get service charges
router.get("/charges", getCharges);

// Get all users (with pagination/search)
router.get("/all", verifyUser, getAllUsers);

// Toggle user status
router.patch("/status/:id", verifyUser, toggleUserStatus);

// Get a single user by ID
router.get("/:id", verifyUser, getUserById);

export default router;
