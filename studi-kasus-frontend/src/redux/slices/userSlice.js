import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_HOST = import.meta.env.VITE_APP_API_HOST;

// Async thunk untuk mengambil user yang sedang login
export const fetchUser = createAsyncThunk("user/fetchUser", async (_, thunkAPI) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return thunkAPI.rejectWithValue("No access token available");

  try {
    const response = await axios.get(`${API_HOST}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user");
  }
});

const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null; // ✅ Cegah error jika localStorage kosong
  } catch (error) {
    console.error("❌ Error parsing user from localStorage:", error);
    return null;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: getUserFromLocalStorage(), // ✅ Ambil user dengan aman dari localStorage
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("accessToken"); // ✅ Hapus token saat logout
      localStorage.removeItem("user"); // ✅ Hapus user dari localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ Simpan user di localStorage
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
