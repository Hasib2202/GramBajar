import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  consumerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required']
  },
  address: {
    type: String,
    required: [true, 'Delivery address is required']
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true
    }
  }],
  totalAmount: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.totalAmount = parseFloat(ret.totalAmount.toString());
      ret.products = ret.products.map(p => ({
        ...p,
        price: parseFloat(p.price.toString())
      }));
      return ret;
    }
  }
});

export default mongoose.model('Order', orderSchema);