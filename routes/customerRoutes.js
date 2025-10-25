import express from "express";
import {
    createCustomer,
    getCustomers,
    getCustomerById,
    deleteCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, createCustomer);
router.get("/", protect, getCustomers);
router.get("/:id", protect, getCustomerById);
router.delete("/:id", protect, deleteCustomer);

export default router;
