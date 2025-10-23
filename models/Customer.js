import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  notes: String
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
