import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    rentDate: { type: Date, default: Date.now },
    returnDate: Date,
    rentDays: Number,
    totalAmount: Number,
    status: { type: String, enum: ["Rented", "Returned"], default: "Rented" },
  },
  { timestamps: true }
);

export default mongoose.model("Rental", rentalSchema);
