import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: [true, 'Product price is required'],
    min: [0.01, 'Price must be at least 0.01']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.price = parseFloat(ret.price.toString());
      return ret;
    }
  }
});

export default mongoose.model('Product', productSchema);