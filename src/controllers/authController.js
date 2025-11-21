import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Naya user register karne ka function
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  // pehle validation errors check kar lo
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(", "));
  }

  const { name, email, password } = req.body;

  // check karo ki user already exist toh nahi karta
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // agar nhi hai toh naya user create kar do
  const user = await User.create({ name, email, password });

  // agar user sahi se create ho gaya
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // token generate karke bhej do
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    User ko login karwane ka function + token dena
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  // pehle validation errors dekho
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(", "));
  }

  const { email, password } = req.body;

  // user ko email se dhundo aur password bhi select karo
  const user = await User.findOne({ email }).select("+password");

  // check karo password match karta hai ya nahi
  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // login successful toh token bhej do
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logged-in user ka profile deta hai
// @route   GET /api/auth/me
// @access  Private (matlab login zaroori)
export const getMe = asyncHandler(async (req, res) => {
  const user = req.user; // protect middleware ne yeh add kiya hai

  // agar user exist nahi karta toh error
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // user ka data return kar do
  res.json(user);
});