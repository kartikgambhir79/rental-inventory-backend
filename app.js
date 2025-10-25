import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import itemRoutes from "./routes/itemRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import dotenv from 'dotenv';





dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/items", itemRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/customers", customerRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
