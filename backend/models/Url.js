// models/Url.js
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // Auto-delete after 7 days
});

export default mongoose.model('Url', urlSchema);