import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    size: String,
    color: String,
    pricePerDay: Number,

    // Identification
    itemCode: { type: String, unique: true, required: true },
    barcodeImage: String,
    rfidTag: { type: String, unique: true, sparse: true },
    identifierType: { type: String, enum: ["BARCODE", "RFID", "MANUAL"], default: "BARCODE" },

    // Status
    available: { type: Boolean, default: true },
    status: { type: String, default: "Available" },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
