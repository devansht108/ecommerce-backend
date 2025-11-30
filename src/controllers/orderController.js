import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { sendEmail } from "../utils/sendEmail.js";

// Creates a new order
// Route: POST /api/orders
// Access: Private (User)
// Steps:
// - User ka cart fetch hota hai
// - Cart ke items ko order me convert kiya jata hai
// - Total amount calculate hota hai
// - Order create hota hai
// - Cart empty hota hai
// - Email send hoti hai
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // User ka cart fetch karna
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  // Agar cart empty ho
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Cart items ko order format me convert karna
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
    totalItemPrice: item.quantity * item.product.price,
  }));

  // Total amount calculate karna
  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0
  );

  // Order create karna
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
  });

  // Cart empty karna
  cart.items = [];
  cart.cartTotal = 0;
  await cart.save();

  // Email send karna
  await sendEmail({
    to: req.user.email,
    subject: "Order Confirmation",
    html: `<h1>Order Placed</h1><p>Your order total is ₹${totalAmount}</p>`,
  });

  // Response
  res.status(201).json({
    message: "Order created successfully",
    order,
  });
});

// Gets all orders of logged-in user
// Route: GET /api/orders/my
// Access: Private (User)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// Admin: Get all orders
// Route: GET /api/orders
// Access: Private (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// Admin: Get order by ID
// Route: GET /api/orders/:id
// Access: Private (Admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

// Mark an order as paid (payment simulation)
// Route: PATCH /api/orders/:id/pay
// Access: Private (User)
// Steps:
// - Stripe ya real payment use nahi kar rahe
// - isPaid true set karna
// - paidAt timestamp save karna
export const markOrderPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  // Order find karna
  const order = await Order.findById(orderId);

  // Agar order nahi mila
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Order ko paid mark karna
  order.isPaid = true;
  order.paidAt = Date.now();

  // Save
  await order.save();

  // Response
  res.json({
    message: "Payment successful (simulated)",
    order,
  });
});
