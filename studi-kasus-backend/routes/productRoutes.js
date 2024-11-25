import express from "express";
import { upload } from "../config/multer.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../controller/productController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/product/:id", protect, getProductById);
router.post("/product", upload, protect, authorize('manage', 'all'), createProduct);
router.put("/product/:id", upload, protect, authorize('manage', 'all'), updateProduct);
router.delete("/product/:id", protect, authorize('manage', 'all'), deleteProduct);

export default router;
