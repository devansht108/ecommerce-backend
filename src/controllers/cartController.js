import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";

import Product from "../models/Product.js";

// Helper: cart ka total nikalne ke liye
const calculateCartTotal = (cart) => {
  cart.cartTotal = cart.items.reduce(
    (sum, item) => sum + item.totalItemPrice,
    0
  );
  return cart.cartTotal;
};

// Add to cart
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  // Product exist karta hai ya nahi
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const price = product.price;
  const totalItemPrice = price * quantity;

  let cart = await Cart.findOne({ user: userId });

  // Agar cart nahi hai pehle se, naya banao
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, price, totalItemPrice }],
      cartTotal: totalItemPrice
    });

    return res.status(201).json(cart);
  }

  // Cart exist karta hai → item already exist karta hai?
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Quantity increase karo
    cart.items[itemIndex].quantity += quantity;
    cart.items[itemIndex].totalItemPrice =
      cart.items[itemIndex].quantity * cart.items[itemIndex].price;
  } else {
    // Naya item add karo
    cart.items.push({
      product: productId,
      quantity,
      price,
      totalItemPrice
    });
  }

  calculateCartTotal(cart);

  const updated = await cart.save();
  res.json(updated);
});

// Get cart
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price images stock" // sirf ye fields show hongi
  );

  if (!cart) {
    return res.json({ items: [], cartTotal: 0 });
  }

  res.json(cart);
});

// Update quantity of an item
export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId, quantity } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  item.quantity = quantity;
  item.totalItemPrice = item.price * quantity;

  calculateCartTotal(cart);

  const updated = await cart.save();
  res.json(updated);
});

// Item remove karo
export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item._id.toString() !== itemId
  );

  calculateCartTotal(cart);

  const updated = await cart.save();
  res.json(updated);
});
