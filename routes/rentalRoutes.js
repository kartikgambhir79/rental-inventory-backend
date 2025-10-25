import express from "express";
import { rentItem, returnItem, getAllRentals } from "../controllers/rentalController.js";

const router = express.Router();

router.post("/rent", rentItem);
router.post("/return", returnItem);
router.get("/", getAllRentals);

export default router;
