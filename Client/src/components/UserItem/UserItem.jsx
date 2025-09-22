import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  Badge,
  Tag,
  Dropdown,
  Divider,
  Menu,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SettingOutlined,
  GiftOutlined,
  EyeOutlined,
  UserSwitchOutlined,
  LockOutlined,
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { startLoading, stopLoading } from "~/redux/loadingSlice";
import {
  deleteUser,
  banUserAPI,
  unbanUserAPI,
  getAllUsersWithoutAuth,
  updateRoleUser,
  updateUserAPI,
  getAllUsers,
} from "~/api";

const UserItem = React.memo(function UserItem({
  users,
  setUsers,
  currenUser,
  setAllUsers,
}) {
  const dispatch = useDispatch();
  const [modalContent, setModalContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [form] = Form.useForm();

  // Để ra 1 folder data riêng
  const roles = [
    { key: "reporter", label: "Phóng viên" },
    { key: "editor", label: "Biên tập viên" },
    { key: "user", label: "Người dùng" },
    { key: "moderator", label: "Người kiểm duyệt" },
  ];

  const roleDisplayMap = {
    admin: "Tổng biên tập",
    editor: "Biên tập viên",
    reporter: "Phóng viên",
    user: "Người dùng",
    moderator: "Người kiểm duyệt",
  };

  const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
  ];

  const roleColorMap = {
    "Phóng viên": "blue",
    "Biên tập viên": "purple",
    "Người dùng": "default",
    "Người kiểm duyệt": "orange",
  };

  const showModal = (title, content, userId) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(userId);
  };

  const handleCancel = () => {
    setModalVisible(null);
  };

  const handleDeleteUser = async (id) => {
    try {
      dispatch(startLoading());
      await deleteUser(id);
      const res = await getAllUsersWithoutAuth(currenUser._id);
      setUsers(res.data);
      setModalVisible(false);
      dispatch(stopLoading());
      message.success("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      dispatch(stopLoading());
    }
  };

  const handleBanUser = async (userId, values) => {
    try {
      dispatch(startLoading());
      const payload = {
        days: 1,
        ...values,
      };
      await banUserAPI(userId, payload);
      const res = await getAllUsersWithoutAuth(currenUser._id);
      const resAllUser = await getAllUsers();
      setUsers(res.data);
      setAllUsers(resAllUser.data);
      setModalVisible(false);
      dispatch(stopLoading());
      message.success("Cấm người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi cấm người dùng:", error);
      dispatch(stopLoading());
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      dispatch(startLoading());
      await unbanUserAPI(userId);
      const res = await getAllUsersWithoutAuth(currenUser._id);
      const resAllUser = await getAllUsers();
      setAllUsers(resAllUser.data);
      setUsers(res.data);
      setModalVisible(false);
      dispatch(stopLoading());
      message.success("Mở tài khoản người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi mở tài khoản người dùng:", err);
      dispatch(stopLoading());
    }
  };

  const handleUpdateRole = async (userId, values) => {
    try {
      dispatch(startLoading());
      const payload = { ...values };
      await updateRoleUser(userId, payload);
      const res = await getAllUsersWithoutAuth(currenUser._id);
      setUsers(res.data);
      setModalVisible(false);
      dispatch(stopLoading());
      message.success("Cập nhập vai trò thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
      dispatch(stopLoading());
    }
  };

  const handleUpdateUser = async (userId, values) => {
    try {
      dispatch(startLoading());
      const payload = {
        ...values,
        birth_date: values.birth_date
          ? values.birth_date.format("YYYY-MM-DD")
          : undefined,
      };
      await updateUserAPI(userId, payload);
      const res = await getAllUsersWithoutAuth(currenUser._id);
      setUsers(res.data);
      setModalVisible(false);
      dispatch(stopLoading());
      message.success("Cập nhật thông tin người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      dispatch(stopLoading());
    }
  };

  return (
    <>
      {users.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center gap-[30px] border-b border-[#E5E5E5] hover:bg-[rgba(147,149,153,0.1)] transition-all duration-200 ease-in-out"
        >
          <div className="max-w-[300px] w-full p-[16px] flex gap-3">
            <img
              alt="Avatar"
              loading="lazy"
              className="w-[40px] h-[40px] object-cover rounded-full"
              src={user.avatar}
            />
            <div className="flex flex-col">
              <p className="text-[#222222] font-[600] text-[14px]">
                {user.full_name}
              </p>
              <p className="text-[#757575] font-[500] text-[12px]">
                {user.email}
              </p>
            </div>
          </div>
          <div className="min-w-[130px]">
            <Tag
              className="!px-2 !rounded-full"
              color={
                roleColorMap[
                  roleDisplayMap[user.role?.role_name] || user.role?.role_name
                ] || "default"
              }
            >
              {roleDisplayMap[user.role?.role_name] || user.role?.role_name}
            </Tag>
          </div>

          <p className="text-[14px]">
            <strong>Ngày tham gia: </strong>
            {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          {!user.banUntil ? (
            <Badge
              status="success"
              text={<span style={{ color: "#52c41a" }}>Đang hoạt động</span>}
            />
          ) : (
            <Badge
              color="#f50"
              text={<span style={{ color: "#f50" }}>Tạm thời khóa</span>}
            />
          )}
          <div className="flex flex-col gap-[6px] p-[16px]">
            <Dropdown
              arrow
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.Item
                    key="view"
                    icon={
                      <EyeOutlined
                        style={{ fontSize: "16px", paddingRight: 8 }}
                      />
                    }
                    onClick={() =>
                      showModal(
                        <h3 className="text-[#222222] font-[600] text-[20px] mb-[10px]">
                          <span className="mr-3">
                            <EyeOutlined />
                          </span>
                          Chi tiết người dùng
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-[20px] border border-[#E5E5E5] p-[20px] rounded-[8px]">
                            <img
                              alt="Avatar"
                              loading="lazy"
                              className="size-[100px] rounded-full object-cover"
                              src={user.avatar}
                            />
                            <div className="flex flex-col gap-1">
                              <h2 className="text-[#333] text-[22px] font-[600]">
                                {user.full_name}
                              </h2>
                              <p className="text-[14px]">
                                <strong>Vai trò:</strong>{" "}
                                {roleDisplayMap[user.role?.role_name] ||
                                  user.role?.role_name}
                              </p>
                              {!user.banUntil ? (
                                <Badge
                                  status="success"
                                  text={
                                    <span style={{ color: "#52c41a" }}>
                                      Đang hoạt động
                                    </span>
                                  }
                                />
                              ) : (
                                <Badge
                                  color="#f50"
                                  text={
                                    <span style={{ color: "#f50" }}>
                                      Tạm thời khóa
                                    </span>
                                  }
                                />
                              )}
                            </div>
                          </div>
                          <div className="border border-[#E5E5E5] p-[20px] rounded-[8px]">
                            <h2 className="text-[#333] text-[18px] font-[600]">
                              Thông tin người dùng
                            </h2>
                            <ul className="text-[16px] text-[#333] mt-[8px] flex flex-col justify-center gap-[10px]">
                              <li>
                                <span className="mr-3">
                                  <MailOutlined />
                                </span>
                                {user.email}
                              </li>
                              <li>
                                <span className="mr-3">
                                  <PhoneOutlined />
                                </span>
                                {user.phone ? user.phone : "Chưa có thông tin"}
                              </li>
                              <li>
                                <span className="mr-3">
                                  <EnvironmentOutlined />
                                </span>
                                {user.address
                                  ? user.address
                                  : "Chưa có thông tin"}
                              </li>
                              <li>
                                <span className="mr-3">
                                  <CalendarOutlined />
                                </span>
                                {dayjs(user.createdAt).format("DD/MM/YYYY")}
                              </li>
                              <li>
                                <span className="mr-3">
                                  <GiftOutlined />
                                </span>
                                {user.birth_date
                                  ? dayjs(user.birth_date).format("DD/MM/YYYY")
                                  : "Chưa có thông tin"}
                              </li>
                            </ul>
                          </div>
                        </div>,
                        user._id
                      )
                    }
                  >
                    Xem chi tiết
                  </Menu.Item>
                  <Menu.Item
                    key="update"
                    icon={
                      <EditOutlined
                        style={{ fontSize: "16px", paddingRight: 8 }}
                      />
                    }
                    onClick={() =>
                      showModal(
                        <h3 className="text-[#222222] font-[600] text-[20px] mb-[10px]">
                          <span className="mr-3">
                            <EditOutlined />
                          </span>
                          Sửa thông tin người dùng
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <p className="text-[#71717A] text-[14px]">
                            Cập nhật thông tin cá nhân của người dùng{" "}
                            <strong className="text-[#333]">
                              "{user.full_name}"
                            </strong>{" "}
                            .Nhấn cập nhập để hoàn tất.
                          </p>
                          <Form
                            className="border border-[#E5E5E5] !p-[16px] rounded-[8px]"
                            form={form}
                            layout="vertical"
                            onFinish={(values) =>
                              handleUpdateUser(user._id, values)
                            }
                            initialValues={{
                              phone: user.phone,
                              birth_date: user.birth_date
                                ? dayjs(user.birth_date)
                                : null,
                              gender: user.gender,
                              address: user.address,
                            }}
                          >
                            <Row gutter={16}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Số điện thoại"
                                  name="phone"
                                  rules={[
                                    {
                                      pattern: /^[0-9+\-\s()]+$/,
                                      message: "Số điện thoại không hợp lệ!",
                                    },
                                  ]}
                                >
                                  <Input
                                    style={{ height: 40 }}
                                    placeholder="Nhập số điện thoại"
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item label="Ngày sinh" name="birth_date">
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    style={{ height: 40, width: "100%" }}
                                    placeholder="Nhập ngày sinh"
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={12}>
                                <Form.Item label="Giới tính" name="gender">
                                  <Select
                                    style={{ height: 40 }}
                                    placeholder={
                                      user.gender || "Chọn giới tính"
                                    }
                                  >
                                    {genderOptions.map((option) => (
                                      <Option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item label="Địa chỉ" name="address">
                              <Input
                                style={{ height: 40 }}
                                placeholder="Nhập địa chỉ"
                              />
                            </Form.Item>

                            <div className="flex gap-3 justify-end">
                              <Button onClick={handleCancel}>Hủy</Button>
                              <Button type="primary" htmlType="submit">
                                Cập nhật
                              </Button>
                            </div>
                          </Form>
                        </div>,
                        user._id
                      )
                    }
                  >
                    Sửa thông tin
                  </Menu.Item>
                  <Menu.Item
                    key="role"
                    icon={
                      <UserSwitchOutlined
                        style={{ fontSize: "16px", paddingRight: 8 }}
                      />
                    }
                    onClick={() =>
                      showModal(
                        <h3 className="text-[#222222] font-[600] text-[20px] mb-[10px]">
                          <span className="mr-3">
                            <UserSwitchOutlined />
                          </span>
                          Đổi vai trò người dùng
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <p className="text-[#71717A] text-[14px]">
                            Thay đổi vai trò của người dùng{" "}
                            <strong className="text-[#333]">
                              "{user.full_name}"
                            </strong>{" "}
                            ?
                          </p>
                          <div>
                            <p className="text-[14px] mb-[8px]">
                              Vai trò hiện tại:{" "}
                              <Tag
                                className="!px-2 !rounded-full"
                                color="green"
                              >
                                {roleDisplayMap[user.role?.role_name] ||
                                  user.role?.role_name}
                              </Tag>
                            </p>
                            <Form
                              form={form}
                              layout="vertical"
                              onFinish={(values) =>
                                handleUpdateRole(user._id, values)
                              }
                            >
                              <Form.Item
                                name="role_name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng chọn vai trò!",
                                  },
                                ]}
                              >
                                <Select
                                  defaultValue="Chọn vai trò mới"
                                  style={{ height: 40, width: "100%" }}
                                >
                                  {roles.map(({ key, label }) => (
                                    <Select.Option
                                      key={key}
                                      value={key}
                                      disabled={key === user.role?.role_name}
                                    >
                                      {label}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <div className="flex gap-3 justify-end">
                                <Button onClick={handleCancel}>Hủy</Button>
                                <Button type="primary" htmlType="submit">
                                  Cập nhật
                                </Button>
                              </div>
                            </Form>
                          </div>
                        </div>,
                        user._id
                      )
                    }
                  >
                    Đổi vai trò
                  </Menu.Item>
                  <Divider className="!my-1" />
                  <Menu.Item
                    key="lock"
                    className={
                      user.isActive
                        ? "!text-[#ff4d4f] hover:!bg-[#ff4d4f] hover:!text-white"
                        : "!text-[#52c41a] hover:!bg-green-500 hover:!text-white"
                    }
                    icon={
                      user.isActive ? (
                        <LockOutlined
                          style={{ fontSize: "16px", paddingRight: 8 }}
                        />
                      ) : (
                        <UnlockOutlined
                          style={{ fontSize: "16px", paddingRight: 8 }}
                        />
                      )
                    }
                    onClick={() =>
                      showModal(
                        user.isActive ? (
                          <h3 className="text-[#ff4d4f] font-[600] text-[18px] mb-[10px]">
                            <span className="mr-3">
                              <LockOutlined />
                            </span>
                            Khóa tài khoản
                          </h3>
                        ) : (
                          <h3 className="text-[#52c41a] font-[600] text-[18px] mb-[10px]">
                            <span className="mr-3">
                              <UnlockOutlined />
                            </span>
                            Mở khóa tài khoản
                          </h3>
                        ),
                        user.isActive ? (
                          <div className="flex flex-col gap-4">
                            <p className="text-[#71717A] text-[14px]">
                              Bạn có chắc chắn muốn khóa người dùng{" "}
                              <strong className="text-[#333]">
                                "{user.full_name}"
                              </strong>{" "}
                              ?
                            </p>
                            <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                              <WarningOutlined style={{ marginRight: 8 }} />
                              <strong>Cảnh báo:</strong> Người dùng sẽ không thể
                              đăng nhập sau khi tài khoản bị khóa.
                            </div>
                            <Form
                              form={form}
                              layout="vertical"
                              onFinish={(values) =>
                                handleBanUser(user._id, values)
                              }
                            >
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập lý do khóa!",
                                  },
                                ]}
                                label="Lý do khóa"
                                name="reason"
                              >
                                <Input
                                  placeholder="Nhập lý do khóa"
                                  style={{ height: 40 }}
                                />
                              </Form.Item>
                              <div className="flex gap-3 justify-end">
                                <Button onClick={handleCancel}>Hủy</Button>
                                <Button
                                  variant="solid"
                                  color="danger"
                                  htmlType="submit"
                                >
                                  Khóa tài khoản
                                </Button>
                              </div>
                            </Form>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <p className="text-[#71717A] text-[14px]">
                              Bạn có chắc chắn muốn mở khóa người dùng{" "}
                              <strong className="text-[#333]">
                                "{user.full_name}"
                              </strong>{" "}
                              ?
                            </p>
                            <div>
                              <p className="text-[14px] mb-[8px]">
                                Thông tin khóa:
                              </p>
                              <div className="bg-[rgba(0,0,0,0.05)] p-[12px] rounded-[8px]">
                                <p className="text-[14px]">
                                  <strong>Lý do: </strong>
                                  {user.banReason || "Không có lý do"}
                                </p>
                                <p className="text-[14px]">
                                  <strong>Ngày khóa: </strong>
                                  {dayjs(user.updatedAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                              <CheckCircleOutlined style={{ marginRight: 8 }} />
                              Người dùng sẽ có thể đăng nhập lại sau khi mở
                              khóa.
                            </div>
                            <div className="flex gap-3 justify-end">
                              <Button onClick={handleCancel}>Hủy</Button>
                              <Button
                                variant="solid"
                                style={{
                                  color: "#fff",
                                  borderColor: "#52c41a",
                                  backgroundColor: "#52c41a",
                                }}
                                onClick={() => handleUnbanUser(user._id)}
                              >
                                Mở tài khoản
                              </Button>
                            </div>
                          </div>
                        ),
                        user._id
                      )
                    }
                  >
                    {user.isActive ? "Khóa tài khoản" : "Mở tài khoản"}
                  </Menu.Item>
                  <Menu.Item
                    key="delete"
                    icon={
                      <DeleteOutlined
                        style={{ fontSize: "16px", paddingRight: 8 }}
                      />
                    }
                    danger
                    onClick={() =>
                      showModal(
                        <h3 className="text-[#ff4d4f] font-[600] text-[18px] mb-[10px]">
                          <span className="mr-3">
                            <DeleteOutlined />
                          </span>
                          Xóa người dùng
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <p className="text-[#71717A] text-[14px]">
                            Bạn có chắc chắn muốn xóa người dùng{" "}
                            <strong className="text-[#333]">
                              "{user.full_name}"
                            </strong>{" "}
                            ?
                          </p>
                          <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                            <WarningOutlined style={{ marginRight: 8 }} />
                            <strong>Cảnh báo:</strong> Hành động này không thể
                            hoàn tác. Tất cả dữ liệu của người dùng sẽ bị xóa
                            vĩnh viễn.
                          </div>
                          <div className="flex gap-3 justify-end">
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button
                              variant="solid"
                              color="danger"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Xóa người dùng
                            </Button>
                          </div>
                        </div>,
                        user._id
                      )
                    }
                  >
                    Xóa người dùng
                  </Menu.Item>
                </Menu>
              }
            >
              <Button
                type="text"
                icon={<SettingOutlined />}
                className="border-none shadow-none hover:bg-transparent"
              />
            </Dropdown>

            <Modal
              open={modalVisible === user._id}
              title={modalTitle}
              onCancel={handleCancel}
              onOk={() => {
                handleCancel();
              }}
              footer={null}
            >
              {modalContent}
            </Modal>
          </div>
        </div>
      ))}
    </>
  );
});

export default UserItem;
