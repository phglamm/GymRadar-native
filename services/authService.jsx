import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const request = async (method, url, data = null, headers = {}, params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        ...headers,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const authService = {
  login: (loginData) => request("POST", "user/auth", loginData),
  register: (registerData) => request("POST", `user/register`, registerData),
};

export default authService;
