import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const request = async (method, url, data = null, headers = {}, params = {}) => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  console.log(API_BASE_URL);
  const token = await AsyncStorage.getItem("token");

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        ...headers,
        ...authHeader,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const ptService = {
  getAllSlotsOfGym: (params) => request("GET", "v1/slot", null, {}, params),
  registerSlot: (data) => request("POST", "v1/pt-slot", data),
  activeSlot: (id) => request("PUT", `v1/pt-slot/${id}/active`),
  unactiveSlot: (id) => request("PUT", `v1/pt-slot/${id}/un-active`),

  getPtSlot: (params) => request("GET", "v1/pt-slot", null, {}, params),
};

export default ptService;
