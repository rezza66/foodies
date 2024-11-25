import mongoose from "mongoose";

const deliveryAddressSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama alamat harus diisi"],
      maxLength: [255, "Panjang maksimal nama alamat 255 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "Kelurahan alamat harus diisi"],
      maxLength: [255, "Panjang maksimal kelurahan alamat 255 karakter"],
    },
    kecamatan: {
      type: String,
      required: [true, "Kecamatan alamat harus diisi"],
      maxLength: [255, "Panjang maksimal kecamatan alamat 255 karakter"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten alamat harus diisi"],
      maxLength: [255, "Panjang maksimal kabupaten alamat 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "Provinsi alamat harus diisi"],
      maxLength: [255, "Panjang maksimal provinsi alamat 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "Detail alamat harus diisi"],
      maxLength: [1000, "Panjang maksimal detail alamat 1000 karakter"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryAddress", deliveryAddressSchema);
