import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

// Async thunk untuk mengambil data orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ skip = 0, limit = 10 }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/orders?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// Async thunk untuk membuat order baru
export const createNewOrder = createAsyncThunk(
  "orders/createNewOrder",
  async (orderData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/user/orders`, orderData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    data: [],
    count: 0,
    loading: false,
    error: null,
    createStatus: 'idle', // Status khusus untuk create operation
    createError: null
  },
  reducers: {
    clearOrders: (state) => {
      state.data = [];
      state.count = 0;
      state.loading = false;
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle create new order
      .addCase(createNewOrder.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        // Tambahkan order baru ke awal array
        state.data.unshift(action.payload.data);
        state.count += 1;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload;
      });
  },
});

export const { clearOrders, resetCreateStatus } = orderSlice.actions;
export default orderSlice.reducer;