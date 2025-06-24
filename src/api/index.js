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

export const getAllTeamApi = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get("/teams");
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

export const getAllSkillApi = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get("/skills");
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
