import mongoose from "mongoose";

// Order ka schema define kar rahe hain
const orderSchema = new mongoose.Schema(
  {
    // Kis user ne order place kiya hai - User model se reference le raha hai
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Order ke saare items ka array
    items: [
      {
        // Kaunsa product order kiya gaya hai - Product model se reference
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // Kitni quantity order ki gayi hai
        quantity: { type: Number, required: true },
        // Product ki price at the time of order
        price: { type: Number, required: true },
        // Is particular item ka total (quantity * price)
        totalItemPrice: { type: Number, required: true },
      },
    ],

    // Pure order ka total amount (sum of all items)
    totalAmount: { type: Number, required: true },

    // Order ka current status
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },

    // -----------------------------
    // DAY 17 PAYMENT FIELDS (Added)
    // -----------------------------

    // Kya payment ho chuki? (mock payment ke liye)
    isPaid: {
      type: Boolean,
      default: false,
    },

    // Payment kab hui?
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true } // Mongoose khud se createdAt aur updatedAt add karega
);

// Order model export kar rahe hain
export default mongoose.model("Order", orderSchema);
