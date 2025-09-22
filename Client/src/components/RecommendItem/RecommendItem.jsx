import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dropdown, Modal, Menu, Divider, message } from "antd";
import {
  SettingOutlined,
  WarningOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { startLoading, stopLoading } from "~/redux/loadingSlice";
import {
  deleteRecommendAPI,
  addRecommendToCategoryAPI,
  getRecommendAPI,
  getCategoryAPI,
} from "~/api";

const RecommendItem = React.memo(function RecommendItem({
  recommends,
  setRecommends,
  setCategories,
  setListCategories,
}) {
  const dispatch = useDispatch();
  const [modalContent, setModalContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const user = useSelector((state) => {
    return state.auth.login.currentUser;
  });

  const showModal = (title, content, articleId) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(articleId);
  };

  const handleCancel = () => {
    setModalVisible(null);
  };

  const handleDeleteRecommend = async (id) => {
    try {
      dispatch(startLoading());
      await deleteRecommendAPI(id);
      const res = await getRecommendAPI();
      setRecommends(res.data.reverse());
      setModalVisible(null);
      dispatch(stopLoading());
      message.success("Từ chối đề xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi từ chối đề xuất:", error);
    }
  };

  const handleAddRecommendToCategory = async (id) => {
    try {
      dispatch(startLoading());
      await addRecommendToCategoryAPI(id);
      const resRecommend = await getRecommendAPI();
      const resCategory = await getCategoryAPI();
      setCategories(resCategory.data.reverse());
      setListCategories(resCategory.data);
      setRecommends(resRecommend.data.reverse());
      setModalVisible(null);
      dispatch(stopLoading());
      message.success("Duyệt đề xuất và thêm danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi duyệt đề xuất:", error);
      message.error("Duyệt đề xuất thất bại. Vui lòng thử lại!");
      dispatch(stopLoading());
    }
  };

  return (
    <>
      {recommends.map((recommend) => (
        <div
          key={recommend._id}
          className="flex justify-between items-center  gap-[30px] border-b border-[#E5E5E5] pb-[20px] mb-[20px]"
        >
          <div className="flex flex-col gap-[10px] w-[500px]">
            <h2 className="text-[#222222] text-[16px]">
              <strong>Thể loại:</strong> {recommend.name}
            </h2>
            <p className="text-[14px] text-[#333333]">
              <strong>Mô tả:</strong> {recommend.description}
            </p>
          </div>
          <p className="text-[14px]">
            <strong>Ngày tạo: </strong>
            {dayjs(recommend.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          <p className="text-[14px] text-[#4f4f4f]">
            <strong>Trạng thái: </strong>
            {recommend.status?.status_name}
          </p>
          <p className="text-[14px] text-[#333333]">
            <strong>Người đề xuất:</strong> {recommend.editor?.full_name}
          </p>
          <div className="flex flex-col gap-[6px]">
            {user.role?.role_name === "admin" && (
              <>
                <Dropdown
                  arrow
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      <Menu.Item
                        icon={
                          <CheckOutlined
                            style={{ fontSize: "16px", paddingRight: 8 }}
                          />
                        }
                        onClick={() =>
                          showModal(
                            <h3 className="text-[#222222] font-[600] text-[18px] mb-[10px]">
                              <span className="mr-3">
                                <CheckOutlined />
                              </span>
                              Duyệt danh mục đề xuất
                            </h3>,
                            <div className="flex flex-col gap-4">
                              <p className="text-[#71717A] text-[14px]">
                                Bạn có chắc chắn muốn duyệt đề xuất này?
                              </p>
                              <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                                Đề xuất này sẽ được thêm vào danh mục của bạn và
                                đề xuất sẽ thành danh mục trên hệ thống
                              </div>
                              <div className="flex gap-3 justify-end">
                                <Button onClick={handleCancel}>Hủy</Button>
                                <Button
                                  variant="solid"
                                  color="primary"
                                  onClick={() =>
                                    handleAddRecommendToCategory(recommend._id)
                                  }
                                >
                                  Đồng ý
                                </Button>
                              </div>
                            </div>,
                            recommend._id
                          )
                        }
                      >
                        Đồng ý đề xuất
                      </Menu.Item>
                      <Divider className="!my-1" />
                      <Menu.Item
                        key="delete"
                        icon={
                          <CloseOutlined
                            style={{ fontSize: "16px", paddingRight: 8 }}
                          />
                        }
                        danger
                        onClick={() =>
                          showModal(
                            <h3 className="text-[#ff4d4f] font-[600] text-[18px] mb-[10px]">
                              <span className="mr-3">
                                <CloseOutlined />
                              </span>
                              Từ chối danh mục đề xuất
                            </h3>,
                            <div className="flex flex-col gap-4">
                              <p className="text-[#71717A] text-[14px]">
                                Bạn có chắc chắn muốn từ chối đề xuất?
                              </p>
                              <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                                <WarningOutlined style={{ marginRight: 8 }} />
                                <strong>Cảnh báo:</strong> Hành động này không
                                thể hoàn tác. Dữ liệu sẽ mất và Biên tập viên sẽ
                                nhận được thông báo.
                              </div>
                              <div className="flex gap-3 justify-end">
                                <Button onClick={handleCancel}>Hủy</Button>
                                <Button
                                  variant="solid"
                                  color="danger"
                                  onClick={() =>
                                    handleDeleteRecommend(recommend._id)
                                  }
                                >
                                  Từ chối
                                </Button>
                              </div>
                            </div>,
                            recommend._id
                          )
                        }
                      >
                        Từ chối đề xuất
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
                  width={500}
                  open={modalVisible === recommend._id}
                  title={modalTitle}
                  onCancel={handleCancel}
                  onOk={() => {
                    handleCancel();
                  }}
                  footer={null}
                >
                  {modalContent}
                </Modal>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
});

export default RecommendItem;
