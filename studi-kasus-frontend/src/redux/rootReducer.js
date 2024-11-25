import { combineReducers } from 'redux';
import cartReducer from '../redux/slices/cartSlice';
import productReducer from '../redux/slices/productsSlice';
import authReducer from '../redux/slices/auth';
import addressReducer from '../redux/slices/addressSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  address: addressReducer

});

export default rootReducer;
