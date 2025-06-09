import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './config/database.js';
import configurePassport from './config/passport.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import semua route
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoutes.js';
import tagRoute from './routes/tagRoutes.js';
import categoryRoute from './routes/categoryRoute.js';
import deliveryAddressRoute from './routes/deliveryAddressRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import invoiceRoute from './routes/invoiceRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Koneksi database dan konfigurasi Passport
connectDB();
configurePassport();
app.use(passport.initialize());

// Serve file static
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Buat router app3
const app3Router = express.Router();

app3Router.use('/api', authRoute);
app3Router.use('/api', userRoute);
app3Router.use('/api', productRoute);
app3Router.use('/api', tagRoute);
app3Router.use('/api', categoryRoute);
app3Router.use('/api', deliveryAddressRoute);
app3Router.use('/api', cartRoute);
app3Router.use('/api', orderRoute);
app3Router.use('/api', invoiceRoute);

// Pasang app3Router di bawah prefix /app3
app.use('/app3', app3Router);

// Error handler
app.use(errorHandler);

// Jalankan server
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
