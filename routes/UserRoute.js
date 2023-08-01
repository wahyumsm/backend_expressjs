import express from "express";
import {
  getUsers,
  getUserById,
  CreateUsers,
  UpdateUser,
  DeleteUser,
} from "../controllers/Users.js"; // Corrected import
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, getUsers, adminOnly);
router.get("/users/:id", verifyUser, getUserById, adminOnly);
router.post("/users", verifyUser, CreateUsers, adminOnly);
router.patch("/users/:id", verifyUser, UpdateUser, adminOnly);
router.delete("/users/:id", verifyUser, DeleteUser, adminOnly);

export default router;
