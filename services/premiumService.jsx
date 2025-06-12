import { request } from "./request";

const premiumService = {
  buyPremium: (data) => request("POST", "v1/cart/premium", data),
  getAllPremium: (params) => request("GET", "v1/premium", null, {}, params),
};

export default premiumService;
