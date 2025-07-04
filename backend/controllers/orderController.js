import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/emailSender.js';

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { 'consumerId.name': { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await Order.find(query)
      .populate({
        path: 'consumerId',
        select: 'name email'
      })
      .populate({
        path: 'products.productId',
        select: 'title price images'
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'consumerId',
        select: 'name email'
      })
      .populate({
        path: 'products.productId',
        select: 'title price images'
      });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Paid', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
    .populate({
      path: 'consumerId',
      select: 'name email'
    })
    .populate({
      path: 'products.productId',
      select: 'title price images'
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // If order is cancelled, restore stock
    if (status === 'Cancelled') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get sales reports
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = { status: 'Completed' };
    
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const report = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$products' },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: '$products.quantity' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalOrders: 1,
          totalItemsSold: 1,
          averageOrderValue: { $round: ['$averageOrderValue', 2] }
        }
      }
    ]);
    
    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalQuantity: { $sum: '$products.quantity' },
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          title: '$product.title',
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ]);
    
    // Get sales by category
    const salesByCategory = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
          totalItems: { $sum: '$products.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
    
    // Get sales over time (daily)
    const salesOverTime = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json({
      success: true,
      report: report[0] || {
        totalSales: 0,
        totalOrders: 0,
        totalItemsSold: 0,
        averageOrderValue: 0
      },
      topProducts,
      salesByCategory,
      salesOverTime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate sales report',
      error: error.message
    });
  }
};



// Create new order
export const createOrder = async (req, res) => {
  try {
    const { contact, address, products, totalAmount } = req.body;
    
    // Validate products
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`
        });
      }
    }

    const order = new Order({
      consumerId: req.user._id,
      contact,
      address,
      products,
      totalAmount,
      status: 'Pending'
    });

    await order.save();
    
    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Process payment
export const processPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('consumerId', 'email name')
      .populate('products.productId', 'title price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate order status
    if (order.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Order already ${order.status.toLowerCase()}`
      });
    }

    // Reduce product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Update order status
    order.status = 'Paid';
    await order.save();

    // Send confirmation email
    await sendOrderConfirmationEmail(order.consumerId.email, order);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('consumerId', 'name email')
      .populate('products.productId', 'title price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get order details',
      error: error.message
    });
  }
};