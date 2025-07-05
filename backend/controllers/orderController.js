import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderConfirmationEmail } from "../utils/emailSender.js";
import { safeConvertDecimal } from "../utils/convertUtils.js";

// Update getOrders function
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { "consumerId.name": { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate({
        path: "consumerId",
        select: "name email",
      })
      .populate({
        path: "products.productId",
        select: "title price images discount",
      })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "consumerId",
        select: "name email",
      })
      .populate({
        path: "products.productId",
        select: "title price images",
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Paid", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate({
        path: "consumerId",
        select: "name email",
      })
      .populate({
        path: "products.productId",
        select: "title price images",
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If order is cancelled, restore stock
    if (status === "Cancelled") {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Get sales reports
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchStage = { status: "Completed" };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const report = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: "$products.quantity" },
          averageOrderValue: { $avg: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalOrders: 1,
          totalItemsSold: 1,
          averageOrderValue: { $round: ["$averageOrderValue", 2] },
        },
      },
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          title: "$product.title",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // Get sales by category
    const salesByCategory = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] },
          },
          totalItems: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Get sales over time (daily)
    const salesOverTime = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      report: report[0] || {
        totalSales: 0,
        totalOrders: 0,
        totalItemsSold: 0,
        averageOrderValue: 0,
      },
      topProducts,
      salesByCategory,
      salesOverTime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate sales report",
      error: error.message,
    });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { contact, address, products, totalAmount } = req.body;

    // Validate request body
    if (!contact || !address || !products || !totalAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: contact, address, products, or totalAmount",
      });
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products must be a non-empty array",
      });
    }

    // Validate each product
    const productValidationErrors = [];
    for (const [index, item] of products.entries()) {
      if (!item.productId) {
        productValidationErrors.push(
          `Product at index ${index} is missing productId`
        );
        continue;
      }

      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        productValidationErrors.push(
          `Invalid product ID format: ${item.productId}`
        );
        continue;
      }

      // Find product
      const product = await Product.findById(item.productId);
      if (!product) {
        productValidationErrors.push(`Product not found: ${item.productId}`);
        continue;
      }

      // Check stock
      if (product.stock < item.quantity) {
        productValidationErrors.push(
          `Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }
    }

    if (productValidationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Product validation failed",
        errors: productValidationErrors,
      });
    }

    // Add this at the start of createOrder function
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }
    

    // Create order
    const order = new Order({
      consumerId: req.user._id,
      contact,
      address,
      products: products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        originalPrice: item.price, // Store original price
        price: item.price,
        discount: item.discount || 0 // Store discount percentage
      })),
      totalAmount,
      status: "Pending",
    });

    await order.save();

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    let message = "Failed to create order";

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((val) => val.message);
      message = `Validation error: ${errors.join(", ")}`;
    } else if (error.name === "CastError") {
      message = `Invalid data format: ${error.path}`;
    }

    res.status(500).json({
      success: false,
      message,
      error: error.message,
    });
  }
};

// Update processPayment function
export const processPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("consumerId", "email name")
      .populate("products.productId", "title price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Order already ${order.status.toLowerCase()}`,
      });
    }

    // Reduce product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Update order status
    order.status = "Paid";
    await order.save();

    // Prepare order data for email - ADD DISCOUNT FIELDS
    const emailOrderData = {
      _id: order._id,
      consumerId: {
        name: order.consumerId.name
      },
      contact: order.contact,
      address: order.address,
      products: order.products.map(item => ({
        productId: {
          title: item.productId.title
        },
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,  // Add original price
        discount: item.discount              // Add discount percentage
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt
    };

    // Send email
    if (order.consumerId?.email) {
      await sendOrderConfirmationEmail(order.consumerId.email, emailOrderData);
    }

    res.json({
      success: true,
      message: "Payment processed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message,
    });
  }
};
// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Validate order ID format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(orderId)
      .populate('consumerId', 'name email')
      .populate('products.productId', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Debug: Log order structure
    console.log('Order consumer:', order.consumerId);
    console.log('Order totalAmount type:', typeof order.totalAmount);

    // Handle missing consumer safely
    const consumerId = order.consumerId?._id?.toString();
    if (!consumerId || consumerId !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own orders'
      });
    }

    // Convert to plain JS object with safe conversions
    const formattedOrder = {
      _id: order._id,
      contact: order.contact,
      address: order.address,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      totalAmount: safeConvertDecimal(order.totalAmount),
      consumerId: {
        _id: order.consumerId._id,
        name: order.consumerId.name,
        email: order.consumerId.email
      },
      products: order.products.map(item => ({
        _id: item._id,
        quantity: item.quantity,
        originalPrice: safeConvertDecimal(item.originalPrice),  // Add this
        price: safeConvertDecimal(item.price),
        discount: item.discount,  // Add this
        productId: item.productId ? {
          _id: item.productId._id,
          title: item.productId.title,
          images: item.productId.images
        } : null
      }))
    };

    res.json({
      success: true,
      order: formattedOrder
    });

  } catch (error) {
    console.error('Order details error:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};