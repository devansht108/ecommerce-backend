import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { sendEmail } from "../utils/sendEmail.js";

// Creates a new order
// Route: POST /api/orders
// Access: Private (User)
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch the user's cart
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Prepare order items
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
    totalItemPrice: item.quantity * item.product.price,
  }));

  // Calculate total amount
  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0
  );

  // Create the order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
  });

  // Clear the cart
  cart.items = [];
  cart.cartTotal = 0;
  await cart.save();

  // Send order confirmation email
  await sendEmail({
    to: req.user.email,
    subject: "Order Confirmation",
     html: `<h1>Order Placed</h1><p>Your order total is ₹${totalAmount}</p>`,
  });

  // Send response
  res.status(201).json({
    message: "Order created successfully",
    order,
  });
});

// Gets all orders of the logged-in user
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
