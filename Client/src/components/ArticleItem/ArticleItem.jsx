import { useDispatch } from "react-redux";
import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Select,
  Upload,
  Modal,
  Form,
  Input,
  Dropdown,
  Menu,
  Divider,
  Tag,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  InboxOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserOutlined,
  CalendarOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import FroalaEditor from "react-froala-wysiwyg";
import LazyLoad from "react-lazyload";

import {
  deleteArticleAPI,
  putArticleAPI,
  changeStatusArticleAPI,
  checkContentArticleAPI,
  imageUploadAPI,
  getArticleByIdAPI,
} from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_API_URL
    : "/";

dayjs.extend(relativeTime);
dayjs.locale("vi");
const { Option } = Select;

const ArticleItem = React.memo(function ArticleItem({
  articles,
  categories,
  editors,
  user,
  statuses,
  setArticles,
  searchKey,
  startDate,
  endDate,
  status,
}) {
  const dispatch = useDispatch();
  const [isToxic, setIsToxic] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [toxic, setToxic] = useState([]);
  const [content, setContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [form] = Form.useForm();

  const statusSlice = statuses.slice(0, 6);
  const colorList = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  const getRandomColor = () => {
    const index = Math.floor(Math.random() * colorList.length);
    return colorList[index];
  };

  const isStatusAllowed = (role, statusName, currentStatus) => {
    if (currentStatus === "Đã đăng tải") {
      return statusName === "Đã đăng tải";
    }

    const rolePermissions = {
      reporter: ["Đang chờ", "Chờ chỉnh sửa"],
      editor: ["Chờ chỉnh sửa", "Đang chỉnh sửa", "Chờ phê duyệt"],
      admin: ["Chờ phê duyệt", "Đang phê duyệt", "Đã đăng tải"],
    };

    const allowedStatuses = rolePermissions[role] || [];

    if (!allowedStatuses.includes(currentStatus)) {
      return false;
    }

    return allowedStatuses.includes(statusName);
  };

  const showModal = (title, content, articleId) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(articleId);
  };

  const handleCancel = () => {
    setModalVisible(null);
    setIsToxic(false);
  };

  const handleDelete = useCallback(
    async (id) => {
      try {
        dispatch(startLoading());
        await deleteArticleAPI(id);
        const res = await getArticleByIdAPI(
          user.role.role_name,
          user._id,
          searchKey,
          startDate,
          endDate,
          status
        );
        setArticles(res.data.reverse());
        message.success("Xóa bài viết thành công!");
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        dispatch(stopLoading());
      }
    },
    [dispatch, setArticles, user]
  );

  const handleUpdateArticle = useCallback(
    async (id, values) => {
      try {
        dispatch(startLoading());
        const payload = {
          ...values,
          image: values.image?.file?.response?.link || values.image,
          content: content || values.content,
        };
        await putArticleAPI(id, payload);
        const res = await getArticleByIdAPI(
          user.role.role_name,
          user._id,
          searchKey,
          startDate,
          endDate,
          status
        );
        setArticles(res.data.reverse());
        form.resetFields();
        message.success("Sửa bài viết thành công!");
        dispatch(stopLoading());
      } catch (error) {
        dispatch(stopLoading());
        console.error("Lỗi khi lưu bài viết:", error);
        message.error("Lỗi khi sửa bài viết!");
      }
    },
    [dispatch, setArticles, user, content, form]
  );

  const handleImageUpload = useCallback(async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");
    try {
      const res = await imageUploadAPI(formData);
      onSuccess(res.data);
    } catch (err) {
      console.error("Image upload failed:", err);
      onError(err);
    }
  }, []);

  const handleCheckContent = useCallback(async (content) => {
    try {
      dispatch(startLoading());
      const response = await checkContentArticleAPI({ content });
      setToxic(response.data.toxicSentences);
      dispatch(stopLoading());
      if (!response.data.isToxic) {
        // setIsToxic(false);
        message.success("Nội dung bài viết hợp lệ!");
      } else {
        setIsToxic(true);
        message.error(
          "Tổng số câu có chứa từ toxic trong bài viết: " +
            response.data.totalToxic
        );
      }
    } catch (err) {
      dispatch(stopLoading());
      message.error("Lỗi kiểm tra nội dung!");
    }
  }, []);

  return (
    <>
      {articles.map((article) => (
        <div
          className="flex justify-between items-center gap-[30px] border-b border-[#E5E5E5] pb-[20px] mb-[20px]"
          key={article._id}
        >
          <div className="flex gap-[20px]">
            <LazyLoad height={100} offset={100} once>
              <img
                alt="Ảnh bài viết"
                loading="lazy"
                src={article.image}
                className="w-[180px] h-[100px] object-cover"
              />
            </LazyLoad>
            <div className="max-w-[400px]">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[#222222] font-[600] text-[16px]">
                  {article.reporter?.full_name}
                </p>
                <p className="text-[#757575] font-[500] text-[12px]">
                  {article.reporter?.email}
                </p>
              </div>
              <h2 className="mb-1 text-[14px] truncate">{article.title}</h2>
              <p className="mb-1 truncate w-full text-[#757575]">
                {article.describe}
              </p>
              <p className="text-[12px] text-[#757575] ">
                <ClockCircleOutlined /> {dayjs(article.createdAt).fromNow()}
              </p>
            </div>
          </div>

          <div className="min-w-[130px]">
            <Tag className="!px-2 !rounded-full" color={getRandomColor()}>
              {article.category.category_name}
            </Tag>
          </div>

          <div className="min-w-[140px]">
            <p
              className={
                article.note
                  ? "text-[#222222] text-center text-[14px]"
                  : "text-[#222222] font-[600] text-center text-[14px]"
              }
            >
              {article.note ? article.note : "Không có ghi chú"}
            </p>
          </div>
          <Select
            value={article.status.status_name}
            style={{ width: 180 }}
            disabled={article.status.status_name === "Đã đăng tải"}
            onChange={(value) => {
              const newStatus = statusSlice.find((s) => s._id === value);
              Modal.confirm({
                title: "Xác nhận gửi bài?",
                content: `Bạn có chắc muốn chuyển bài viết sang trạng thái "${newStatus.status_name}"?`,
                okText: "Xác nhận",
                cancelText: "Hủy",
                onOk: async () => {
                  try {
                    dispatch(startLoading());
                    await changeStatusArticleAPI(article._id, {
                      status_name: newStatus?.status_name,
                    });
                    const res = await getArticleByIdAPI(
                      user.role.role_name,
                      user._id,
                      searchKey,
                      startDate,
                      endDate,
                      status
                    );
                    setArticles([...res.data].reverse());
                    message.success("Chuyển trạng thái thành công!");
                    dispatch(stopLoading());
                  } catch (error) {
                    console.error("Lỗi chuyển trạng thái:", error);
                    message.error("Chuyển trạng thái thất bại!");
                    dispatch(stopLoading());
                  }
                },
              });
            }}
          >
            {statusSlice.map((status) => (
              <Option
                disabled={
                  !isStatusAllowed(
                    user.role?.role_name,
                    status.status_name,
                    article.status.status_name
                  )
                }
                key={status._id}
                value={status._id}
              >
                {status.status_name}
              </Option>
            ))}
          </Select>

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
                      null,
                      <div className="flex flex-col gap-4">
                        <h2 className="font-[600] text-[24px]">
                          {article.title}
                        </h2>
                        <div className="flex gap-5 mb-[12px]">
                          <Tag className="!px-2 !rounded-full" color="green">
                            {article.category?.category_name}
                          </Tag>
                          <p className="text-[14px] text-[#71717A]">
                            <span className="mr-2">
                              <UserOutlined />
                            </span>
                            {article.reporter?.full_name}
                          </p>

                          <p className="text-[14px] text-[#71717A]">
                            <span className="mr-2">
                              <CalendarOutlined />
                            </span>
                            {dayjs(article.createdAt).format("DD/MM/YYYY")}
                          </p>
                        </div>
                        {user.role.role_name === "editor" &&
                          article.status.status_name === "Đang chỉnh sửa" && (
                            <Button
                              type="primary"
                              onClick={() =>
                                handleCheckContent(article.content)
                              }
                            >
                              Kiểm tra nội dung
                            </Button>
                          )}

                        {isToxic && (
                          <div className="border border-[#E5E5E5] p-[16px] rounded-[8px]">
                            <h3 className="font-[600] text-[20px] mb-[12px]">
                              Các câu có thể chứa các từ toxic
                            </h3>
                            {toxic.map((item, index) => (
                              <p key={index} className="text-[14px]">
                                <strong>Câu {index + 1}: </strong>
                                {item.sentence}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="border border-[#E5E5E5] p-[16px] rounded-[8px]">
                          <p className="text-[16px] font-[600]">
                            {article.describe}
                          </p>

                          <div
                            className="mb-[20px]"
                            dangerouslySetInnerHTML={{
                              __html: article.content,
                            }}
                          />

                          <a
                            href={article.source}
                            className="text-[12px] t-[100px] hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <strong>Nguồn tham khảo:</strong> {article.source}
                          </a>
                        </div>
                      </div>,
                      article._id
                    )
                  }
                >
                  Xem chi tiết
                </Menu.Item>
                {(user.role.role_name === "reporter" &&
                  article.status?.status_name === "Đang chờ") ||
                (user.role.role_name === "editor" &&
                  article.status?.status_name === "Đang chỉnh sửa") ? (
                  <Menu.Item
                    key="update"
                    icon={
                      <EditOutlined
                        style={{ fontSize: "16px", paddingRight: 8 }}
                      />
                    }
                    onClick={() => {
                      setContent(article.content);
                      form.setFieldsValue({
                        content: article.content,
                        title: article.title,
                        describe: article.describe,
                        editor: article.editor._id,
                        category: article.category._id,
                        image: article.image,
                        note: article.note,
                      });
                      showModal(
                        <h3 className="text-[#222222] font-[600] text-[20px] mb-[10px]">
                          <span className="mr-3">
                            <EditOutlined />
                          </span>
                          Sửa thông tin bài viết
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <p className="text-[#71717A] text-[14px]">
                            Sửa thông tin bài viết của phóng viên{" "}
                            <strong className="text-[#333]">
                              "{article.reporter?.full_name}"
                            </strong>{" "}
                            .Nhấn cập nhập để hoàn tất.
                          </p>
                          <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={(values) => {
                              handleUpdateArticle(article._id, values);
                            }}
                          >
                            <Form.Item
                              label="Tiêu đề bài viết"
                              name="title"
                              rules={[
                                {
                                  required: true,
                                  message: "Hãy điền thông tin",
                                },
                              ]}
                            >
                              <Input style={{ height: 40 }} />
                            </Form.Item>

                            <Form.Item
                              label="Tiêu đề phụ bài viết"
                              name="describe"
                              rules={[
                                {
                                  required: true,
                                  message: "Hãy điền thông tin",
                                },
                              ]}
                            >
                              <Input style={{ height: 40 }} />
                            </Form.Item>

                            <Form.Item name="content" label="Nội dung bài viết">
                              <FroalaEditor
                                key={article._id}
                                tag="textarea"
                                onModelChange={(newContent) => {
                                  form.setFieldsValue({
                                    content: newContent,
                                  });
                                  setContent(newContent);
                                }}
                                config={{
                                  placeholderText: "Nhập nội dung...",
                                  imageUploadURL: `${API_URL}/api/upload/image_upload`,
                                  imageUploadParam: "file",
                                  imageUploadMethod: "POST",
                                  imageAllowedTypes: ["jpeg", "jpg", "png"],
                                  requestWithCORS: true,
                                  crossDomain: true,
                                  charCounterCount: true,
                                  events: {
                                    initialized: function () {
                                      this.html.set(article.content);
                                    },
                                  },
                                }}
                              />
                            </Form.Item>
                            {user.role.role_name === "reporter" && (
                              <Form.Item
                                name="editor"
                                label="Chọn biên tập viên"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng chọn biên tập viên",
                                  },
                                ]}
                              >
                                <Select
                                  style={{ height: 40 }}
                                  placeholder="Chọn biên tập viên"
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                >
                                  {editors.map((editor) => (
                                    <Option key={editor._id} value={editor._id}>
                                      {editor.full_name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}

                            <Form.Item
                              name="category"
                              label="Chọn danh mục bài viết"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn danh mục",
                                },
                              ]}
                            >
                              <Select
                                style={{ height: 40 }}
                                placeholder="Chọn danh mục"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                              >
                                {categories &&
                                  categories.map((category) => (
                                    <Option
                                      key={category._id}
                                      value={category._id}
                                    >
                                      {category.category_name}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>

                            <Form.Item label="Lời nhắc (Nếu có)" name="note">
                              <Input
                                style={{ height: 40 }}
                                name="note"
                                label="Để lại lời nhắc cần thiết"
                              />
                            </Form.Item>

                            <Form.Item label="Thêm ảnh bìa" name="image">
                              <Upload.Dragger
                                customRequest={handleImageUpload}
                                multiple={false}
                                name="file"
                                accept=".jpeg,.jpg,.png"
                              >
                                <p className="ant-upload-drag-icon">
                                  <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                  Nhấp hoặc kéo tệp vào khu vực này để tải lên
                                </p>
                                <p className="ant-upload-hint">
                                  Hỗ trợ tải lên một lần hoặc hàng loạt.
                                </p>
                              </Upload.Dragger>
                            </Form.Item>

                            <Form.Item label={null}>
                              <Button
                                type="primary"
                                block
                                style={{ height: 50 }}
                                htmlType="submit"
                              >
                                Cập nhập bài viết
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>,
                        article._id
                      );
                    }}
                  >
                    Sửa thông tin
                  </Menu.Item>
                ) : null}
                {user.role.role_name !== "editor" &&
                  (article.status.status_name === "Đang chờ" ||
                    article.status.status_name === "Đã đăng tải") && (
                    <>
                      <Divider className="!my-1" />

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
                              Xóa bài viết
                            </h3>,
                            <div className="flex flex-col gap-4">
                              <p className="text-[#71717A] text-[14px]">
                                Bạn có chắc chắn muốn xóa bài viết?
                              </p>
                              <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                                <WarningOutlined style={{ marginRight: 8 }} />
                                <strong>Cảnh báo:</strong> Hành động này không
                                thể hoàn tác. Tất cả dữ liệu của bài viết sẽ bị
                                xóa vĩnh viễn.
                              </div>
                              <div className="flex gap-3 justify-end">
                                <Button onClick={handleCancel}>Hủy</Button>
                                <Button
                                  variant="solid"
                                  color="danger"
                                  onClick={() => handleDelete(article._id)}
                                >
                                  Xóa bài viết
                                </Button>
                              </div>
                            </div>,
                            article._id
                          )
                        }
                      >
                        Xóa bài viết
                      </Menu.Item>
                    </>
                  )}
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
            width={800}
            open={modalVisible === article._id}
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
      ))}
    </>
  );
});

export default ArticleItem;
