import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all products (including unapproved)
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).populate('farmer', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('buyer', 'name email').populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
router.get('/reports/sales', protect, admin, async (req, res) => {
  try {
    const salesReport = await Order.aggregate([
      {
        $match: { status: 'delivered' },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.json(salesReport[0] || { totalSales: 0, totalOrders: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user registration report
// @route   GET /api/admin/reports/users
// @access  Private/Admin
router.get('/reports/users', protect, admin, async (req, res) => {
  try {
    const userReport = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(userReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get system health status
// @route   GET /api/admin/system/health
// @access  Private/Admin
router.get('/system/health', protect, admin, async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

    // Get uptime
    const uptime = process.uptime();

    // Get memory usage
    const memUsage = process.memoryUsage();

    res.json({
      status: 'OK',
      database: dbStatus,
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
      memory: {
        rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get activity logs summary
// @route   GET /api/admin/logs/activity
// @access  Private/Admin
router.get('/logs/activity', protect, admin, async (req, res) => {
  try {
    // Recent user registrations
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    // Recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer', 'name')
      .select('totalAmount status createdAt');

    // Recent products
    const recentProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('farmer', 'name')
      .select('name price isApproved createdAt');

    res.json({
      recentUsers,
      recentOrders,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get advanced reports
// @route   GET /api/admin/reports/advanced
// @access  Private/Admin
router.get('/reports/advanced', protect, admin, async (req, res) => {
  try {
    // Product approval rates
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: '$isApproved',
          count: { $sum: 1 },
        },
      },
    ]);

    // Order status distribution
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly sales trend (last 6 months)
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.json({
      productStats,
      orderStats,
      monthlySales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
