import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAddress, createAddress } from '../../api/address';

// Thunk untuk mengambil data alamat
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (token, { rejectWithValue }) => {
    try {
      const response = await getAddress(token);
      return response.data; // Mengembalikan data alamat
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Terjadi kesalahan saat mengambil alamat');
    }
  }
);

// Thunk untuk membuat alamat baru
export const createNewAddress = createAsyncThunk(
  'address/createNewAddress',
  async (addressData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Ambil token dari state Redux
      const response = await createAddress(addressData, token);
      return response.data; // Mengembalikan data alamat yang baru dibuat
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Terjadi kesalahan saat membuat alamat');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [], // Pastikan ini adalah array kosong
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload;  // pastikan payload adalah array alamat
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Handle create new address
      .addCase(createNewAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses.push(action.payload);  // Menambahkan alamat baru ke array
      })
      .addCase(createNewAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default addressSlice.reducer;
