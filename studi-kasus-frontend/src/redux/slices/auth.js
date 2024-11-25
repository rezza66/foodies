import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('auth')
  ? JSON.parse(localStorage.getItem('auth'))
  : { user: null, token: null, orders: [], address: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Menyimpan state ke localStorage
      localStorage.setItem('auth', JSON.stringify(state));
    },
    userLogout: (state) => {
      state.user = null;
      state.token = null;
      // Menghapus state dari localStorage
      localStorage.removeItem('auth');
    },
    // Action tambahan untuk menyimpan orders dan address
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    }
  }
});

export const { userLogin, userLogout, setOrders, setAddress } = authSlice.actions;
export const selectAuthToken = (state) => state.auth.token;
export default authSlice.reducer;
