import { request } from "./request";

const authService = {
  login: (loginData) => request("POST", "v1/auth", loginData),
  register: (registerData) => request("POST", `v1/account`, registerData),
};

export default authService;
