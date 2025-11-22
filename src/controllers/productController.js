import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// Create product (Admin only)
// Yeh function admin ko new product add karne deta hai
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, brand, stock } = req.body;

  // Agar images upload hui hain toh unka filename aur path store kiya ja raha hai
  const images = req.files?.map((file) => ({
    filename: file.filename,
    path: file.path,
  }));

  // Naya product database me create kiya ja raha hai
  const product = await Product.create({
    name,
    description,
    price,
    category,
    brand,
    stock,
    images,
  });

  res.status(201).json(product);
});

// Get ALL products with search, filters, pagination
// Is function me saare products search, filter, sorting aur pagination ke sath fetch kiye jaate hain
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 10 } =
    req.query;

  const filter = {};

  // Keyword search ke liye text search use ho raha hai
  if (keyword) filter.$text = { $search: keyword };

  // Category filter
  if (category) filter.category = category;

  // Price range filter
  if (minPrice || maxPrice)
    filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };

  let query = Product.find(filter);

  // Sorting option
  if (sort) {
    query = query.sort(sort.replace(",", " "));
  }

  // Pagination logic: skip aur limit
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(Number(limit));

  const products = await query;
  const total = await Product.countDocuments(filter);

  // Response: total products, page number, total pages
  res.json({
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    totalProducts: total,
    products,
  });
});

// Get one product
// Ek specific product ko id se fetch karta hai
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found"); // Product nahi mila toh error
  }
  res.json(product);
});

// Update product (Admin)
// Admin existing product ko update kar sakta hai
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, description, price, category, brand, stock } = req.body;

  // Jo fields update hui hain unhe replace kiya ja raha hai, baaki old values rehengi
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.stock = stock || product.stock;

  // Agar new images upload hui hain toh unhe images array me add kiya ja raha hai
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));
    product.images.push(...newImages);
  }

  const updated = await product.save(); // Updated product save kiya ja raha hai
  res.json(updated);
});

// Delete product (Admin)
// Admin kisi product ko permanently delete kar sakta hai
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne(); // Product ko database se delete kiya ja raha hai
  res.json({ message: "Product deleted" });
});
