import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getFeaturedProduct,
  getLatestProducts,
  getProductByCategory,
  updateProducts,
  deactivateProduct,
  deleteProductPermanently,
  getDeactivatedProducts,
  addUptoDiscount,
  createFlatDiscounts,
  updateFlatDiscount,
  activateDeactivateDiscount,
  removeFlatDiscount,
  createUpdateFeaturedProduct,
  removeUptoDiscount,
  activeDeactiveProduct,
  getAllFlatDiscounts,
} from "../controllers/productController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/id/:id", getProductById);
router.get("/featured-product", getFeaturedProduct);
router.get("/category/:category", getProductByCategory);
router.get("/latest-product", getLatestProducts);
router.get(
  "/deactivated-products",
  protect,
  authorizeRoles("admin"),
  getDeactivatedProducts
);
router.get(
  "/flat-discounts",
  protect,
  authorizeRoles("admin"),
  getAllFlatDiscounts
);

router.post(
  "/create",
  protect,
  authorizeRoles("admin"),
  upload.array("images"),
  createProduct
);
router.post(
  "/add-discount/:id",
  protect,
  authorizeRoles("admin"),
  addUptoDiscount
);
router.post(
  "/flat-discount",
  protect,
  authorizeRoles("admin"),
  createFlatDiscounts
);

router.put(
  "/update-product/:id",
  protect,
  authorizeRoles("admin"),
  updateProducts,
  upload.array("images")
);
router.put(
  "/active-deactive-product/:id",
  protect,
  authorizeRoles("admin"),
  activeDeactiveProduct
);
router.put(
  "/active-deactive-flat-discount/:id",
  protect,
  authorizeRoles("admin"),
  activateDeactivateDiscount
);
router.put(
  "/update-flat-discount/:id",
  protect,
  authorizeRoles("admin"),
  updateFlatDiscount
);
router.put(
  "/add-feature-product/:id",
  protect,
  authorizeRoles("admin"),
  createUpdateFeaturedProduct
);
router.put(
  "/remove-upto-discount/:id",
  protect,
  authorizeRoles("admin"),
  removeUptoDiscount
);

router.delete(
  "/deactivate-product/:id",
  protect,
  authorizeRoles("admin"),
  deactivateProduct
);
router.delete(
  "/delete-product/:id",
  protect,
  authorizeRoles("admin"),
  deleteProductPermanently
);
router.delete(
  "/remove-flat-discount/:id",
  protect,
  removeFlatDiscount
);

export default router;
