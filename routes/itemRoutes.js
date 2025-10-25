import express from "express";
import {
    createItem,
    getAllItems,
    getItemByCode,
    updateItem,
    deleteItem,
} from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getAllItems);
router.get("/code/:code", getItemByCode);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
