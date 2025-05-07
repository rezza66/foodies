import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

// **Thunk untuk mengambil daftar item dalam cart**
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken');  // Ambil token dari localStorage
    const response = await axios.get(`${BASE_URL}/api/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Terjadi kesalahan saat mengambil cart');
  }
});

// **Thunk untuk menambah item ke cart**
export const addToCart = createAsyncThunk('cart/addToCart', async (item, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${BASE_URL}/api/cart`, item, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Gagal menambahkan item ke cart');
  }
});

// **Thunk untuk memperbarui jumlah item dalam cart**
export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ id, qty }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken');  // Ambil token dari localStorage
    const response = await axios.put(`${BASE_URL}/api/cart/${id}`, { qty }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Gagal memperbarui item dalam cart');
  }
});

// **Thunk untuk menghapus item dari cart**
export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken');  // Ambil token dari localStorage
    await axios.delete(`${BASE_URL}/api/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id; // Kembalikan ID item yang dihapus
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Gagal menghapus item dari cart');
  }
});

const initialState = {
  cartItems: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cartItems = []; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        console.log("✅ Item berhasil ditambahkan ke cart Redux:", action.payload);
        state.cartItems.push(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.cartItems.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.cartItems[index] = action.payload;
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      });
  },
});

// **Selector untuk menghitung total jumlah barang dalam cart**
export const selectTotalCartAmount = (state) => {
  return state.cart.cartItems.reduce((total, item) => total + item.qty, 0);
};

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
