import { request } from "./request";

const accountService = {
  getProfile: () => request("GET", "v1/account/profile"),
  updateProfileUser: (data) => request("PUT", "v1/user", data),
  uploadAvatar: (formData) =>
    request("POST", "v1/account/avatar", formData, {
      "Content-Type": "multipart/form-data",
    }),

  getPtTransactions: () => request("GET", "v1/user/pts"),
  getPTSlotforUser: (id, params) =>
    request("GET", `v1/pt-slot/${id}/user`, null, {}, params),
  bookingSlot: (data) => request("POST", "v1/booking", data),
  getBookingHistory: (params) =>
    request("GET", "v1/booking/user", null, {}, params),
};

export default accountService;
