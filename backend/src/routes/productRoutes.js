import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../controllers/productController.js';

const router = express.Router();

const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(['electronics', 'fashion', 'home', 'beauty', 'sports', 'books'])
    .withMessage('Valid category is required (electronics, fashion, home, beauty, sports, books)'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be 0 or more'),
];

// CRUD Endpoints for Products (Soal 2)
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', productValidation, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
