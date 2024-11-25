import express from "express";
import { getInvoice } from "../controller/invoiceController.js";

const router = express.Router();

router.get("/invoice/:order_id", getInvoice);

export default router;