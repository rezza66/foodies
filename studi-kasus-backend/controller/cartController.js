import Cart from "../models/cartItemModel.js";
import mongoose from "mongoose";

// **Menambahkan item ke cart atau memperbarui qty jika sudah ada**
export const createCart = async (req, res) => {
  try {
    console.log("📥 Data yang diterima di backend:", req.body);
    const { name, qty, price, image, product } = req.body;
    const user = req.user.id; // Ambil user ID dari middleware

    // **Validasi input tidak boleh kosong**
    if (!name || !qty || !price || !image || !product) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // **Validasi ID agar tidak error**
    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // **Pastikan qty >= 1**
    if (qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // **Cek apakah produk sudah ada di cart user**
    let existingCartItem = await Cart.findOne({ user, product });

    if (existingCartItem) {
      existingCartItem.qty += qty;
      await existingCartItem.save();

      return res.status(200).json({
        message: "Cart updated successfully",
        cartItem: existingCartItem,
      });
    }

    // **Buat cart baru jika produk belum ada di cart**
    const newCart = new Cart({ name, qty, price, image, user, product });
    await newCart.save();

    res.status(201).json({ message: "Product added to cart", cartItem: newCart });
  } catch (error) {
    console.error("❌ Error in createCart:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

// **Mengambil semua item cart berdasarkan user**
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil user ID dari middleware

    // Ambil semua item cart berdasarkan user
    const cartItems = await Cart.find({ user: userId }).populate(
      "product",
      "name price image"
    );

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("❌ Error in getCart:", error.message);
    res.status(500).json({ message: "Failed to fetch cart items", error });
  }
};

// **Memperbarui jumlah item dalam cart**
export const updateCart = async (req, res) => {
  const { id } = req.params; // Pastikan ID yang digunakan adalah ID cart
  const { qty } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }

    const cartItem = await Cart.findById(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.qty = qty;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    console.error("❌ Error in updateCart:", error.message);
    res.status(500).json({ message: "Failed to update cart item", error });
  }
};

// **Menghapus item dari cart berdasarkan ID cart**
export const deleteCart = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }

    const cartItem = await Cart.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item removed successfully", cartItem });
  } catch (error) {
    console.error("❌ Error in deleteCart:", error.message);
    res.status(500).json({ message: "Failed to remove cart item", error });
  }
};
