import express from "express";
import { getOrder, createOrder } from "../controller/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/orders", protect, createOrder);
router.get("/orders", protect, getOrder);

export default router;