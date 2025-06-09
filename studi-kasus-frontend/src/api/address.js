import axios from "axios";
import { BASE_URL } from "../utils/config";

export const getAddress = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/deliveryAddresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getAddress:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to fetch addresses");
  }
};

export const createAddress = async (addressData, token) => {
  if (!addressData || !token) {
    throw new Error("Missing required parameters");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/deliveryAddress`,
      addressData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating address:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to create address");
  }
};

// address.js
export const deleteAddress = async (addressId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/deliveryAddress/${addressId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Gagal menghapus alamat');
    }

    return response.data;

  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'Terjadi kesalahan saat menghapus alamat';
    throw new Error(errorMessage);
  }
};

export const getLocationData = async (level, parentId = null) => {
  let url;
  const baseUrl = "https://www.emsifa.com/api-wilayah-indonesia/api";

  switch(level) {
    case "kabupaten":
      url = `${baseUrl}/regencies/${parentId}.json`;
      break;
    case "kecamatan":
      url = `${baseUrl}/districts/${parentId}.json`;
      break;
    case "kelurahan":
      url = `${baseUrl}/villages/${parentId}.json`;
      break;
    default:
      url = `${baseUrl}/provinces.json`;
  }

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${level} data:`, error.message);
    throw error;
  }
};