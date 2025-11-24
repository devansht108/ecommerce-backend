import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Add product to wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.wishlist.includes(req.body.productId)) {
    res.status(400);
    throw new Error("Already in wishlist");
  }

  user.wishlist.push(req.body.productId);
  await user.save();

  res.json({ message: "Added to wishlist" });
});

// Get wishlist (products)
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "wishlist",
    "name price images"
  );

  res.json(user.wishlist);
});

// Remove item from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== req.params.productId
  );

  await user.save();

  res.json({ message: "Removed from wishlist" });
});
