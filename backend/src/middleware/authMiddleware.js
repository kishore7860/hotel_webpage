import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { AppError } from './errorHandler.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, phone, reward_points, total_orders FROM users WHERE id = ?').get(decoded.userId);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid token', 401));
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, phone, reward_points, total_orders FROM users WHERE id = ?').get(decoded.userId);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Token invalid, continue as guest
  }

  next();
}
