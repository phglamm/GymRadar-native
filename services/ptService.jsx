import { request } from "./request";

const ptService = {
  getAllSlotsOfGym: (params) => request("GET", "v1/slot", null, {}, params),
  registerSlot: (data) => request("POST", "v1/pt-slot", data),
  activeSlot: (id) => request("PUT", `v1/pt-slot/${id}/active`),
  unactiveSlot: (id) => request("PUT", `v1/pt-slot/${id}/un-active`),

  getPtSlot: (params) => request("GET", "v1/pt-slot", null, {}, params),

  getPTDetail: (ptId) => request("GET", `v1/pt/${ptId}`),

  getPTForUser: (id, params) =>
    request("GET", `v1/pt-slot/${id}/user`, null, {}, params),
};

export default ptService;
