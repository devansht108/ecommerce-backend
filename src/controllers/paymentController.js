import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import { stripe } from "../config/stripe.js";

// CREATE STRIPE CHECKOUT SESSION
export const createStripeSession = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: `Order #${orderId}` },
          unit_amount: order.totalAmount * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `http://localhost:5000/api/payment/success?orderId=${orderId}`,
    cancel_url: "http://localhost:5000/api/payment/cancel",
  });

  res.json({ url: session.url });
});

// PAYMENT SUCCESS CALLBACK
export const paymentSuccess = asyncHandler(async (req, res) => {
  const orderId = req.query.orderId;

  const order = await Order.findById(orderId);
  if (!order) return res.send("Order not found");

  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  res.send("Payment Successful! Order updated.");
});

// PAYMENT CANCEL CALLBACK
export const paymentCancel = (req, res) => {
  res.send("Payment cancelled.");
};
