import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAddress, createAddress, deleteAddress } from '../../api/address';

// Thunk untuk mengambil data alamat
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (token, { rejectWithValue }) => {
    try {
      const response = await getAddress(token);
      return response;
    } catch (error) {
      console.error("Fetch Address Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: 'Terjadi kesalahan saat mengambil alamat' });
    }
  }
);

// Thunk untuk membuat alamat baru (Versi diperbaiki)
export const createNewAddress = createAsyncThunk(
  'address/createNewAddress',
  async ({ addressData, token }, { rejectWithValue }) => { // Terima object dengan addressData dan token
    try {
      // Validasi data sebelum dikirim
      if (!addressData.nama || !addressData.detail) {
        throw new Error('Nama dan detail alamat harus diisi');
      }

      const response = await createAddress(addressData, token);
      
      // Pastikan response memiliki data yang valid
      if (!response.data) {
        throw new Error('Format response dari server tidak valid');
      }
      
      return response.data;
    } catch (error) {
      console.error("Create Address Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { 
        success: false, 
        message: error.message || 'Terjadi kesalahan saat membuat alamat' 
      });
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'address/deleteUserAddress',
  async ({ addressId, token }, { rejectWithValue }) => {
    try {
      const response = await deleteAddress(addressId, token);
      return { addressId: response.data._id };
    } catch (error) {
      return rejectWithValue({
        message: error.message
      });
    }
  }
);

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    addresses: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Reset error state
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = action.payload || []; // Pastikan selalu array
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })

      // Handle create new address
      .addCase(createNewAddress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createNewAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = [action.payload, ...state.addresses]; // Tambahkan di awal array
      })
      .addCase(createNewAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })     
      .addCase(deleteUserAddress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Filter out the deleted address
        state.addresses = state.addresses.filter(
          addr => addr._id !== action.payload.addressId
        );
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })
  },
});

export const { resetError } = addressSlice.actions;
export default addressSlice.reducer;