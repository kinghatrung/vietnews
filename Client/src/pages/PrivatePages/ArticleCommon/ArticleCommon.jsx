import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  Modal,
  Form,
  Input,
  Select,
  Empty,
  Upload,
  message,
  Pagination,
  DatePicker,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import FroalaEditor from "react-froala-wysiwyg";
import axios from "axios";

import ArticleItem from "~/components/ArticleItem";
import {
  getAllEditors,
  postArticleAPI,
  getCategoryAPI,
  getAllStatusAPI,
  getArticleByIdAPI,
  getAllReporters,
} from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_API_URL
    : "/";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

function ArticleCommon() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("");
  const [selectAuthorId, setSelectAuthorId] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [dates, setDates] = useState([]);
  const [editors, setEditors] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [articles, setArticles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [form] = Form.useForm();

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = articles.slice(startIndex, startIndex + pageSize);
  const user = useSelector((state) => {
    return state.auth.login.currentUser;
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        dispatch(startLoading());
        const startDate = dates?.[0]?.format("YYYY-MM-DD") || "";
        const endDate = dates?.[1]?.format("YYYY-MM-DD") || "";

        const resArticle = await getArticleByIdAPI(
          user.role.role_name,
          user._id,
          searchKey,
          startDate,
          endDate,
          status,
          selectAuthorId
        );

        setArticles(resArticle.data.reverse());
        dispatch(stopLoading());
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", err);
        dispatch(stopLoading());
      }
    };

    fetchArticles();
  }, [searchKey, dates, status, selectAuthorId]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(startLoading());
      try {
        const resStatus = await getAllStatusAPI();
        const resEditors = await getAllEditors();
        const resCategories = await getCategoryAPI();
        const resAllReporters = await getAllReporters();
        setAuthors(resAllReporters.data.reporters.reverse());
        setCategories(resCategories.data);
        setEditors(resEditors.data);
        setStatuses(resStatus.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, []);

  const items = [
    {
      key: "1",
      children:
        articles.length > 0 ? (
          <>
            <ArticleItem
              user={user}
              articles={currentNews}
              categories={categories}
              statuses={statuses}
              editors={editors}
              setArticles={setArticles}
            />
            {articles.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={articles.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có bài viết nào"
          />
        ),
    },
  ];

  const handleAddArticle = async (values) => {
    try {
      dispatch(startLoading());
      const payload = {
        ...values,
        content: content,
        image: uploadedImageUrl,
        reporter: user._id,
      };
      await postArticleAPI(payload);
      setContent("");
      setIsModalOpen(false);
      form.resetFields();

      try {
        const res = await getArticleByIdAPI({
          role: user.role.role_name,
          userId: user._id,
        });
        setArticles(res.data.reverse());
      } catch (err) {
        console.error("Lỗi khi cập nhật danh sách bài viết:", err);
      }

      message.success("Tạo bài viết thành công!");
      dispatch(stopLoading());
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
      message.error("Lỗi khi tạo bài viết!");
      dispatch(stopLoading());
    }
  };

  const handleImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const res = await axios.post(
        `${API_URL}/api/upload/image_upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onSuccess(res.data);
      setUploadedImageUrl(res.data.link);
    } catch (err) {
      console.error("Image upload failed:", err);
      onError(err);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-1 gap-[20px] mb-[20px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#222222] font-[700] text-[24px]">
            Quản lý bài viết
          </h2>
          <p className="text-[14px] text-[#757575]">
            Tạo hoặc theo dõi trạng thái bài viết
          </p>
        </div>
        {user.role.role_name === "reporter" && (
          <>
            <Button onClick={() => setIsModalOpen(!isModalOpen)}>
              Tạo bài viết
            </Button>
            <Modal
              open={isModalOpen}
              width={900}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
            >
              <h2 className="text-[#222222] font-[700] text-[24px] mb-[10px]">
                Tạo bài viết
              </h2>
              <Form
                form={form}
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={handleAddArticle}
                autoComplete="off"
              >
                <Form.Item
                  label="Tiêu đề bài viết"
                  name="title"
                  rules={[{ required: true, message: "Hãy điền thông tin" }]}
                >
                  <Input style={{ height: 40 }} />
                </Form.Item>

                <Form.Item
                  label="Tiêu đề phụ bài viết"
                  name="describe"
                  rules={[{ required: true, message: "Hãy điền thông tin" }]}
                >
                  <Input style={{ height: 40 }} />
                </Form.Item>

                <Form.Item label="Nội dung bài viết" name="content">
                  <FroalaEditor
                    tag="textarea"
                    model={content}
                    onModelChange={(e) => setContent(e)}
                    config={{
                      placeholderText: "Nhập nội dung...",
                      imageUploadURL: `${API_URL}/api/upload/image_upload`,
                      imageUploadParam: "file",
                      imageUploadMethod: "POST",
                      imageAllowedTypes: ["jpeg", "jpg", "png", "webp"],
                      requestWithCORS: true,
                      crossDomain: true,
                      charCounterCount: true,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="editor"
                  label="Chọn biên tập viên"
                  rules={[
                    { required: true, message: "Vui lòng chọn biên tập viên" },
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

                <Form.Item
                  name="category"
                  label="Chọn danh mục bài viết"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
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
                        <Option key={category._id} value={category._id}>
                          {category.category_name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Lời nhắc (Nếu có)" name="note">
                  <Input
                    style={{ height: 40 }}
                    name="note"
                    placeholder="Để lại lời nhắc cần thiết"
                  />
                </Form.Item>

                <Form.Item label="Nguồn tham khảo" name="source">
                  <Input
                    style={{ height: 40 }}
                    name="source"
                    placeholder="Để lại link nguồn tham khảo nếu có"
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
                    Tạo bài viết
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </div>

      {/* <div className="flex justify-between items-center w-full gap-[18px]">
        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng số bài viết
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {news.length}
            </p>
          </div>
          <FileTextOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng số lượt xem
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {totalViews}
            </p>
          </div>
          <EyeOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng bình luận
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {totalComment}
            </p>
          </div>
          <CommentOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng lượt thích
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {totalLikes}
            </p>
          </div>
          <LikeOutlined style={{ fontSize: 32 }} />
        </div>
      </div> */}

      <div className="p-[24px] border border-[#E5E5E5] rounded-[8px] bg-gray-50">
        <h3 className="text-[#222222] font-[700] text-[24px] mb-[24px]">
          Bộ lọc và tìm kiếm
        </h3>
        <div className="flex items-center gap-[12px]">
          <Search
            className="search-user"
            placeholder="Tìm kiếm bài viết"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />

          <div className="flex items-center gap-[12px]">
            <Select
              style={{ height: 45, width: 280 }}
              placeholder="Trạng thái bài viết"
              value={status}
              onChange={(value) => setStatus(value)}
            >
              <Option value="">Trạng thái</Option>
              {user.role.role_name === "reporter" && (
                <Option key="Đang chờ" value="Đang chờ">
                  Đang chờ
                </Option>
              )}
              {(user.role.role_name === "reporter" ||
                user.role.role_name === "editor") && (
                <Option key="Chờ chỉnh sửa" value="Chờ chỉnh sửa">
                  Chờ chỉnh sửa
                </Option>
              )}
              {user.role.role_name === "editor" && (
                <Option key="Đang chỉnh sửa" value="Đang chỉnh sửa">
                  Đang chỉnh sửa
                </Option>
              )}
              {(user.role.role_name === "editor" ||
                user.role.role_name === "admin") && (
                <Option key="Chờ phê duyệt" value="Chờ phê duyệt">
                  Chờ phê duyệt
                </Option>
              )}
              {user.role.role_name === "admin" && (
                <Option key="Đang phê duyệt" value="Đang phê duyệt">
                  Đang phê duyệt
                </Option>
              )}
              {user.role.role_name === "admin" && (
                <Option key="Đã đăng tải" value="Đã đăng tải">
                  Đã đăng tải
                </Option>
              )}
            </Select>

            {user.role.role_name === "admin" && (
              <Select
                style={{ height: 45, width: 280 }}
                placeholder="Tác giả"
                value={selectAuthorId}
                onChange={(value) => setSelectAuthorId(value)}
              >
                <Option value="">Tác giả</Option>
                {authors.map((author) => (
                  <Option key={author._id} value={author._id}>
                    {author.full_name}
                  </Option>
                ))}
              </Select>
            )}

            <RangePicker
              format="DD/MM/YYYY"
              style={{ height: 45, width: 280 }}
              placeholder="Ngày tạo"
              onChange={(values) => setDates(values)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1" items={items} />
    </section>
  );
}

export default ArticleCommon;
