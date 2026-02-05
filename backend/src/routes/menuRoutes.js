import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  getAllMenuItems,
  getFeaturedItems,
  getItemsByCategory,
  getItemById
} from '../controllers/menuController.js';

const router = Router();

router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.get('/menu', getAllMenuItems);
router.get('/menu/featured', getFeaturedItems);
router.get('/menu/category/:id', getItemsByCategory);
router.get('/menu/:id', getItemById);

export default router;
