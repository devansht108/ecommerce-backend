import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createStripeSession } from "../controllers/paymentController.js";
import { markOrderPaid } from "../controllers/orderController.js";
import { createOrder } from "../controllers/orderController.js";
import { paymentSuccess, paymentCancel } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.patch("/:id/pay", protect, markOrderPaid);
router.post("/:id/pay/stripe", protect, createStripeSession);
router.get("/payment/success", paymentSuccess);
router.get("/payment/cancel", paymentCancel);


export default router;
