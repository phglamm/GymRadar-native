import { request } from "./request";

const initService = {
  getHotResearchGym: (params) => request("GET", "v1/gym", null, {}, params),

  getGymById: (id) => request("GET", `v1/gym/${id}`),
  getCourseByGymId: (id) => request("GET", `v1/gym/${id}/courses`),
  getPTByGymId: (id) => request("GET", `v1/gym/${id}/pts`),

  getSlotOfGym: (params) => request("GET", "v1/slot", null, {}, params),
};

export default initService;
