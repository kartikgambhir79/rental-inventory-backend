import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createCategory);
router.get("/", protect, getCategories);

export default router;
