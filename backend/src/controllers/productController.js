import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Product from '../models/Product.js';

// Helper to find product by numeric customId OR mongoose ObjectId
const findProductByIdOrCustomId = async (idParam) => {
  if (!isNaN(idParam)) {
    // If param is a number (e.g. "1", "2")
    const productByNum = await Product.findOne({ customId: Number(idParam) });
    if (productByNum) return productByNum;
  }
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return await Product.findById(idParam);
  }
  return null;
};

// @desc    Fetch all products (with search, category filter, sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, sort } = req.query;
    const query = {};

    // Filter by Category
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // Filter by Featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Keyword Search
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { 'name.en': regex },
        { 'name.id': regex },
        { 'description.en': regex },
        { 'description.id': regex },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID or customId
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await findProductByIdOrCustomId(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => e.msg),
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      rating,
      emoji,
      bg,
      image,
      featured,
    } = req.body;

    // Normalize name and description if plain string passed
    const normalizedName =
      typeof name === 'string' ? { en: name, id: name } : name;
    const normalizedDesc =
      typeof description === 'string'
        ? { en: description, id: description }
        : description || { en: '', id: '' };

    // Determine customId (auto increment or max + 1)
    const lastProduct = await Product.findOne().sort({ customId: -1 });
    const customId = lastProduct && lastProduct.customId ? lastProduct.customId + 1 : 1;

    const product = new Product({
      customId,
      name: normalizedName,
      description: normalizedDesc,
      price,
      category,
      stock,
      rating: rating || 0,
      emoji: emoji || '📦',
      bg: bg || '#f3f4f6',
      image: image || '',
      featured: featured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => e.msg),
      });
    }

    const product = await findProductByIdOrCustomId(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      rating,
      emoji,
      bg,
      image,
      featured,
    } = req.body;

    if (name) {
      product.name = typeof name === 'string' ? { en: name, id: name } : name;
    }
    if (description) {
      product.description =
        typeof description === 'string'
          ? { en: description, id: description }
          : description;
    }
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (rating !== undefined) product.rating = rating;
    if (emoji !== undefined) product.emoji = emoji;
    if (bg !== undefined) product.bg = bg;
    if (image !== undefined) product.image = image;
    if (featured !== undefined) product.featured = featured;

    const updatedProduct = await product.save();
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await findProductByIdOrCustomId(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

