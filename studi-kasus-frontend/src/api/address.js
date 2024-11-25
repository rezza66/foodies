import axios from "axios";
import config from "../../config";

export const getAddress = async (token) => {
  try {
    const response = await axios.get(`${config.apiHost}/api/deliveryAddresses`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};


export const createAddress = async (data, token) => {
  return await axios.post(`${config.apiHost}/api/deliveryAddress`, data, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const getLocationData = async (level, parentId = null) => {
    let url;
  
    if (level === 'kabupaten') {
      url = `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${parentId}.json`;
      
    } else if (level === 'kecamatan') {
      url = `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${parentId}.json`;
    } else if (level === 'kelurahan') {
      // Use the new URL for fetching village data based on district ID
      url = `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${parentId}.json`;
    } else {
      // Use the new URL for fetching province data
      url = 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json';
    }
  
    return await axios.get(url);
  };