import Rental from "../models/Rental.js";
import Item from "../models/Item.js";
import Customer from "../models/Customer.js";

// 📦 Rent an item
export const rentItem = async (req, res) => {
    try {
        const { customerId, itemCode, rentDays } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        const item = await Item.findOne({
            $or: [{ itemCode }, { rfidTag: itemCode }],
        });
        if (!item) return res.status(404).json({ message: "Item not found" });
        if (!item.available) return res.status(400).json({ message: "Item not available" });

        const totalAmount = item.pricePerDay * rentDays;

        const rental = await Rental.create({
            customerId: customer._id,
            itemId: item._id,
            rentDays,
            totalAmount,
        });

        item.available = false;
        item.status = "Rented";
        await item.save();

        res.status(201).json({ success: true, rental });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 📦 Return an item
export const returnItem = async (req, res) => {
    try {
        const { rentalId } = req.body;
        const rental = await Rental.findById(rentalId).populate("itemId customerId");
        if (!rental) return res.status(404).json({ message: "Rental not found" });

        rental.status = "Returned";
        rental.returnDate = new Date();
        await rental.save();

        const item = rental.itemId;
        item.available = true;
        item.status = "Available";
        await item.save();

        res.json({ success: true, rental });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 📋 Get All Rentals
export const getAllRentals = async (req, res) => {
    const rentals = await Rental.find()
        .populate("itemId")
        .populate("customerId");
    res.json(rentals);
};
