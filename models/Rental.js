import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    rentDate: {
        type: Date,
        default: Date.now
    },
    returnDate: Date,
    advancePayment: {
        type: Number,
        required: true,
        default: 0
    },
    duePayment: {
        type: Number,
        default: 0
    },
    totalPayment: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['rented', 'returned'],
        default: 'rented'
    }
}, {
    timestamps: true
});
export default mongoose.model('Rental', schema);