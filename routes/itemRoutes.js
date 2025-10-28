import express from "express";
import multer from "multer";
import {
    createItem,
    getAllItems,
    getItemByCode,
    updateItem,
    deleteItem,
} from "../controllers/itemController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/images"),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + file.originalname;
        cb(null, unique);
    },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createItem);
router.get("/", getAllItems);
router.get("/:code", getItemByCode);
router.put("/:id", upload.single("image"), updateItem);
router.delete("/:id", deleteItem);

export default router;
