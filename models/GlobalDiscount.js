import mongoose from "mongoose";

const globalDiscountSchema = mongoose.Schema(
  {
    discountType: {
      type: String,
      enum: ["PERCENTAGE"],
      default: "PERCENTAGE",
    },
    discountValue: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    appliedFor: {
      type: String,
      default: "ALL_PRODUCTS",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GlobalDiscount", globalDiscountSchema);
