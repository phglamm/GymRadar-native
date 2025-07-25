import { request } from "./request";

const gymService = {
  getAllGyms: (params) => request("GET", "v1/gym", null, {}, params),

  searchGyms: (params) => request("GET", "v1/gym", null, {}, params),

  getGymById: (id) => request("GET", `v1/gym/${id}`),
  getCourseByGymId: (id) => request("GET", `v1/gym/${id}/courses`),
  getPTByGymId: (id) => request("GET", `v1/gym/${id}/pts`),

  getSlotOfGym: (id) => request("GET", `v1/pt-slot/${id}/user`),

  // Thêm hàm mới này:
  getPTById: (id) => request("GET", `v1/pt/${id}`),

  getPTinGymCourse: (id) => request("GET", `v1/course/${id}/pts`),

  // Comment functions
  getCommentsByGymId: (gymId, params) =>
    request("GET", `v1/gym/${gymId}/comments`, null, {}, params),
  postComment: (gymId, data) =>
    request("POST", `v1/gym/${gymId}/comments`, data),
};

export default gymService;
