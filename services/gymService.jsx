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

const gymService = {
  getAllGyms: (params) => request("GET", "v1/gym", null, {}, params),

  getGymById: (id) => request("GET", `v1/gym/${id}`),
  getCourseByGymId: (id) => request("GET", `v1/gym/${id}/courses`),
  getPTByGymId: (id) => request("GET", `v1/gym/${id}/pts`),

  getSlotOfGym: (params) => request("GET", "v1/slot", null, {}, params),

  // Thêm hàm mới này:
  getPTById: (id) => request("GET", `v1/pt/${id}`),
};

export default gymService;
