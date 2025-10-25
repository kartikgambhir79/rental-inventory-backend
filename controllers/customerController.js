import Customer from "../models/Customer.js";

// ➕ Create Customer
export const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address, idProofType, idProofNumber } = req.body;
        const existing = await Customer.findOne({ phone });
        if (existing) return res.status(400).json({ message: "Customer already exists" });

        const customer = await Customer.create({
            name,
            phone,
            email,
            address,
            idProofType,
            idProofNumber,
        });
        res.status(201).json({ success: true, customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 📄 Get All Customers
export const getCustomers = async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
};

// 📄 Get Customer by ID
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🗑️ Delete Customer
export const deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
