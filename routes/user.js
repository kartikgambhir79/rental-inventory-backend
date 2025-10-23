import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import auth, { adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(auth, adminOnly, getUsers)
    .post(auth, adminOnly, createUser);

router.route('/:id')
    .get(auth, adminOnly, getUserById)
    .put(auth, adminOnly, updateUser)
    .delete(auth, adminOnly, deleteUser);

export default router;
