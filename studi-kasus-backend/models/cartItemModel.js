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
        required: [true, 'qty harus diisi'],
        minlength: [1, 'Minimal qty adalah 1'],
        trim: true
    },
    price: {
        type: String,
        minlength: [5, 'Panjang nama makanan minimal 5 karakter'],
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    
});

export default mongoose.model('Cart', cartSchema);