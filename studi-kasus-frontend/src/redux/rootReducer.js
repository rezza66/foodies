import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import cartReducer from '../redux/slices/cartSlice';
import productReducer from '../redux/slices/productsSlice';
import authReducer from '../redux/slices/auth';
import addressReducer from '../redux/slices/addressSlice';
import userReducer from '../redux/slices/userSlice';
import orderReducer from '../redux/slices/orderSlice';

// Konfigurasi persist untuk cart
const cartPersistConfig = {
  key: 'cart',
  storage,
};

// Konfigurasi persist untuk auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'],
};

// Tambahkan konfigurasi persist untuk address
const addressPersistConfig = {
  key: 'addresses',
  storage,
  whitelist: ['addresses'], // Hanya menyimpan daftar alamat
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  products: productReducer,
  addresses: persistReducer(addressPersistConfig, addressReducer),
  user: userReducer,
  order: orderReducer,
});

export default rootReducer;