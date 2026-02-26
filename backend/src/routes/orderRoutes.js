import { Router } from 'express';
import {
  createOrder,
  getOrderByNumber,
  getMyOrders,
  updateOrderStatus,
  confirmOrderPayment
} from '../controllers/orderController.js';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.put('/:orderNumber/status', updateOrderStatus);
router.post('/:orderNumber/confirm-payment', confirmOrderPayment);
router.get('/:orderNumber', getOrderByNumber);

export default router;
