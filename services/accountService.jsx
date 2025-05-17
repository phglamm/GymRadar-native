import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const request = async (method, url, data = null, headers = {}, params = {}) => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const token = await AsyncStorage.getItem("token");
  console.log("token:", token);
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

const accountService = {
  getProfile: () => request("GET", "v1/account/profile"),
  updateProfileUser: (data) => request("PUT", "v1/user", data),
};

export default accountService;
