import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  sku: String,
  qty: Number,
  deposit: Number,
  status: { type: String, default: 'rented' },
  rentedOn: { type: Date, default: Date.now },
  dueOn: Date,
  returnedOn: Date
}, { timestamps: true });

export default mongoose.model('Rental', rentalSchema);
