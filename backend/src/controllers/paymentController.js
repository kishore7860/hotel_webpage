import { AppError } from '../middleware/errorHandler.js';

export function processPayment(req, res, next) {
  const { amount, payment_method, order_number } = req.body;

  if (!amount || amount <= 0) {
    return next(new AppError('Invalid payment amount', 400));
  }

  // Simulated payment processing — replace with Razorpay/Stripe in production
  const success = Math.random() > 0.1; // 90% success rate for simulation

  if (success) {
    res.json({
      success: true,
      data: {
        payment_id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order_number: order_number || null,
        amount,
        payment_method: payment_method || 'card',
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });
  } else {
    return next(new AppError('Payment failed. Please try again.', 402));
  }
}
