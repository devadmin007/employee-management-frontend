import axiosInstanceApi from "./Interceptor";

export const loginApi = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/login", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const signUpApi = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/register", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllManagerApi = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get("/managers");
  } catch (e) {
    result = e;
  }
  return result;
};

export const createManagerApi = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/create-manager", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteManagerApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/delete-manager/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getManagerByIdApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/manager/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateManagerApi = async (id, updatedManager) => {
  let result;

  try {
    result = await axiosInstanceApi.patch(
      `/update-manager/${id}`,
      updatedManager
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllTeamApi = async (page = 1, limit = 5, search = "") => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/teams?limit=${limit}&page=${page}${search && `&${search}`}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const createTeamApi = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/create-team", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteTeamApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/delete-team/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getTeamByIdApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/team/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateTeamApi = async (id, updatedTeam) => {
  let result;

  try {
    result = await axiosInstanceApi.patch(`/update-team/${id}`, updatedTeam);
  } catch (e) {
    result = e;
  }
  return result;
};

export const createSkillApi = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/add-skill", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllSkillApi = async (page, limit, search) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/skills?page=${page}&itemsPerPage=${limit}${search && `&search=${search}`}&pagination=true`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteSkillApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/delete-skill/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSkillByIdApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/skill/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateSkillApi = async (id, updatedSkill) => {
  let result;

  try {
    result = await axiosInstanceApi.patch(`/update-skill/${id}`, updatedSkill);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllRoles = async () => {
  let result;

  try {
    result = await axiosInstanceApi.get(`/roles`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const createDesignation = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/add-designation", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllDesignationApi = async (page, limit, search) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/designations?page=${page}&itemsPerPage=${limit}${search && `&search=${search}`}&pagination=true`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteDesignationApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/delete-designation/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getDesignationByIdApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/designation/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateDesignationApi = async (id, updatedDesignation) => {
  let result;

  try {
    result = await axiosInstanceApi.patch(
      `/update-designation/${id}`,
      updatedDesignation
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const createEmployeeApi = async (payload) => {
  let result;

  try {
    result = await axiosInstanceApi.post(`/add-user`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const createDepartment = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/add-department", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllDepartmentApi = async (page, limit, search) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/departments?page=${page}&itemsPerPage=${limit}${search && `&search=${search}`}&pagination=true`
    );
  } catch (e) {
    result = e;
  }
  return result;
};
export const deleteDepartmentApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/delete-department/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getDepartmentByIdApi = async (id) => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/department/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateDepartmentApi = async (id, updatedDesignation) => {
  let result;

  try {
    result = await axiosInstanceApi.patch(
      `/update-department/${id}`,
      updatedDesignation
    );
  } catch (e) {
    result = e;
  }
  return result;
};
