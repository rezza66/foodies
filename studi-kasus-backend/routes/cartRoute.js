import express from 'express';
import {
    getCartItems,
    updateCarts
} from '../controller/cartController.js';
import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/carts', protect, getCartItems);
router.put('/cart', updateCarts);

export default router;
