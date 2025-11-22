import mongoose from "mongoose";

// Product ka schema define kar rahe hain (MongoDB doc ki structure)
const productSchema = new mongoose.Schema(
  {
    // Product ka naam — required, trimmed, aur text search enable
    name: { type: String, required: true, text: true, trim: true },

    // Product ka description — bina iske product create nahi hoga
    description: { type: String, required: true },

    // Product ki price — number honi chahiye aur 0 se kam nahi ho sakti
    price: { type: Number, required: true, min: 0 },

    // Category — fast searching/filtering ke liye index laga hua hai
    category: { type: String, required: true, index: true },

    // Brand — agar user na de toh default "Generic" lagega
    brand: { type: String, default: "Generic" },

    // Stock — kitne items available hain, 0 se kam allowed nahi
    stock: { type: Number, required: true, min: 0 },

    // Images ka array — har image ke liye filename aur path store hoga
    images: [
      {
        filename: String,
        path: String,
      },
    ],
  },

  // Mongoose automatically createdAt aur updatedAt fields add karega
  { timestamps: true }
);

// text search enable kiya — "name" field par keyword-based search possible
productSchema.index({ name: "text" });

// Model export kar rahe hain — isse database me "products" collection banege
export default mongoose.model("Product", productSchema);
