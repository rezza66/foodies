import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama tag minimal 3 karakter'],
        maxlength: [20, 'Panjang nama tag maksimal 20 karakter'],
        required: true,
        trim: true
    }
    
});

export default mongoose.model('Tag', tagSchema);