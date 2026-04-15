import { Router } from 'express';
import { validateDiscount } from '../controllers/discountController.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const discountLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15,
  message: 'Too many discount code attempts. Please try again later.'
});

const router = Router();

router.post('/validate', discountLimiter, validateDiscount);

export default router;
