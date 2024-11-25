import express from 'express';
import {
  createDeliveryAddress,
  getDeliveryAddresses,
  getDeliveryAddressById,
  updateDeliveryAddress,
  deleteDeliveryAddress,
} from '../controller/deliveryAddressController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/deliveryAddress', protect, createDeliveryAddress);
router.get('/deliveryAddresses', protect, getDeliveryAddresses);
router.get('/deliveryAddress/:id', protect, getDeliveryAddressById);
router.put('/deliveryAddress/:id', updateDeliveryAddress);
router.delete('/deliveryAddress/:id', deleteDeliveryAddress);

export default router;
