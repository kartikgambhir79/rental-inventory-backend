import express from "express";
import { rentItem, returnItem, getAllRentals } from "../controllers/rentalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/rent", protect, rentItem);
router.post("/return", protect, returnItem);
router.get("/", protect, getAllRentals);

export default router;
