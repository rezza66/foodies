import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [5, "Panjang nama makanan minimal 5 karakter"],
    required: [true, "Nama Makanan harus diisi"],
  },
  price: {
    type: Number,
    required: [true, "Harga Item harus diisi"],
  },
  qty: {
    type: Number,
    required: [true, "Kuatiti harus diisi"],
    min: [1, "Kuantiti miniaml 1"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
});

export default mongoose.model = ("OrderItem", orderItemSchema);
