import Item from "../models/Item.js";
import bwipjs from "bwip-js";
import fs from "fs";
import path from "path";

// Helper: Generate barcode image
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

// 📌 Create new item
export const createItem = async (req, res) => {
    try {
        const { name, category, size, color, pricePerDay, rfidTag, identifierType } = req.body;

        const itemCode = `ITEM-${Date.now()}`;
        const barcodePath = await generateBarcode(itemCode);

        const item = await Item.create({
            name,
            category,
            size,
            color,
            pricePerDay,
            rfidTag: rfidTag || null,
            itemCode,
            barcodeImage: barcodePath,
            identifierType: identifierType || "BARCODE",
        });

        res.status(201).json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get all items
export const getAllItems = async (req, res) => {
    const items = await Item.find();
    res.json(items);
};

// 📌 Get item by barcode or RFID
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

// 📌 Update item
export const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📌 Delete item
export const deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
