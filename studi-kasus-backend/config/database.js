import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/studi-kasus-backend', {
            family: 4
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};