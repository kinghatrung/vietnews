import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  Modal,
  Form,
  Input,
  Empty,
  Pagination,
  message,
  DatePicker,
  Select,
  Badge,
} from "antd";
import {
  UserOutlined,
  UserSwitchOutlined,
  UnlockOutlined,
  LockOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import {
  handleRegisterAPI,
  getAllUsersWithoutAuth,
  sendOtpAPI,
  getAllUsers,
} from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import UserItem from "~/components/UserItem";

const { RangePicker } = DatePicker;
const { Search } = Input;

function UserMange() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("1");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [dates, setDates] = useState([]);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const user = useSelector((state) => state.auth.login?.currentUser);
  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = users.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        dispatch(startLoading());
        const res = await getAllUsers();
        setAllUsers(res.data.reverse());
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        dispatch(stopLoading());
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(startLoading());
        let roles = [];

        if (activeTab === "2") roles = ["reporter"];
        if (activeTab === "3") roles = ["editor"];
        if (activeTab === "4") roles = ["moderator"];
        if (activeTab === "5") roles = ["user"];

        const startDate = dates?.[0]?.format("YYYY-MM-DD") || "";
        const endDate = dates?.[1]?.format("YYYY-MM-DD") || "";

        const res = await getAllUsersWithoutAuth(
          user._id,
          roles,
          startDate,
          endDate,
          searchKey,
          status
        );

        setUsers(res.data.reverse());
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        dispatch(stopLoading());
      }
    };

    fetchUsers();
  }, [activeTab, dates, searchKey, status]);

  const items = [
    {
      key: "1",
      label: "Tất cả",
      children:
        users.length > 0 ? (
          <>
            <UserItem
              setAllUsers={setAllUsers}
              users={currentNews}
              setUsers={setUsers}
              currenUser={user}
            />
            {users.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={users.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có người dùng nào"
          />
        ),
    },
    {
      key: "2",
      label: "Phóng viên",
      children:
        users.length > 0 ? (
          <>
            <UserItem
              users={currentNews}
              setAllUsers={setAllUsers}
              setUsers={setUsers}
              currenUser={user}
            />
            {users.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={users.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có người dùng nào"
          />
        ),
    },
    {
      key: "3",
      label: "Biên tập viên",
      children:
        users.length > 0 ? (
          <>
            <UserItem
              users={currentNews}
              setAllUsers={setAllUsers}
              setUsers={setUsers}
              currenUser={user}
            />
            {users.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={users.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có người dùng nào"
          />
        ),
    },
    {
      key: "4",
      label: "Người kiểm duyệt",
      children:
        users.length > 0 ? (
          <>
            <UserItem
              users={currentNews}
              setAllUsers={setAllUsers}
              setUsers={setUsers}
              currenUser={user}
            />
            {users.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={users.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có người dùng nào"
          />
        ),
    },
    {
      key: "5",
      label: "Người dùng",
      children:
        users.length > 0 ? (
          <>
            <UserItem
              users={currentNews}
              setAllUsers={setAllUsers}
              setUsers={setUsers}
              currenUser={user}
            />
            {users.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={users.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có người dùng nào"
          />
        ),
    },
  ];

  const activeCount = allUsers.filter((user) => user.isActive).length;
  const inactiveCount = allUsers.filter((user) => !user.isActive).length;

  // Số người dùng mới tạo trong 1 tháng
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const newUsers = allUsers.filter((user) => {
    const createdDate = new Date(user.createdAt);
    return createdDate >= oneMonthAgo;
  });

  const handleSendOtp = async () => {
    await sendOtpAPI(email);
  };

  const handleAddUser = async (values) => {
    try {
      dispatch(startLoading());
      const payload = {
        ...values,
        email: email,
      };

      await handleRegisterAPI(payload);
      const res = await getAllUsersWithoutAuth(user._id);
      setUsers(res.data);
      setEmail("");
      form.resetFields();
      setIsModalOpen(false);
      dispatch(stopLoading());
      message.success("Tạo người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      dispatch(stopLoading());
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-1 gap-[24px] mb-[20px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#222222] font-[700] text-[24px]">
            Danh sách người dùng
          </h2>
          <p className="text-[14px] text-[#757575]">
            Quản lý thông tin và quyền hạn của tất cả người dùng
          </p>
        </div>

        <>
          <Button onClick={() => setIsModalOpen(!isModalOpen)}>
            Tạo người dùng
          </Button>
          <Modal
            open={isModalOpen}
            width={600}
            form={form}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <h2 className="text-[#222222] font-[700] text-[24px] mb-[20px]">
              Tạo người dùng
            </h2>
            <Form
              form={form}
              onFinish={handleAddUser}
              name="register"
              layout="vertical"
              className="!mb-4"
            >
              <Form.Item
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
                  style={{ height: 40 }}
                  type="email"
                  placeholder="Nhập Email của bạn"
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
                    style={{ height: 40 }}
                    type="text"
                    placeholder="Nhập mã OTP"
                  />
                  <Button
                    style={{ height: 40 }}
                    type="primary"
                    onClick={handleSendOtp}
                  >
                    Gửi mã OTP
                  </Button>
                </div>
              </Form.Item>

              <Form.Item
                layout="vertical"
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
                  style={{ height: 40 }}
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                />
              </Form.Item>

              <Form.Item
                layout="vertical"
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
                  style={{ height: 40 }}
                  type="text"
                  placeholder="Nhập tên đăng nhập của bạn"
                />
              </Form.Item>

              <Form.Item
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
                  style={{ height: 40 }}
                  placeholder="Hãy nhập mật khẩu"
                />
              </Form.Item>

              <Form.Item
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
                  style={{ height: 40 }}
                  placeholder="Hãy nhập lại mật khẩu"
                />
              </Form.Item>

              <Form.Item className="!m-0">
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  style={{ height: 50 }}
                >
                  Tạo người dùng mới
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>

      <div className="flex justify-between items-center w-full gap-[18px]">
        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng số người dùng
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {allUsers.length}
            </p>
          </div>
          <UserOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Đang hoạt động
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {activeCount}
            </p>
          </div>
          <UnlockOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">Đã khóa</h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {inactiveCount}
            </p>
          </div>
          <LockOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Người dùng mới
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {newUsers.length}
            </p>
            <p className="text-[12px] text-[#6b7280]">Tháng này</p>
          </div>
          <UsergroupAddOutlined style={{ fontSize: 32 }} />
        </div>
      </div>

      <div className="p-[24px] border border-[#E5E5E5] rounded-[8px] bg-gray-50">
        <h3 className="text-[#222222] font-[700] text-[24px] mb-[24px]">
          Bộ lọc và tìm kiếm
        </h3>
        <div className="flex items-center gap-[12px]">
          <Search
            className="search-user"
            placeholder="Tìm kiếm người dùng"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />

          <div className="flex items-center gap-[12px]">
            <Select
              style={{ height: 45, width: 280 }}
              placeholder="Trạng thái người dùng"
              defaultActiveFirstOption="Tất cả"
              value={status}
              onChange={(value) => setStatus(value)}
            >
              <Option value="">Tất cả</Option>
              <Option key="active" value="active">
                Hoạt động
              </Option>
              <Option key="inactive" value="inactive">
                Không hoạt động
              </Option>
            </Select>

            <RangePicker
              format="DD/MM/YYYY"
              style={{ height: 45, width: 280 }}
              placeholder="Ngày tham gia"
              onChange={(values) => setDates(values)}
            />
          </div>
        </div>
      </div>

      <Tabs items={items} activeKey={activeTab} onChange={setActiveTab} />
    </section>
  );
}

export default UserMange;
