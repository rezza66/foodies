import fs from "fs";
import path from "path";
import Product from "../models/productModel.js";

export const getProducts = async (req, res, next) => {
  try {
    const { category, tags, name, page = 1, limit = 10 } = req.query;

    let filter = {};

    // Gunakan langsung ObjectId kategori jika tersedia
    if (category) {
      filter.category = category;
    }

    if (tags) filter.tags = { $in: tags.split(",") };
    if (name) filter.name = { $regex: name, $options: "i" };

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate total count and paginate
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category")
      .populate("tags")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
    const productsWithImageUrl = products.map((product) => {
      const imagePath = product.image.replace(/^uploads\/|\\/g, "/");
      const formattedImageUrl = baseUrl + imagePath.replace(/^uploads\//, "");
      return {
        ...product._doc,
        image: formattedImageUrl,
      };
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    res.status(200).json({ products: productsWithImageUrl, count, totalPages, currentPage: pageNumber });
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
};




export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("tags");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export async function createProduct(req, res, next) {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.file ? req.file.path : "",
      category: req.body.category,
      tags: req.body.tags,
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.file ? req.file.path : req.body.image,
      category: req.body.category,
      tags: req.body.tags,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    )
      .populate("category")
      .populate("tags");

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.file && req.body.old_image) {
      const filePath = path.join(process.cwd(), "uploads", req.body.old_image);
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted old image: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting old image: ${err}`);
      }
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image) {
      const filePath = path.join(process.cwd(), product.image);
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted product image: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting product image: ${err}`);
      }
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
}
