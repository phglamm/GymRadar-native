import { request } from "./request";

const cartService = {
  processCartPT: (data) => request("POST", "v1/cart", data),
  processCartNormal: (data) => request("POST", "v1/cart/gym-course", data),

  checkStatus: (params) => request("GET", `v1/cart/status`, null, {}, params),
};

export default cartService;
