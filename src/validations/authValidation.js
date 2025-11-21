import { body } from "express-validator";

// register form ke fields ko validate karne ke liye rules
export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"), // name khaali nahi hona chahiye
  body("email").isEmail().withMessage("Valid email is required"), // email sahi format ka hona chahiye
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"), // password kam se kam 6 characters ka
];

// login form ke fields ki validation
export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"), // sahi email dena zaroori hai
  body("password").exists().withMessage("Password is required"), // password field hona hi chahiye
];
