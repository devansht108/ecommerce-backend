import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cartController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add item to cart
router.post("/", protect, addToCart);

// User ka cart show karo
router.get("/", protect, getCart);

// Update quantity
router.patch("/", protect, updateCartItem);

// Item delete
router.delete("/:itemId", protect, removeCartItem);

export default router;
