import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Form, Input, notification } from "antd";

import { sendOtpAPI } from "~/api";
import { registerUser } from "~/redux/apiRequest";
import { hideLoginModal } from "~/redux/modalSlice";

function Register({ isChangeForm, setIsChangeForm }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    await sendOtpAPI(email);
  };

  const handleRegister = async () => {
    const newUser = {
      email: email,
      full_name: fullName,
      username: username,
      password: password,
      otp: otp,
    };

    await registerUser(newUser, dispatch, navigate);
    dispatch(hideLoginModal());
  };

  return (
    <>
      <h1 className="text-[22px] mb-[24px] font-title text-center font-bold">
        Đăng ký
      </h1>
      <Form onFinish={handleRegister} name="register" layout="vertical">
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
              onClick={handleSendOtp}
              className="!rounded-none !py-[10px] !h-[52px]  !bg-[#757575] !font-bold"
            >
              Gửi mã OTP
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          layout="vertical"
          className="!mb-[16px] !font-bold"
          label="Họ và tên"
          name="full_name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ và tên!",
            },
          ]}
        >
          <Input
            onChange={(e) => setFullName(e.target.value)}
            className="!p-[14px] !rounded-none !font-medium"
            type="text"
            placeholder="Nhập họ và tên của bạn"
          />
        </Form.Item>

        <Form.Item
          layout="vertical"
          className="!mb-[16px] !font-bold"
          label="Tên đăng nhập"
          name="username"
          rules={[
            {
              type: "text",
              message: "Tên đăng nhập không hợp lệ!",
            },
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
          ]}
        >
          <Input
            onChange={(e) => setUsername(e.target.value)}
            className="!p-[14px] !rounded-none !font-medium"
            type="text"
            placeholder="Nhập tên đăng nhập của bạn"
          />
        </Form.Item>

        <Form.Item
          className="!mb-[16px] !font-bold"
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
        >
          <Input.Password
            onChange={(e) => setPassword(e.target.value)}
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
            Đăng ký
          </Button>
        </Form.Item>

        <Button
          className="!mt-[10px] !text-[#757575] !p-0"
          color="default"
          variant="link"
          onClick={() => setIsChangeForm(!isChangeForm)}
        >
          Nhấn vào đây khi đã có tài khoản!
        </Button>
      </Form>
    </>
  );
}

export default Register;
