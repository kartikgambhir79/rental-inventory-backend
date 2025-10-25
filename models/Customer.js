import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String },
        address: { type: String },
        idProofType: { type: String },   // e.g. Aadhar, Driving License
        idProofNumber: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
