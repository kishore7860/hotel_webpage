import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many auth attempts. Please try again in 15 minutes.'
});

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
