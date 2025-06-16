import express from "express";
import {
  createCategory,
  listCategories,
  readCategory,
  removeCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create category (admin only)
router.route("/").post(authenticate, authorizeAdmin, createCategory);

// List all categories (public or admin — depends on your logic)
router.route("/categories").get(listCategories);

// Read, Update, Delete a category by ID (admin only)
router
  .route("/category/:id")
  .get(authenticate, authorizeAdmin, readCategory)
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, removeCategory);

export default router;
