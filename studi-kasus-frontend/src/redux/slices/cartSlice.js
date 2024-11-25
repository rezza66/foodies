import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Asumsi: API endpoint untuk mengambil daftar makanan
const API_URL = 'http://localhost:5000/api/carts';

// Async thunk untuk mengambil data dari backend
export const fetchFoodList = createAsyncThunk('cart/fetchFoodList', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

const initialState = {
  foodList: [],
  cartItems: {},
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload;
      if (!state.cartItems[itemId]) {
        state.cartItems[itemId] = 1;
      } else {
        state.cartItems[itemId] += 1;
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      if (state.cartItems[itemId]) {
        state.cartItems[itemId] -= 1;
        if (state.cartItems[itemId] <= 0) {
          delete state.cartItems[itemId];
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFoodList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Masukkan data makanan ke dalam state
        state.foodList = action.payload;
      })
      .addCase(fetchFoodList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectTotalCartAmount = (state) => {
    return Object.values(state.cart.cartItems).reduce((total, itemCount) => total + itemCount, 0);
  };

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
