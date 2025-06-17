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
