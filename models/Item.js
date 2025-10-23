import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  sku: String,
  name: String,
  category: String,
  size: String,
  price: Number,
  qty: Number,
  img: String
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
