import Item from "../models/Item.js";
import bwipjs from "bwip-js";
import fs from "fs";
import path from "path";

// ---------- Helper: Generate barcode ----------
async function generateBarcode(itemCode) {
    const png = await bwipjs.toBuffer({
        bcid: "code128",
        text: itemCode,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
    });

    const dir = "./uploads/barcodes";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${itemCode}.png`);
    fs.writeFileSync(filePath, png);
    return filePath.replace(/\\/g, "/");
}

// ---------- Create new item (with image upload) ----------
export const createItem = async (req, res) => {
    try {
        const { name, category, size, color, rent, identifierType } = req.body;

        if (!name || !category || !rent) {
            return res.status(400).json({ success: false, message: "Name, category, and rent are required." });
        }

        // ✅ Ensure directories exist
        const imageDir = "./uploads/images";
        const barcodeDir = "./uploads/barcodes";
        [imageDir, barcodeDir].forEach((dir) => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });

        // ✅ Handle image upload (from multer)
        let imagePath = null;
        if (req.file) imagePath = req.file.path.replace(/\\/g, "/");

        // ✅ Generate unique barcode
        const itemCode = `ITEM-${Date.now()}`;
        const barcodePath = await generateBarcode(itemCode);

        // ✅ Save item to DB
        const item = await Item.create({
            name,
            category,
            size,
            color,
            rent,
            itemCode,
            barcodeImage: barcodePath,
            productImage: imagePath,
            identifierType: identifierType || "BARCODE",
        });

        res.status(201).json({ success: true, item });
    } catch (error) {
        console.error("❌ Create Item Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------- Get all items ----------
export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json({ success: true, items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ---------- Get item by barcode or RFID ----------
export const getItemByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const item = await Item.findOne({
            $or: [{ itemCode: code }],
        });
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });
        res.json({ success: true, item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ---------- Update item (with optional image) ----------
export const updateItem = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.productImage = req.file.path.replace(/\\/g, "/");

        const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        res.json({ success: true, item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ---------- Delete item ----------
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        // Optional: delete uploaded images
        if (item.productImage && fs.existsSync(item.productImage)) fs.unlinkSync(item.productImage);
        if (item.barcodeImage && fs.existsSync(item.barcodeImage)) fs.unlinkSync(item.barcodeImage);

        res.json({ success: true, message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
