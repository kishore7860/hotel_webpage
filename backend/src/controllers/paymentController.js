export function processPayment(req, res, next) {
  const { amount, payment_method } = req.body;

  // Simulated payment processing
  const success = Math.random() > 0.1; // 90% success rate for simulation

  if (success) {
    res.json({
      success: true,
      data: {
        payment_id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount,
        payment_method: payment_method || 'card',
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Payment failed. Please try again.'
    });
  }
}
