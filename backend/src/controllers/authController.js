import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return next(new AppError('Name, email and password are required', 400));
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)').run(name, email, passwordHash, phone || null);

    const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    const user = db.prepare('SELECT id, name, email, phone, reward_points, total_orders FROM users WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          reward_points: user.reward_points,
          total_orders: user.total_orders
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

export function getMe(req, res) {
  res.json({
    success: true,
    data: { user: req.user }
  });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    db.prepare('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?').run(name, phone, userId);

    const user = db.prepare('SELECT id, name, email, phone, reward_points, total_orders FROM users WHERE id = ?').get(userId);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}
