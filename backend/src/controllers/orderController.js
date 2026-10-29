import Order from '../models/Order.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public / Optional Auth
export const createOrder = async (req, res, next) => {
  try {
    const { customerInfo, items, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.address) {
      return res.status(400).json({
        success: false,
        message: 'Customer shipping information is incomplete',
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : undefined,
      customerInfo,
      items,
      paymentMethod: paymentMethod || 'bank',
      totalAmount,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Public / Protected
export const getOrderById = async (req, res, next) => {
  try {
    const param = req.params.id;
    let order;

    if (param.startsWith('ORD-')) {
      order = await Order.findOne({ orderNumber: param });
    } else {
      order = await Order.findById(param);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

