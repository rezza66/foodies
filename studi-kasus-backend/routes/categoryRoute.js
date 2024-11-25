import express from "express";
import { upload } from "../config/multer.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controller/categoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/category/:id", getCategoryById);
router.post("/category", upload, createCategory);
router.put("/category/:id", upload, updateCategory);
router.delete("/category/:id", deleteCategory);

export default router;
