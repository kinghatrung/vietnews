import { notification } from "antd";
import { store, persistor } from "~/redux/store";

import {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerSuccess,
  registerFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailed,
  resetPasswordClear,
} from "~/redux/authSlice";
import {
  handleLogoutAPI,
  handleRegisterAPI,
  loginAPI,
  loginWithGoogleAPI,
  loginWithFacebookAPI,
  resetPasswordAPI,
} from "~/api";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await loginAPI(user);
    dispatch(loginSuccess(res.data));
    navigate("/");
    notification.success({
      message: "Đăng nhập thành công",
      description: "Chào mừng bạn!",
      duration: 3,
    });
    return res;
  } catch (err) {
    dispatch(loginFailed());
    notification.error({
      message: "Đăng nhập thất bại",
      description: "Hãy kiểm tra lại thông tin đăng nhập",
      duration: 3,
    });
    throw err;
  }
};

export const loginUserWithGoogle = async (
  credentialResponse,
  dispatch,
  navigate
) => {
  dispatch(loginStart());
  try {
    const res = await loginWithGoogleAPI(credentialResponse.credential);
    dispatch(loginSuccess(res.data));
    navigate("/");
    notification.success({
      message: "Đăng nhập thành công",
      description: "Chào mừng bạn!",
      duration: 3,
    });
  } catch (err) {
    dispatch(loginFailed());
    notification.error({
      message: "Đăng nhập thất bại",
      description: "Hãy kiểm tra lại thông tin đăng nhập",
      duration: 3,
    });
  }
};

export const loginUserWithFacebook = async (
  accessToken,
  dispatch,
  navigate
) => {
  dispatch(loginStart());
  try {
    const res = await loginWithFacebookAPI(accessToken);
    dispatch(loginSuccess(res.data));
    navigate("/");
    notification.success({
      message: "Đăng nhập thành công",
      description: "Chào mừng bạn!",
      duration: 3,
    });
  } catch (err) {
    dispatch(loginFailed());
    notification.error({
      message: "Đăng nhập thất bại",
      description: "Hãy kiểm tra lại thông tin đăng nhập",
      duration: 3,
    });
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await handleRegisterAPI(user);
    dispatch(registerSuccess());
    navigate("/");
    notification.success({
      message: "Đăng kí thành công",
      description: "Hãy tham gia ngay!",
      duration: 3,
    });
  } catch (err) {
    dispatch(registerFailed());
    notification.error({
      message: "Đăng kí thất bại",
      description: "Hãy tham kiểm tra lại!",
      duration: 3,
    });
  }
};

export const restPassword = async (
  { email, password, otp },
  dispatch,
  navigate
) => {
  dispatch(resetPasswordStart());
  try {
    await resetPasswordAPI({ email, password, otp });
    dispatch(resetPasswordSuccess());
    navigate("/");
    notification.success({
      message: "Đổi mật khẩu thành công",
      description: "Vui lòng đăng nhập lại",
      duration: 3,
    });
  } catch (err) {
    dispatch(resetPasswordFailed());
    notification.error({
      message: "Đổi mật khẩu thất bại",
      description: "Vui lòng kiểm tra lại thông tin",
      duration: 3,
    });
    dispatch(resetPasswordClear());
  }
};

export const logoutUser = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    await handleLogoutAPI();
    dispatch(logoutSuccess());
    navigate("/");
    notification.success({
      message: "Đăng xuất thành công",
      description: "Tạm biệt bạn!",
      duration: 3,
    });
  } catch (err) {
    dispatch(logoutFailed());
    notification.error({
      message: "Đăng xuất thất bại",
      description: "Vui lòng kiểm tra lại!",
      duration: 3,
    });
  }
};
export const logoutFromInterceptor = async () => {
  try {
    await handleLogoutAPI();
    store.dispatch(logoutSuccess());
    persistor.purge();
    notification.error({
      message: "Phiên đăng nhập đã hết hạn",
      description: "Vui lòng đăng nhập lại!",
      duration: 3,
    });
  } catch (err) {
    notification.error({
      message: "Đăng xuất thất bại",
      description: "Vui lòng kiểm tra lại!",
      duration: 3,
    });
  }
};
