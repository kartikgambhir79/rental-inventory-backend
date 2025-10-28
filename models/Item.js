import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    size: String,
    color: String,
    rent: Number,
    // Identification
    itemCode: { type: String, unique: true, required: true },
    barcodeImage: String,
    identifierType: { type: String, enum: ["BARCODE", "RFID", "MANUAL"], default: "BARCODE" },

    // Status
    available: { type: Boolean, default: true },
    status: { type: String, default: "Available" },
    productImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
