import Product from "../models/Product";

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
    const products = await Product.find({ deletedAt: null }).sort({
      createdAt: -1,
    });

    if (!products) {
      return res.status(404).json({ message: "No Products Found..." });
    }

    return res
      .status(200)
      .json({ message: "Products Fetched Successfully", data: products });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server Error...", data: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: "Product not Found..." });
    }

    return res
      .status(200)
      .json({ message: "Product Fetched Successfully...", data: product });
  } catch (error) {
    console.log(console.error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};

export const getFeaturedProduct = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });

    if (!products) {
      return res
        .status(404)
        .json({ message: "Unable to Find Featured Products..." });
    }

    return res.status(200).json({
      message: "Featured Products Found Successfully...",
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await Product.find({ category });

    if (!products) {
      return res
        .status(404)
        .json({ message: "Your Preferred Ctegory doesn't exits..." });
    }

    return res
      .status(200)
      .json({ message: "Products Found Sucessfully...", data: products });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: -1 }).limit(10);

    if (!product) {
      return res.status(404).json({ message: "No Latest Product Found...." });
    }

    return res.status(200).json({
      message: "Latest Product Fetched Siccessfully...",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
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
