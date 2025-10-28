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
    return filePath;
}

// ---------- Create new item (with image upload) ----------
export const createItem = async (req, res) => {
    try {
        const {
            name,
            category,
            size,
            color,
            rent,
            rfidTag,
            identifierType,
        } = req.body;

        // Handle image upload (from multer)
        let imagePath = null;
        if (req.file) {
            const dir = "./uploads/images";
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            imagePath = req.file.path.replace(/\\/g, "/"); // normalize path for all OS
        }

        // Generate barcode
        const itemCode = `ITEM-${Date.now()}`;
        const barcodePath = await generateBarcode(itemCode);

        // Save item to database
        const item = await Item.create({
            name,
            category,
            size,
            color,
            rent,
            rfidTag: rfidTag || null,
            itemCode,
            barcodeImage: barcodePath,
            productImage: imagePath, // 👈 store uploaded image path
            identifierType: identifierType || "BARCODE",
        });

        res.status(201).json({ success: true, item });
    } catch (error) {
        console.error("Create Item Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------- Get all items ----------
export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ---------- Get item by barcode or RFID ----------
export const getItemByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const item = await Item.findOne({
            $or: [{ itemCode: code }, { rfidTag: code }],
        });
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ---------- Update item (with optional image) ----------
export const updateItem = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If new image is uploaded, replace the old one
        if (req.file) {
            updateData.productImage = req.file.path.replace(/\\/g, "/");
        }

        const item = await Item.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ---------- Delete item ----------
export const deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
