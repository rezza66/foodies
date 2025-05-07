import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/users", protect, createUser);
router.get("/users", protect, getUsers);
router.get("/user/:id", protect, getUserById);
router.get("/users/me", protect, getUserProfile)
router.put("/user/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

export default router;
