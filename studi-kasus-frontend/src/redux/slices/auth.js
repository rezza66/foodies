import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

// Action untuk login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      return response.data;  // Kembalikan data yang diperlukan
    } catch (error) {
      return rejectWithValue(error.response.data);  // Jika gagal, kirim error ke payload
    }
  }
);

// Action untuk register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, { username, email, password, role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = (() => {
  try {
    // Mengambil hanya token dari localStorage dengan nama 'accessToken'
    return { user: null, token: localStorage.getItem('accessToken') };
  } catch (error) {
    return { user: null, token: null };
  }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    
      // ✅ Simpan user & token di localStorage
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    
      // ✅ Simpan user & token di localStorage
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    })
      .addCase(loginUser.rejected, (state, action) => {
        console.error(action.payload);  // Menangani error jika login gagal
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error(action.payload);  // Menangani error jika register gagal
      });
  }
});

export const { userLogout } = authSlice.actions;
export const selectAuthToken = (state) => state.auth.token;
export default authSlice.reducer;
