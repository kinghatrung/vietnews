import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  message,
  Modal,
  Form,
  Input,
  Dropdown,
  Menu,
} from "antd";
import {
  DeleteOutlined,
  WarningOutlined,
  SettingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { deleteCategoryAPI, updateCategoryAPI, getCategoryAPI } from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";

const CategoryItem = React.memo(function CategoryItem({
  categories,
  setCategories,
  setListCategories,
}) {
  const dispatch = useDispatch();
  const [modalContent, setModalContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const [form] = Form.useForm();

  const showModal = (title, content, articleId) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(articleId);
  };

  const handleCancel = () => {
    setModalVisible(null);
  };

  const handleDeleteCategory = async (id) => {
    try {
      dispatch(startLoading());
      await deleteCategoryAPI(id);
      const res = await getCategoryAPI();
      setCategories(res.data.reverse());
      setListCategories(res.data);
      dispatch(stopLoading());
      setModalVisible(null);
      message.success("Xóa người dùng thành công!");
    } catch (error) {
      dispatch(stopLoading());
      message.error("Cập nhật danh mục thất bại!");
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      dispatch(startLoading());
      const values = await form.validateFields();
      const payload = { ...values };
      await updateCategoryAPI(id, payload);
      const res = await getCategoryAPI();
      setCategories(res.data.reverse());
      form.resetFields();
      dispatch(stopLoading());
      setModalVisible(null);
      message.success("Cập nhật danh mục thành công!");
    } catch (error) {
      dispatch(stopLoading());
      message.error("Cập nhật danh mục thất bại!");
    }
  };

  return (
    <>
      {categories.map((category) => (
        <div
          key={category._id}
          className="flex justify-between items-center gap-[30px] border-b border-[#E5E5E5] pb-[20px] mb-[20px]"
        >
          <div className="flex flex-col gap-[10px] w-[500px]">
            <h2 className="text-[#222222] text-[16px]">
              <strong>Thể loại:</strong> {category.category_name}
            </h2>
            <p className="text-[14px] text-[#222222]">
              <strong>Mô tả:</strong> {category.description}
            </p>
          </div>
          <p className="text-[14px] text-[#333333]">
            <strong>Bài viết:</strong> {category.news.length}
          </p>
          <p className="text-[14px]">
            <strong>Ngày tạo: </strong>
            {dayjs(category.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          <div className="flex flex-col gap-[6px]">
            <Dropdown
              arrow
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.Item
                    key="delete"
                    icon={
                      <EditOutlined
                        style={{ fontSize: "16px", paddingRight: 8 }}
                      />
                    }
                    onClick={() =>
                      showModal(
                        <h3 className="text-[#222222] font-[600] text-[18px] mb-[10px]">
                          <span className="mr-3">
                            <EditOutlined />
                          </span>
                          Sửa danh mục tin tức
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <p className="text-[#71717A] text-[14px]">
                            Cập nhật thông tin cá nhân của người dùng{" "}
                            <strong className="text-[#333]">
                              "{category.category_name}"
                            </strong>{" "}
                            .Nhấn cập nhập để hoàn tất.
                          </p>
                          <Form
                            form={form}
                            onFinish={() => handleUpdateCategory(category._id)}
                            name="register"
                            layout="vertical"
                            className="!mb-4"
                          >
                            <Form.Item
                              layout="vertical"
                              label="Thể loại"
                              name="category_name"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập tên thể loại!",
                                },
                              ]}
                            >
                              <Input
                                style={{ height: 40 }}
                                type="text"
                                placeholder="Nhập thể loại"
                              />
                            </Form.Item>

                            <Form.Item
                              layout="vertical"
                              label="Mô tả"
                              name="description"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập mô tả của thể loại!",
                                },
                              ]}
                            >
                              <Input
                                style={{ height: 40 }}
                                type="text"
                                placeholder="Nhập mô tả"
                              />
                            </Form.Item>

                            <Form.Item className="!m-0">
                              <Button
                                block
                                type="primary"
                                htmlType="submit"
                                style={{ height: 50 }}
                              >
                                Sửa thể loại
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>,
                        category._id
                      )
                    }
                  >
                    Sửa danh mục
                  </Menu.Item>
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
                          Xóa danh mục tin tức
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <p className="text-[#71717A] text-[14px]">
                            Bạn có chắc chắn muốn xóa danh mục?
                          </p>
                          <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                            <WarningOutlined style={{ marginRight: 8 }} />
                            <strong>Cảnh báo:</strong> Hành động này không thể
                            hoàn tác. Tất cả dữ liệu của danh mục tin tức sẽ bị
                            xóa vĩnh viễn.
                          </div>
                          <div className="flex gap-3 justify-end">
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button
                              variant="solid"
                              color="danger"
                              onClick={() => handleDeleteCategory(category._id)}
                            >
                              Xóa danh mục
                            </Button>
                          </div>
                        </div>,
                        category._id
                      )
                    }
                  >
                    Xóa danh mục
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
              width={600}
              open={modalVisible === category._id}
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

export default CategoryItem;
