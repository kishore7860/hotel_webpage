import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export function getBalance(req, res, next) {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  res.json({
    success: true,
    data: {
      points: req.user.reward_points,
      equivalent_value: Math.floor(req.user.reward_points / 10)
    }
  });
}

export function getHistory(req, res, next) {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const transactions = db.prepare(`
    SELECT rt.*, o.order_number
    FROM reward_transactions rt
    LEFT JOIN orders o ON rt.order_id = o.id
    WHERE rt.user_id = ?
    ORDER BY rt.created_at DESC
  `).all(req.user.id);

  res.json({
    success: true,
    data: { transactions }
  });
}

export function redeemPoints(req, res, next) {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const { points } = req.body;

  if (!points || points < 100) {
    return next(new AppError('Minimum 100 points required for redemption', 400));
  }

  if (points % 100 !== 0) {
    return next(new AppError('Points must be in multiples of 100', 400));
  }

  if (points > req.user.reward_points) {
    return next(new AppError('Insufficient points', 400));
  }

  const discountValue = Math.floor(points / 10); // 100 points = ₹10

  res.json({
    success: true,
    data: {
      points_to_redeem: points,
      discount_value: discountValue,
      remaining_points: req.user.reward_points - points
    }
  });
}
