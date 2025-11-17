import GlobalDiscount from "../models/GlobalDiscount";
import Product from "../models/Product";
import { applyDiscount } from "../utils/applyDiscount.js";

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;

    const imageUrls = req.files.map((file) => file.path);

    if (!name || !category || !price || !description || !stock) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const product = new Product({
      name,
      price,
      description,
      stock,
      category,
      discountType: "none",
      discountRate: 0,
      image: imageUrls,
    });

    await product.save();

    if (!product) {
      return res
        .status(400)
        .json({ message: "Unable to create new Product", data: error.message });
    }

    return res
      .status(201)
      .json({ message: "Product Created Successfully", data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!products?.length) {
      return res.status(404).json({ message: "No Products Found..." });
    }

    const updatedProducts = await Promise.all(
      products.map((product) => applyDiscount(product))
    );

    return res.status(200).json({
      message: "Products Fetched Successfully",
      data: updatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error...",
      data: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not Found..." });
    }

    const updatedProduct = await applyDiscount(product);

    return res.status(200).json({
      message: "Product Fetched Successfully...",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error...",
      data: error.message,
    });
  }
};

export const getFeaturedProduct = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });

    if (!products.length) {
      return res.status(404).json({ message: "No Featured Products Found..." });
    }

    const updatedProducts = await Promise.all(
      products.map((product) => applyDiscount(product))
    );

    return res.status(200).json({
      message: "Featured Products Found Successfully...",
      data: updatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error...",
      data: error.message,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await Product.find({ category });

    if (!products.length) {
      return res.status(404).json({
        message: "No Products Found in This Category...",
      });
    }

    const updatedProducts = await Promise.all(
      products.map((product) => applyDiscount(product))
    );

    return res.status(200).json({
      message: "Products Found Successfully...",
      data: updatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error...",
      data: error.message,
    });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);

    if (!products.length) {
      return res.status(404).json({ message: "No Latest Products Found..." });
    }

    const updatedProducts = await Promise.all(
      products.map((product) => applyDiscount(product))
    );

    return res.status(200).json({
      message: "Latest Products Fetched Successfully...",
      data: updatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error...",
      data: error.message,
    });
  }
};

export const updateProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Np Product Found to Update...." });
    }

    return res.status(200).json({
      message: "Product updated successfully...",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const deactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      { id, deactivatedAt: new Date(), isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not Found..." });
    }

    return res
      .status(200)
      .json({ message: "Product DeActivated Successfully...", data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const deleteProductPermanently = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete({ id });

    if (!product) {
      return res.status(400).json({
        message: "Product Not Found...",
      });
    }

    return res
      .status(200)
      .json({ message: "Product Deleted Successfully...", data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Server...", data: error.message });
  }
};

export const getDeactivatedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: false });

    if (!products) {
      return res.status(404).json({ message: "No De-Activated Product...." });
    }

    return res.status(200).json({
      message: "De-Activated Products Found Successfully....",
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Interval Server Error", data: error.message });
  }
};

export const activeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate({ id, isActive: true });

    if (!product) {
      return res.status(404).json({ message: "Product not Found..." });
    }

    return res
      .status(200)
      .json({ message: "Product Activated Successfully...", data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const addUptoDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discountType, discountRate } = req.body;

    if (discountType === "flat") {
      return res.status(400).json({ message: "Wrong information entered..." });
    }

    if ((!discountType, !discountRate)) {
      return res
        .status(400)
        .json({ message: "Please provide Discount Type and Amount..." });
    }
    const product = await Product.findByIdAndUpdate(
      id,
      { discountType, discountRate },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not Found..." });
    }

    return res
      .status(200)
      .json({ message: "Discount Added Successfully...", data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};

export const createFlatDiscounts = async (req, res) => {
  try {
    const { discountValue, appliedFor, expiresAt } = req.body;

    if (!discountValue || !appliedFor || !expiresAt) {
      return res
        .status(400)
        .json({ message: "Please enter complete values..." });
    }

    const newFlatSale = new GlobalDiscount({
      discountValue,
      appliedFor,
      expiresAt,
    });

    await newFlatSale.save();

    if (!newFlatSale) {
      return res.status(400).json({ message: "Unable to make new Sale..." });
    }

    return res
      .status(200)
      .json({ message: "New Sale Created Successfully...", data: newFlatSale });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error..." });
  }
};

export const updateFlatDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, appliedFor, applyDiscount, expiresAt, discountType } =
      req.body;
    const updatedFlatDiscount = await GlobalDiscount.findByIdAndUpdate(
      id,
      {
        isActive,
        appliedFor,
        applyDiscount,
        expiresAt,
        discountType,
      },
      { new: true }
    );

    if (!updatedFlatDiscount) {
      return res
        .status(404)
        .json({ message: "Unable to find your Flat Discount..." });
    }

    return res.status(200).json({
      message: "Your Flat Sale is updated Successfully",
      data: updatedFlatDiscount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};

export const activateDeactivateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } =
      req.body;

    if (!isActive) {
      return res.status(400).json({ message: "Please enter all required Fields..."})
    }
    const updatedFlatDiscount = await GlobalDiscount.findByIdAndUpdate(
      id,
      {
        isActive,
      },
      { new: true }
    );

    if (!updatedFlatDiscount) {
      return res
        .status(404)
        .json({ message: "Unable to find your Flat Discount..." });
    }

    return res.status(200).json({
      message: "Your Flat Sale is updated Successfully",
      data: updatedFlatDiscount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};


export const removeFlatDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDiscount = await GlobalDiscount.findByIdAndDelete(id);

    if (!deletedDiscount) {
      return res
        .status(404)
        .json({ message: "No Discount Found to Delete..." });
    }

    return res
      .status(200)
      .json({ message: "Flat Discount Deleted Successfully..." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error });
  }
};
