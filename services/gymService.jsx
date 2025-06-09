import { request } from "./request";

const gymService = {
  getAllGyms: (params) => request("GET", "v1/gym", null, {}, params),

  getGymById: (id) => request("GET", `v1/gym/${id}`),
  getCourseByGymId: (id) => request("GET", `v1/gym/${id}/courses`),
  getPTByGymId: (id) => request("GET", `v1/gym/${id}/pts`),

  getSlotOfGym: (id) => request("GET", `v1/pt-slot/${id}/user`),

  // Thêm hàm mới này:
  getPTById: (id) => request("GET", `v1/pt/${id}`),

  getPTinGymCourse: (id) => request("GET", `v1/course/${id}/pts`),
};

export default gymService;
