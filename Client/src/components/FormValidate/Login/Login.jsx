import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Form, Input, notification } from "antd";

import { loginUser } from "~/redux/apiRequest";
import Loading from "~/components/Loading";

function Login({
  isChangeForm,
  setIsChangeForm,
  isFormForgotPassword,
  setIsFormForgotPassword,
}) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const newUser = {
      username: userName,
      password: password,
    };
    await loginUser(newUser, dispatch, navigate);
  };

  return (
    <>
      <h1 className="text-[22px] mb-[24px] font-title text-center font-bold">
        Đăng Nhập
      </h1>
      <Form name="login" layout="vertical" onFinish={handleLogin}>
        <Form.Item
          layout="vertical"
          className="!mb-[16px] !font-bold"
          label="Tên đăng nhập"
          name="username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập!",
            },
          ]}
        >
          <Input
            onChange={(e) => setUserName(e.target.value)}
            className="!p-[14px] !rounded-none !font-medium"
            type="text"
            placeholder="Nhập tên đăng nhập của bạn"
          />
        </Form.Item>

        <Form.Item
          layout="vertical"
          label="Mật khẩu"
          name="password"
          className="!mb-[16px] !font-bold"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
        >
          <Input
            onChange={(e) => setPassword(e.target.value)}
            className="!p-[12px] !rounded-none !font-medium"
            type="password"
            placeholder="Hãy nhập mật khẩu"
          />
        </Form.Item>

        <Form.Item className="!m-0">
          <Button
            block
            type="primary"
            htmlType="submit"
            className="!rounded-none !p-[22px] !bg-[#757575] !font-bold"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <div className="flex justify-between items-center">
        <Button
          className="!mt-[10px] !text-[#757575] !p-0"
          color="default"
          variant="link"
          onClick={() => setIsFormForgotPassword(!isFormForgotPassword)}
        >
          Quên mật khẩu
        </Button>
        <Button
          className="!mt-[10px] !text-[#757575] !p-0"
          color="default"
          variant="link"
          onClick={() => setIsChangeForm(!isChangeForm)}
        >
          Tạo tài khoản
        </Button>
      </div>
    </>
  );
}

export default Login;
