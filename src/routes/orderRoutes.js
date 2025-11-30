import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { markOrderPaid } from "../controllers/orderController.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.patch("/:id/pay", protect, markOrderPaid);

export default router;
