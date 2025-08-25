import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Divider, Button, Modal, Form, Input, notification } from "antd";

import { sendOtpForgotPasswordAPI } from "~/api";
import { restPassword } from "~/redux/apiRequest";
import { hideLoginModal } from "~/redux/modalSlice";

function ForgotPassword({
  isModalOpen,
  setIsChangeForm,
  setIsModalOpen,
  isFormForgotPassword,
  setIsFormForgotPassword,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtpForgotPassword = async () => {
    try {
      await sendOtpForgotPasswordAPI(email);
      notification.success({
        message: "Gửi mã OTP thành công",
        description: "Vui lòng kiểm tra email của bạn",
        duration: 3,
      });
    } catch (err) {
      notification.error({
        message: "Gửi mã OTP thất bại! Hãy thử lại",
        description: "Vui lòng kiểm tra lại!",
        duration: 3,
      });
    }
  };

  const handleResetPassword = async () => {
    const dataUser = {
      email: email,
      password: newPassword,
      otp: otp,
    };
    await restPassword(dataUser, dispatch, navigate);
    dispatch(hideLoginModal());
  };

  return (
    <Modal
      width={420}
      classNames={{
        header: "!m-0",
        content: "!p-0 !rounded-[4px]",
      }}
      afterClose={() => setIsChangeForm(true)}
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
      onCancel={() => setIsModalOpen(!isModalOpen)}
      footer={null}
    >
      <div className="px-[24px] pt-[24px] pb-[64px] bg-[#F4F6F8] rounded-[4px]">
        <h1 className="text-[22px] mb-[24px] font-title text-center font-bold">
          Quên mật khẩu
        </h1>
        <Form name="login" layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            className="!mb-[16px] !font-bold"
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <Input
              onChange={(e) => setEmail(e.target.value)}
              className="!p-[14px] !rounded-none !font-medium"
              type="email"
              placeholder="Nhập Email của bạn"
            />
          </Form.Item>

          <Form.Item
            className="!mb-[16px] !font-bold"
            label="Mã OTP"
            name="otp"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã OTP!",
              },
            ]}
          >
            <div className="flex items-center gap-[10px]">
              <Input
                onChange={(e) => setOtp(e.target.value)}
                className="!p-[14px] !rounded-none !font-medium"
                type="text"
                placeholder="Nhập mã OTP"
              />
              <Button
                type="primary"
                onClick={handleSendOtpForgotPassword}
                className="!rounded-none !py-[10px] !h-[52px]  !bg-[#757575] !font-bold"
              >
                Gửi mã OTP
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            className="!mb-[16px] !font-bold"
            label="Mật khẩu mới"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
            ]}
          >
            <Input.Password
              onChange={(e) => setNewPassword(e.target.value)}
              className="!p-[12px] !rounded-none !font-medium"
              placeholder="Hãy nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item
            className="!mb-[24px] !font-bold"
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              className="!p-[12px] !rounded-none !font-medium"
              placeholder="Hãy nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item className="!m-0">
            <Button
              block
              type="primary"
              htmlType="submit"
              className="!rounded-none !p-[22px] !bg-[#757575] !font-bold"
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
        <Divider className="!font-body">Hoặc</Divider>
        <div className="flex flex-col justify-center items-center gap-3">
          <Button
            className=" !text-[#757575] !p-0 !underline"
            color="default"
            variant="link"
            onClick={() => setIsFormForgotPassword(!isFormForgotPassword)}
          >
            Hoặc đăng nhập tại đây
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ForgotPassword;
