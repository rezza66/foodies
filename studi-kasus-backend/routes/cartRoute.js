import express from 'express';
import {
    getCart, 
    createCart,  
    updateCart,  
    deleteCart   
} from '../controller/cartController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/cart/:id', protect, getCart);
router.post('/cart', protect, createCart);
router.put('/cart/:id', protect, updateCart);
router.delete('/cart/:id', protect, deleteCart);

export default router;
