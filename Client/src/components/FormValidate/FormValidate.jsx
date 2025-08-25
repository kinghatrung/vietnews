import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Divider, Button, Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import Login from "~/components/FormValidate/Login";
import Register from "~/components/FormValidate/Register";
import { loginUserWithGoogle, loginUserWithFacebook } from "~/redux/apiRequest";

const fadeSlide = {
  initial: { opacity: 0, x: 0 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const appFacebookId = import.meta.env.VITE_FB_CLIENT_ID;

const FormValidate = React.memo(function FormValidate({
  isModalOpen,
  setIsModalOpen,
  isChangeForm,
  setIsChangeForm,
  isFormForgotPassword,
  setIsFormForgotPassword,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    await loginUserWithGoogle(credentialResponse, dispatch, navigate);
  };

  const handleFacebookLogin = async (res) => {
    const tokenFacebook = res.accessToken;
    await loginUserWithFacebook(tokenFacebook, dispatch, navigate);
  };

  const handleGoogleError = (err) => {
    console.error("Đăng nhập Google bị lỗi:", err);
  };

  return (
    <Modal
      width={420}
      classNames={{
        header: "!m-0",
        content: "!p-0 !rounded-[4px]",
      }}
      title={
        <div className="flex justify-center items-center border-b border-[#E5E5E5]">
          <picture>
            <source srcSet="/image/NEWS.webp" type="image/webp" />
            <img
              alt="Logo"
              loading="lazy"
              className="h-[50px] w-auto"
              src="/image/NEWS.png"
              width="150"
              height="50"
            />
          </picture>
        </div>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen()}
      footer={null}
    >
      <div className="px-[24px] pt-[24px] pb-[64px] bg-[#F4F6F8] rounded-[4px]">
        <AnimatePresence mode="wait">
          <motion.div
            key="auth-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!isChangeForm ? (
              <motion.div key="login" {...fadeSlide}>
                <Login
                  isChangeForm={isChangeForm}
                  setIsChangeForm={setIsChangeForm}
                  isFormForgotPassword={isFormForgotPassword}
                  setIsFormForgotPassword={setIsFormForgotPassword}
                />
              </motion.div>
            ) : (
              <motion.div key="register" {...fadeSlide}>
                <Register
                  isChangeForm={isChangeForm}
                  setIsChangeForm={setIsChangeForm}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        <Divider className="!font-body">Hoặc</Divider>
        <div className="flex flex-col justify-center items-center gap-3">
          <FacebookLogin
            appId={appFacebookId}
            fields="name,email,picture"
            callback={handleFacebookLogin}
            render={(renderProps) => (
              <Button
                onClick={renderProps.onClick}
                className="!border !border-[#E5E5E5] !p-[18px] flex items-center gap-2"
              >
                <img
                  loading="lazy"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook Logo"
                  className="w-5 h-5"
                />
                Đăng nhập bằng Facebook
              </Button>
            )}
          />
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </Modal>
  );
});

export default FormValidate;
