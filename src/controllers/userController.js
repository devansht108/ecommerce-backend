// src/controllers/userController.js
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    User ka profile update karne ka function
// @route   PATCH /api/users/profile
// @access  Private (matlab login hona zaroori hai)
export const updateProfile = asyncHandler(async (req, res) => {
  // pehle current logged-in user ka data database se nikal lo
  // req.user._id protect middleware me set hota hai
  const user = await User.findById(req.user._id).select("+password");

  // agar user mila hi nahi toh error throw karo
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // req.body se jo fields aaye hain, unhe update kar do
  const { name, email, password } = req.body;

  // agar name bheja hai toh user ka name change kar do
  if (name) user.name = name;

  // agar email bheja hai toh user ka email update kar do
  if (email) user.email = email;

  // agar password diya hai toh direct assign kar do
  // hashing pre-save hook me ho jayega (User model ke andar)
  if (password) user.password = password;

  // updated user ko save kar do
  const updated = await user.save();

  // successfully update hone ke baad updated details bhej do
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });
});
