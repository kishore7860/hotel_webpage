import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export function getAllCategories(req, res) {
  const categories = db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order').all();
  res.json({
    success: true,
    data: { categories }
  });
}

export function getCategoryById(req, res, next) {
  const category = db.prepare('SELECT * FROM categories WHERE id = ? AND is_active = 1').get(req.params.id);
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  res.json({
    success: true,
    data: { category }
  });
}

export function getAllMenuItems(req, res) {
  const items = db.prepare(`
    SELECT mi.*, c.name as category_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE mi.is_available = 1
    ORDER BY c.display_order, mi.name
  `).all();
  res.json({
    success: true,
    data: { items }
  });
}

export function getFeaturedItems(req, res) {
  const items = db.prepare(`
    SELECT mi.*, c.name as category_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE mi.is_featured = 1 AND mi.is_available = 1
    ORDER BY mi.name
  `).all();
  res.json({
    success: true,
    data: { items }
  });
}

export function getItemsByCategory(req, res, next) {
  const categoryId = req.params.id;
  const category = db.prepare('SELECT * FROM categories WHERE id = ? AND is_active = 1').get(categoryId);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  const items = db.prepare(`
    SELECT mi.*, c.name as category_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE mi.category_id = ? AND mi.is_available = 1
    ORDER BY mi.name
  `).all(categoryId);

  res.json({
    success: true,
    data: { category, items }
  });
}

export function getItemById(req, res, next) {
  const item = db.prepare(`
    SELECT mi.*, c.name as category_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE mi.id = ? AND mi.is_available = 1
  `).get(req.params.id);

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  res.json({
    success: true,
    data: { item }
  });
}
