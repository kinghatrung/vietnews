import axios from "axios";
import { notification } from "antd";

import { logoutFromInterceptor } from "~/redux/apiRequest";
import { handleLogoutAPI, refreshTokenAPI } from "~/api";

let authorizedAxiosInstance = axios.create();

authorizedAxiosInstance.defaults.timeout = 1000 * 60;

authorizedAxiosInstance.defaults.withCredentials = true;

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Can thiệp vào giữa những res nhận về từ API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      await logoutFromInterceptor();
      return Promise.reject(error);
    }

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;
      return refreshTokenAPI()
        .then(() => {
          return authorizedAxiosInstance(originalRequest);
        })
        .catch((err) => {
          logoutFromInterceptor();
          return Promise.reject(err);
        });
    }

    // Làm thông báo cho các status khác 410
    // if (error.response?.status !== 410) {
    //   console.error("API Error:", error.response?.data || error.message);
    // }

    if (error.response?.status === 403) {
      notification.error({
        message: "Tài khoản bị khóa",
        description:
          error.response.data.message || "Tài khoản của bạn đã bị khóa.",
        duration: 5,
      });
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
