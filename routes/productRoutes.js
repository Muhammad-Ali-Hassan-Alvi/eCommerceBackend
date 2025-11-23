import express from "express";
import { authorizeRoles, protect } from "../middlewares/authMiddleware";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getFeaturedProduct,
  getLatestProducts,
  getProductByCategory,
  getLatestProducts,
  updateProducts,
  deactivateProduct,
  deleteProductPermanently,
  getDeactivatedProducts,
  activeProduct,
  addUptoDiscount,
  createFlatDiscounts,
  updateFlatDiscount,
  activateDeactivateDiscount,
  removeFlatDiscount,
} from "../controllers/productController";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/featured-product", getFeaturedProduct);
router.get("/:category", getProductByCategory);
router.get("/latest-product", getLatestProducts);
router.get(
  "/deactivated-products",
  protect,
  authorizeRoles("admin"),
  getDeactivatedProducts
);

router.post(
  "/create",
  protect,
  authorizeRoles("admin"),
  upload.array("images"),
  createProduct
);
router.post("/add-discount", protect, authorizeRoles("admin"), addUptoDiscount);
router.post(
  "/flat-discount",
  protect,
  authorizeRoles("admin"),
  createFlatDiscounts
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateProducts,
  upload.array("images")
);
router.put("/:id", protect, authorizeRoles("admin"), activeProduct);
router.put(
  "/active-deactive-product/:id",
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
  authorizeRoles("admin"),
  removeFlatDiscount
);

export default router;
