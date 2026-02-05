import { Router } from 'express';
import { getBalance, getHistory, redeemPoints } from '../controllers/rewardsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/balance', authenticate, getBalance);
router.get('/history', authenticate, getHistory);
router.post('/redeem', authenticate, redeemPoints);

export default router;
