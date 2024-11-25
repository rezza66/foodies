import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
        maxlength: [20, 'Panjang nama kategori maksimal 20 karakter'],
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    
});

export default mongoose.model('Category', categorySchema);