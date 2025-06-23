import { requestChatBot } from "./requestChatBot";

const chatbotService = {
  sendMessage: (data) => requestChatBot("POST", "chat", data),
};

export default chatbotService;
