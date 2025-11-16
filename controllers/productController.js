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
    const products = await Product.find({ isActive: null }).sort({
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



// Update for Tomorrow (INSHALLAH):
// 1. Create a Global Discount for the Flat sales...
// 2. Change the API for the getAllProducts and the getProductByID api to accomodate Global Discount (Flat off) -> Update the Price to get the Global Price first if there is any.... 