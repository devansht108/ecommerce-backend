import mongoose from "mongoose";

// Ek cart item kya hota hai: product + quantity + price
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Product model se relation
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1 // quantity minimum 1 honi chahiye
  },
  price: {
    type: Number,
    required: true // product ka price
  },
  totalItemPrice: {
    type: Number,
    required: true // price * quantity
  }
});

// User ka poora cart
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // ek user ka ek hi cart
    },
    items: [cartItemSchema], // cart ke saare items
    cartTotal: {
      type: Number,
      default: 0 // total price of entire cart
    }
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
