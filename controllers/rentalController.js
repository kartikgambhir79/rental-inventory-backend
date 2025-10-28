import Rental from "../models/Rental.js";
import Item from "../models/Item.js";
import Customer from "../models/Customer.js";

// 🎯 Rent an item
export const rentItem = async (req, res) => {
    try {
        const { customerId, itemCode, advancePayment, duePayment, totalPayment } = req.body;

        // ✅ Validate customer
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        // ✅ Find item
        const item = await Item.findOne({
            $or: [{ itemCode }],
        });
        if (!item) return res.status(404).json({ message: "Item not found" });
        if (!item.available) return res.status(400).json({ message: "Item not available" });

        // ✅ Create rental record
        const rental = await Rental.create({
            customerId,
            itemId: item._id,
            advancePayment,
            duePayment,
            totalPayment,
            status: "rented",
        });

        // ✅ Update item status
        item.available = false;
        item.status = "rented";
        await item.save();

        res.status(201).json({
            success: true,
            message: "Item rented successfully",
            rental,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 🎯 Return an item and collect due payment
export const returnItem = async (req, res) => {
    try {
        const { rentalId, duePaymentReceived } = req.body;

        const rental = await Rental.findById(rentalId).populate("itemId customerId");
        if (!rental) return res.status(404).json({ message: "Rental not found" });

        // ✅ Add due payment received
        rental.duePayment = Math.max(0, rental.duePayment - (duePaymentReceived || 0));
        rental.status = "returned";
        rental.returnDate = new Date();

        await rental.save();

        // ✅ Update item status
        const item = rental.itemId;
        item.available = true;
        item.status = "available";
        await item.save();

        res.json({
            success: true,
            message: "Item returned successfully and due payment recorded",
            rental,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 📋 Get all rentals
export const getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find()
            .populate("itemId")
            .populate("customerId")
            .sort({ createdAt: -1 });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
