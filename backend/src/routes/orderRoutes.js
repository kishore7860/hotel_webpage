import { Router } from 'express';
import { createOrder, getOrderByNumber, getMyOrders } from '../controllers/orderController.js';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:orderNumber', getOrderByNumber);

export default router;
