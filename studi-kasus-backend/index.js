import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import cors from 'cors';
import { connectDB } from './config/database.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoutes.js';
import tagRoute from './routes/tagRoutes.js';
import categoryRoute from './routes/categoryRoute.js';
import deliveryAddressRoute from './routes/deliveryAddressRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from "./routes/orderRoute.js";
import invoiceRoute from "./routes/invoiceRoute.js";
import { errorHandler } from './middleware/errorHandler.js';
import configurePassport from './config/passport.js';
import morgan from 'morgan';

dotenv.config();

const app = express();
const port = process.env.PORT

app.use(cors())
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

configurePassport();

app.use(passport.initialize());

app.use('/auth', authRoute);
app.use('/api', userRoute);
app.use('/api', productRoute);
app.use('/api', tagRoute); 
app.use('/api', categoryRoute); 
app.use('/api', deliveryAddressRoute); 
app.use('/api', cartRoute); 
app.use('/api', orderRoute); 
app.use('/api', invoiceRoute); 

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});
