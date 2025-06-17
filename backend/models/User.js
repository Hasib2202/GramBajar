import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['Admin', 'Consumer'], default: 'Consumer' },
  image: { type: String, default: null },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);