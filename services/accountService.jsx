import { request } from "./request";

const accountService = {
  getProfile: () => request("GET", "v1/account/profile"),
  updateProfileUser: (data) => request("PUT", "v1/user", data),
};

export default accountService;
