import { useState, useEffect } from "react";
import {
  Button,
  Empty,
  Input,
  DatePicker,
  notification,
  Upload,
  Radio,
  Form,
  Pagination,
  message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { InboxOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import {
  getSaveNewsAPI,
  updateUserAPI,
  imageUploadAPI,
  updatePasswordUserAPI,
  sendOtpAPI,
  updateEmailUserAPI,
} from "~/api";
import News from "~/components/News";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import { setCurrentUser } from "~/redux/authSlice";

function Info() {
  const dispatch = useDispatch();
  const [isSavedNews, setIsSavedNews] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [email, setEmail] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    birth_date: "",
    gender: "",
    phone: "",
    avatar: "",
    address: "",
  });

  const user = useSelector((state) => {
    return state.auth.login.currentUser;
  });

  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const currentSavedNews = isSavedNews.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const fetchSavedNews = async () => {
      try {
        dispatch(startLoading());
        const res = await getSaveNewsAPI(user._id);
        setIsSavedNews(res.data);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tức:", error);
        dispatch(stopLoading());
      }
    };

    fetchSavedNews();
  }, []);

  const handleSendOtp = async () => {
    await sendOtpAPI(email);
  };

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue || "");
  };

  const handleSave = async (field) => {
    try {
      dispatch(startLoading());
      setEditingField(null);
      const updatedUser = {
        [field]: tempValue,
      };
      const res = await updateUserAPI(user._id, updatedUser);
      dispatch(
        setCurrentUser({
          ...updatedUser,
          ...res.data.user,
        })
      );
      setUserInfo((prev) => ({
        ...prev,
        [field]: tempValue,
      }));
      setTempValue("");
      dispatch(stopLoading());
      notification.success({
        message: "Cập nhập thông tin thành công!",
        description: "Hãy xem ở Profile",
        duration: 3,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      dispatch(stopLoading());
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const res = await imageUploadAPI(formData);
      onSuccess(res.data);
      setUploadedImageUrl(res.data.link);
      setTempValue(res.data.link);
    } catch (err) {
      console.error("Image upload failed:", err);
      onError(err);
    }
  };

  const handleUpdatePassword = async (values) => {
    try {
      dispatch(startLoading());
      await updatePasswordUserAPI(user._id, values);
      message.success("Đổi mật khẩu thành công");
      handleCancel();
      dispatch(stopLoading());
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
      dispatch(stopLoading());
    }
  };

  const handleUpdateEmail = async () => {
    try {
      dispatch(startLoading());
      const payload = {
        email: email,
        password: password,
        otp: otp,
      };
      const res = await updateEmailUserAPI(user._id, payload);
      dispatch(setCurrentUser(res.data.user));
      handleCancel();
      notification.success({
        message: "Đổi Email thành công",
        description: "Hãy kiểm tra lại thông tin mới",
        duration: 3,
      });
      dispatch(stopLoading());
    } catch (err) {
      console.log(err);
      dispatch(stopLoading());
    }
  };

  return (
    <section className="flex flex-col gap-[20px]">
      <div id="info" className="flex flex-col">
        <h1 className="mb-[24px] font-title text-[24px] font-[700]">
          Thông tin tài khoản
        </h1>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px]">Ảnh đại diện</p>
            {editingField !== "avatar" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("avatar", user.avatar)}
              >
                Thay ảnh đại diện
              </Button>
            )}
          </div>
          {editingField === "avatar" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <p className="text-[16px] text-[#222222] mb-2">
                Đổi ảnh đại diện
              </p>
              <Upload.Dragger
                customRequest={handleImageUpload}
                maxCount={1}
                multiple={false}
                name="file"
                accept=".jpeg,.jpg,.png"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấn hoặc kéo ảnh vào đây</p>
                <p className="ant-upload-hint">Chỉ hỗ trợ cho 1 file ảnh</p>
              </Upload.Dragger>
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  onClick={() => handleSave("avatar")}
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <img
              alt="Ảnh người dùng"
              loading="lazy"
              src={user.avatar ? user.avatar : "/image/no-image.png"}
              className="w-[36px] h-[36px] rounded-full object-cover"
            />
          )}
        </div>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#222222]">Họ tên</p>
            {editingField !== "full_name" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("full_name", user.full_name)}
              >
                Thay đổi
              </Button>
            )}
          </div>
          {editingField === "full_name" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <p className="text-[16px] text-[#222222] mb-2">Nhập họ tên</p>
              <Input
                style={{ height: 50, borderRadius: 0 }}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Nhập họ tên"
                className="text-[16px] text-[#757575]"
              />
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  onClick={() => handleSave("full_name")}
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#757575]">{user.full_name}</p>
          )}
        </div>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#222222]">Email</p>
            {editingField !== "email" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("email", user.email)}
              >
                Thay đổi
              </Button>
            )}
          </div>
          {editingField === "email" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <Form
                id="changeEmailForm"
                onFinish={handleUpdateEmail}
                layout="vertical"
              >
                <Form.Item label="Nhập email" type="email">
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ height: 50, borderRadius: 0 }}
                    placeholder="Nhập email"
                    className="text-[16px] text-[#757575]"
                  />
                </Form.Item>
                <Form.Item
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
                      style={{ height: 50, borderRadius: 0 }}
                      type="text"
                      placeholder="Nhập mã OTP"
                    />
                    <Button
                      type="primary"
                      onClick={handleSendOtp}
                      className="!rounded-none !py-[10px] !h-[50px]  !bg-[#757575] !font-bold"
                    >
                      Gửi mã OTP
                    </Button>
                  </div>
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password">
                  <Input.Password
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ height: 50, borderRadius: 0 }}
                    placeholder="Nhập mật khẩu"
                    className="text-[16px] text-[#757575]"
                  />
                </Form.Item>
              </Form>
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  form="changeEmailForm"
                  htmlType="submit"
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#757575]">{user.email}</p>
          )}
        </div>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#222222]">Mật khẩu</p>
            {editingField !== "password" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("password", user.password)}
              >
                Thay đổi
              </Button>
            )}
          </div>
          {editingField === "password" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <p className="text-[16px] text-[#222222] mb-2">Đổi mật khẩu</p>
              <Form
                layout="vertical"
                id="changePasswordForm"
                form={form}
                onFinish={handleUpdatePassword}
              >
                <Form.Item label="Mật khẩu cũ" name="password">
                  <Input.Password
                    style={{ height: 50, borderRadius: 0 }}
                    placeholder="Nhập mật khẩu cũ"
                    className="text-[16px] text-[#757575]"
                  />
                </Form.Item>
                <Form.Item label="Mật khẩu mới" name="newPassword">
                  <Input.Password
                    style={{ height: 50, borderRadius: 0 }}
                    placeholder="Nhập mật khẩu mới"
                    className="text-[16px] text-[#757575]"
                  />
                </Form.Item>
              </Form>
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  form="changePasswordForm"
                  htmlType="submit"
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#757575]">***************</p>
          )}
        </div>
      </div>
      <div>
        <h1 className="mb-[24px] font-title text-[24px] font-[700]">
          Thông tin cá nhân
        </h1>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#222222]">Ngày sinh</p>
            {editingField !== "birth_date" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("birth_date", user.birth_date)}
              >
                Thay đổi
              </Button>
            )}
          </div>
          {editingField === "birth_date" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <p className="text-[16px] text-[#222222] mb-2">Nhập ngày sinh</p>
              <DatePicker
                format="DD/MM/YYYY"
                style={{ height: 50, borderRadius: 0 }}
                className="text-[16px] text-[#757575] w-full"
                onChange={(date, dateString) =>
                  setTempValue(date.format("YYYY-MM-DD"))
                }
                placeholder="Nhập ngày sinh"
              />
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  onClick={() => handleSave("birth_date")}
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#757575]">
              {user.birth_date
                ? dayjs(user.birth_date).format("DD/MM/YYYY")
                : "Chưa có thông tin"}
            </p>
          )}
        </div>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#222222]">Giới tính</p>
            {editingField !== "gender" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("gender", user.gender)}
              >
                Thay đổi
              </Button>
            )}
          </div>
          {editingField === "gender" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <p className="text-[16px] text-[#222222] mb-2">Nhập giới tính</p>
              <Radio.Group
                onChange={(e) => setTempValue(e.target.value)}
                value={tempValue}
                style={{ display: "flex", gap: "20px" }}
                defaultValue={"Chọn giới tính"}
              >
                <Radio value="Nam">Nam</Radio>
                <Radio value="Nữ">Nữ</Radio>
                <Radio value="Khác">Khác</Radio>
              </Radio.Group>
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  onClick={() => handleSave("gender")}
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#757575]">
              {user.gender ? user.gender : "Chưa có thông tin"}
            </p>
          )}
        </div>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#222222]">Số điện thoại</p>
            {editingField !== "phone" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("phone", user.phone)}
              >
                Thay đổi
              </Button>
            )}
          </div>
          {editingField === "phone" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <p className="text-[16px] text-[#222222] mb-2">
                Nhập số điện thoại
              </p>
              <Input
                style={{ height: 50, borderRadius: 0 }}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="text-[16px] text-[#757575]"
              />
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  onClick={() => handleSave("phone")}
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#757575]">
              {user.phone ? user.phone : "Chưa có thông tin"}
            </p>
          )}
        </div>
        <div className="border-b border-[#E5E5E5] flex flex-col pb-[20px] mb-[20px]">
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#222222]">Địa chỉ</p>
            {editingField !== "address" && (
              <Button
                className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                color="default"
                variant="link"
                onClick={() => handleEdit("address", user.address)}
              >
                Thay đổi
              </Button>
            )}
          </div>
          {editingField === "address" ? (
            <div className="mt-[30px] p-[18px] border border-[#e5e5e5] bg-[#fcfaf6] rounded-[6px]">
              <p className="text-[16px] text-[#222222] mb-2">Nhập địa chỉ</p>
              <Input
                style={{ height: 50, borderRadius: 0 }}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Nhập địa chỉ"
                className="text-[16px] text-[#757575]"
              />
              <div className="flex justify-between mt-5">
                <Button
                  style={{ borderRadius: 0 }}
                  className="!text-[#fff] !px-7 !py-6 text-[14px] !border-0  !bg-[#c4302e]"
                  color="default"
                  onClick={() => handleSave("address")}
                >
                  Lưu
                </Button>
                <Button
                  className="!text-[#9f9f9f] underline !p-0 text-[14px]"
                  color="default"
                  variant="link"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#757575]">
              {user.address ? user.address : "Chưa có thông tin"}
            </p>
          )}
        </div>
      </div>
      {user.role?.role_name === "user" && (
        <div id="saved">
          <h1 className="mb-[24px] font-title text-[24px] font-[700]">
            Tin đã lưu
          </h1>
          {isSavedNews.length > 0 ? (
            <div>
              {currentSavedNews?.map((item) => (
                <News
                  key={item._id}
                  {...item}
                  heading={item.title}
                  title
                  semiMedium
                  sizeSemiSmall
                  noTime
                />
              ))}
              {isSavedNews.length > pageSize && (
                <Pagination
                  className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                  align="center"
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={pageSize}
                  total={isSavedNews.length}
                  onChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          ) : (
            <Empty
              className="flex flex-col justify-center items-center h-[50vh]"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có bài viết nào"
            />
          )}
        </div>
      )}
    </section>
  );
}

export default Info;
