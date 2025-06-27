import axios from "axios";

const requestChatBot = async (
  method,
  url,
  data = null,
  headers = {},
  params = {}
) => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_CHATBOT_URL;

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

export { requestChatBot };
