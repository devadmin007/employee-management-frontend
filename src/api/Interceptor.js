import { store } from "@/redux/store";
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstanceApi = axios.create({
  baseURL: "https://employee-management-a8yl.onrender.com/api",
    // baseURL: "http://192.168.1.17:3000/api/",
});

axiosInstanceApi.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth.userData?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "";

    if (error.response) {
      errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        errorMessage;
    } else if (error.request) {
      errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        errorMessage;
    } else {
      errorMessage = error?.response?.data?.message || error;
    }
    toast.error(errorMessage);
    console.log(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosInstanceApi;
