import GlobalDiscount from "../models/GlobalDiscount.js";

// Keep a cached global discount for a short TTL to avoid excessive DB hits.
let cachedGlobalDiscount = null;
let cachedTimestamp = null; // Date object
const GLOBAL_DISCOUNT_CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export const applyDiscount = async (product) => {
  const now = new Date();

  // Refresh cache only when expired or not set.
  if (
    !cachedGlobalDiscount ||
    !cachedTimestamp ||
    now.getTime() - cachedTimestamp.getTime() >= GLOBAL_DISCOUNT_CACHE_TTL_MS
  ) {
    cachedGlobalDiscount = await GlobalDiscount.findOne({
      isActive: true,
      expiresAt: { $gte: now },
    });
    cachedTimestamp = new Date();
  }

  let finalPrice = product.price;
  let appliedDiscount = 0;

  // Apply per-product 'upto' discount if defined
  if (product.discountRate && product.discountType && product.discountType !== "none") {
    appliedDiscount = product.discountRate;
    finalPrice = Math.floor(product.price * (1 - appliedDiscount / 100));
  } else if (cachedGlobalDiscount && cachedGlobalDiscount.discountValue > 0) {
    // Only apply global discount when it applies for this product. The GlobalDiscount
    // has an `appliedFor` field (default: "ALL_PRODUCTS"). Apply the discount if:
    // - appliedFor === "ALL_PRODUCTS"
    // - OR appliedFor matches the product's category
    // - OR appliedFor matches product._id (in case discounts are applied per-product)
    const appliedFor = cachedGlobalDiscount.appliedFor;
    const appliesToProduct =
      appliedFor === "ALL_PRODUCTS" ||
      (product.category && appliedFor === product.category) ||
      (product._id && appliedFor === String(product._id));

    if (appliesToProduct) {
      appliedDiscount = cachedGlobalDiscount.discountValue;
      finalPrice = Math.floor(product.price * (1 - appliedDiscount / 100));
    }
  }

  return {
    ...product.toObject(),
    originalPrice: product.price,
    finalPrice,
    appliedDiscount,
  };
};

// Allow controllers to invalidate cache after modifying global discount entities.
export const invalidateGlobalDiscountCache = () => {
  cachedGlobalDiscount = null;
  cachedTimestamp = null;
};
