import express from "express";
import formidable from "express-formidable";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";
import {
  addProduct,
  addProductReview,
  fetchAllProducts,
  fetchNewProducts,
  fetchProductById,
  fetchProducts,
  fetchTopProducts,
  filterProducts,
  removeProduct,
  updateProductDetails,
  updateProductImage,
} from "../controllers/product.controller.js";
import { checkId } from "../middlewares/checkId.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Static & special routes (should be on top)
router.route("/allproducts").get(fetchAllProducts);
router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);
router.route("/filtered-products").post(filterProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// Routes with image upload
router
  .route("/:id/image")
  .put(
    authenticate,
    authorizeAdmin,
    upload.single("image"),
    updateProductImage
  );

// Dynamic product routes (should come after more specific routes)
router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

// Product creation and product listing
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, upload.single("image"), addProduct);

export default router;
