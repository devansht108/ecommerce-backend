import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // pehle header me token check karo
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Bearer ke baad wala token nikalna hai
      token = req.headers.authorization.split(" ")[1];

      // token ko verify karke user ka decoded data milta hai
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded.id se user ko find karke req.user me store kar do (password ke bina)
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      // agar token galat hai ya expire ho gaya
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // agar token mila hi nahi
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export const admin = (req, res, next) => {
  // check karna hai user admin hai ya nahi
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};
