import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import upload from "../middlewares/uploadMiddleware.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, upload.array("images", 5), createProduct)
  .get(getProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.array("images", 5), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
