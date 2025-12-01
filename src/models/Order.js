import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // All items included in the order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalItemPrice: { type: Number, required: true },
      },
    ],

    // Total amount of the entire order
    totalAmount: { type: Number, required: true },

    // Order status
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },

    // Payment completed or not
    isPaid: {
      type: Boolean,
      default: false,
    },

    // Timestamp of payment completion
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
