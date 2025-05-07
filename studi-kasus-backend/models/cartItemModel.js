import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [5, 'Panjang nama makanan minimal 5 karakter'],
        required: true,
        trim: true
    },
    qty: {
        type: Number,
        required: [true, 'Qty harus diisi'],
        min: [1, 'Minimal qty adalah 1'] // Gunakan min bukan minlength
    },
    price: {
        type: Number, // Ubah dari String ke Number
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
