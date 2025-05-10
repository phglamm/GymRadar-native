import axios from "axios";

const request = async (method, url, data = null, headers = {}, params = {}) => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  console.log(API_BASE_URL);
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
  login: (loginData) => request("POST", "v1/auth", loginData),
  register: (registerData) => request("POST", `v1/account`, registerData),
};

export default authService;
