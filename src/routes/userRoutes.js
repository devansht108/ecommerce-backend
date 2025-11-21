import express from "express";
const router = express.Router();
import { updateProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

// user apna profile update karega — pehle protect middleware check karega ki user login hai ya nahi
router.patch("/profile", protect, updateProfile);

export default router;
