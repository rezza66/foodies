import mongoose from "mongoose";
import Invoice from "./invoiceModel.js"

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "Provinsi harus diisi."] },
      kabupaten: { type: String, required: [true, "Kabupaten harus diisi."] },
      kecamatan: { type: String, required: [true, "kecamatan harus diisi."] },
      kelurahan: { type: String, required: [true, "kelurahan harus diisi."] },
      detail: { type: String },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

orderSchema.virtual("items_count").get(function () {
  return this.order_items.reduce(
    (total, item) => total + parseInt(item.qty),
    0
  );
});

orderSchema.post("save", async function () {
  const sub_total = this.order_items.reduce(
    (total, item) => (total += item.price * item.qty),
    0
  );
  const invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address,
  });
  await invoice.save();
});

export default mongoose.model("Order", orderSchema);
