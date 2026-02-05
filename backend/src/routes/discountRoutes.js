import { Router } from 'express';
import { validateDiscount } from '../controllers/discountController.js';

const router = Router();

router.post('/validate', validateDiscount);

export default router;
