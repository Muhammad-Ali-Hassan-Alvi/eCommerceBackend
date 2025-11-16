import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    deactivatedAt: {
      type: Date,
      default: null,
    },
    sold: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ["upto", "flat", "none"],
      default: "none",
    },
    discountRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isModified("description")) {
    this.keywords = [
      ...new Set(
        (this.name + " " + this.description)
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 2)
      ),
    ];
  }

  next();
});

export default mongoose.model("Product", productSchema);
