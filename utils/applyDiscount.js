import GlobalDiscount from "../models/GlobalDiscount.js";

let cachedGlobalDiscount = null;
let cachedTimestamp = null;

export const applyDiscount = async (product) => {
  const now = new Date();

  if (!cachedGlobalDiscount || cachedTimestamp < now) {
    cachedGlobalDiscount = await GlobalDiscount.findOne({
      isActive: true,
      expiresAt: { $gte: now },
    });
    cachedTimestamp = now;
  }

  let finalPrice = product.price;
  let appliedDiscount = 0;

  if (product.discountRate && product.discountType !== "none") {
    appliedDiscount = product.discountRate;
    finalPrice = Math.floor(product.price * (1 - appliedDiscount / 100));
  } else if (cachedGlobalDiscount) {
    appliedDiscount = cachedGlobalDiscount.discountValue;
    finalPrice = Math.floor(product.price * (1 - appliedDiscount / 100));
  }

  return {
    ...product.toObject(),
    originalPrice: product.price,
    finalPrice,
    appliedDiscount,
  };
};
