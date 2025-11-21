import express from "express";
const router = express.Router();
import { registerUser, authUser, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { registerValidation, loginValidation } from "../validations/authValidation.js";

// naya user register karne ka route
router.post("/register", registerValidation, registerUser);

// user ko login karwane ka route
router.post("/login", loginValidation, authUser);

// logged-in user ka data lane ka route (sirf authenticated users ke liye)
router.get("/me", protect, getMe);

export default router;