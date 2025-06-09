import { request } from "./request";

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
