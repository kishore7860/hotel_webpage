import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export function validateDiscount(req, res, next) {
  const { code, subtotal } = req.body;

  if (!code) {
    return next(new AppError('Discount code is required', 400));
  }

  const discount = db.prepare(`
    SELECT * FROM discounts
    WHERE code = ? AND is_active = 1
    AND (valid_from IS NULL OR valid_from <= datetime('now'))
    AND (valid_until IS NULL OR valid_until >= datetime('now'))
    AND (usage_limit IS NULL OR times_used < usage_limit)
  `).get(code.toUpperCase());

  if (!discount) {
    return next(new AppError('Invalid or expired discount code', 400));
  }

  if (subtotal && subtotal < discount.min_order_amount) {
    return next(new AppError(`Minimum order amount of ₹${discount.min_order_amount} required`, 400));
  }

  let discountAmount = 0;
  if (subtotal) {
    if (discount.discount_type === 'percentage') {
      discountAmount = (subtotal * discount.discount_value) / 100;
      if (discount.max_discount_amount) {
        discountAmount = Math.min(discountAmount, discount.max_discount_amount);
      }
    } else {
      discountAmount = discount.discount_value;
    }
  }

  res.json({
    success: true,
    data: {
      discount: {
        code: discount.code,
        type: discount.discount_type,
        value: discount.discount_value,
        min_order_amount: discount.min_order_amount,
        max_discount_amount: discount.max_discount_amount,
        calculated_discount: Math.round(discountAmount * 100) / 100
      }
    }
  });
}
