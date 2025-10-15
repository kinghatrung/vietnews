import axios from "axios";
import { notification } from "antd";
import { refreshTokenAPI } from "~/api";
import { logoutUser } from "~/redux/slices/authSlice";

let axiosReduxStore;

export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};

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

let refreshTokenPromise = null;

// Can thiệp vào giữa những res nhận về từ API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUser(false));
    }

    const originalRequests = error.config;
    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // đồng thời accessToken đã nằm trong httpOnly cookie (xử lý phía be)
            return data?.accessToken;
          })
          .catch((_error) => {
            // Bất kì lỗi nào từ api refresh token thì logout luôn
            axiosReduxStore.dispatch(logoutUser(false));
            return Promise.reject(_error);
          })
          .finally(() => {
            //  Dù Api có ok hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise = null như ban đầu
            refreshTokenPromise = null;
          });
      }

      return refreshTokenPromise.then((accessToken) => {
        // Gọi lại các Api ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequests);
      });
    }

    if (error.response?.status === 403) {
      notification.error({
        message: "Tài khoản bị khóa",
        description: error.response.data.message || "Tài khoản của bạn đã bị khóa.",
        duration: 5,
      });
    }

    if (error.response?.status !== 410 || error.response?.status !== 401) {
      notification.error({
        message: "Tài khoản bị khósadasdasda",
        description: error.response.data.message || "Tài khoản của bạn đã bị khóa.",
        duration: 5,
      });
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
