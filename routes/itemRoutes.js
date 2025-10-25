import express from "express";
import {
    createItem,
    getAllItems,
    getItemByCode,
    updateItem,
    deleteItem,
} from "../controllers/itemController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/", protect, createItem);
router.get("/", protect, getAllItems);
router.get("/code/:code", protect, getItemByCode);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, adminOnly, deleteItem);

export default router;
