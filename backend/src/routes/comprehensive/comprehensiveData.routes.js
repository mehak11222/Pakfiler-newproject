import express from "express"
import { verifyUser } from "../../middlewares/verifyUser.js"
import {
  getAllUserData,
  saveAllUserData,
  getSpecificData,
} from "../../controllers/comprehensive/comprehensiveData.controller.js"

const router = express.Router()

// Apply authentication middleware
router.use(verifyUser)

// GET /api/comprehensive/all - Get all user data
router.get("/all", getAllUserData)

// POST /api/comprehensive/save - Save all user data
router.post("/save", saveAllUserData)

// GET /api/comprehensive/specific - Get specific data type
router.get("/specific", getSpecificData)

export default router
