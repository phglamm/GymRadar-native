import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const request = async (method, url, data = null, headers = {}, params = {}) => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  console.log(API_BASE_URL);
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

const bookingService = {
  getBookingHistoryForUser: (params) =>
    request("GET", "v1/booking/user", null, {}, params),

  getBookingHistoryForPT: (params) =>
    request("GET", "v1/booking/pt", null, {}, params),

  userBookSlotPT: (data) => request("POST", "v1/booking", data),
  updateBookingStatus: (id, status) =>
    request("PUT", `v1/booking/${id}`, null, {}, { status }),
};

export default bookingService;
