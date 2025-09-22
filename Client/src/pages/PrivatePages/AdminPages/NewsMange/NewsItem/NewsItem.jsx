import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Modal,
  Dropdown,
  Menu,
  Tag,
  Empty,
  message,
} from "antd";
import {
  EyeOutlined,
  LikeFilled,
  CommentOutlined,
  SettingOutlined,
  DeleteOutlined,
  WarningOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { deleteNewsAPI, getNewsAPI } from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import Comment from "~/components/Comment";

function NewsItem({ news, setNews }) {
  const dispatch = useDispatch();
  const [modalContent, setModalContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

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

  const showModal = (title, content, articleId) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(articleId);
  };

  const handleCancel = () => {
    setModalVisible(null);
  };

  const handleDeleteNews = async (id) => {
    try {
      dispatch(startLoading());
      await deleteNewsAPI(id);
      const res = await getNewsAPI();
      setNews(res.data.reverse());
      message.success("Xóa tin tức thành công!");
      dispatch(stopLoading());
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error);
      dispatch(stopLoading());
    }
  };

  return (
    <>
      {news.map((n) => (
        <div
          key={n._id}
          className="flex justify-between items-center gap-[30px] border-b border-[#E5E5E5] pb-[20px] mb-[20px]"
        >
          <div className="flex gap-[20px] w-[600px]">
            <div className="w-[180px] h-[100px] aspect-[5/3 ">
              <img
                loading="lazy"
                alt="Ảnh bài viết"
                className="size-full object-cover"
                src={n.image}
              />
            </div>
            <div className="flex flex-col justify-between w-[400px]">
              <div>
                <h3 className="text-[#222222] font-[600] text-[16px] line-clamp-1">
                  {n.title}
                </h3>
                <p className="line-clamp-2 text-[14px] text-[#757575]">
                  {n.describe}
                </p>
              </div>
              <div className="flex gap-[16px]">
                <p className="!text-[#757575]">
                  <LikeFilled /> {n.like}
                </p>
                <p className="!text-[#757575]">
                  <EyeOutlined /> {n.views}
                </p>
                <p className="!text-[#757575]">
                  <CommentOutlined /> {n.comment.length}
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-[130px]">
            <Tag className="!px-2 !rounded-full" color={getRandomColor()}>
              {n.category.category_name}
            </Tag>
          </div>

          <div className="min-w-[180px]">
            <p className="text-[14px]">
              <strong className="mr-2">
                <UserOutlined />
              </strong>
              {n.reporter?.full_name}
            </p>
          </div>

          <p className="text-[14px]">
            <strong>Ngày đăng:</strong>{" "}
            {dayjs(n.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>

          <div className="flex flex-col gap-[6px]">
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
                          <h2 className="font-[600] text-[24px]">{n.title}</h2>
                          <div className="flex gap-5 mb-[12px]">
                            <Tag className="!px-2 !rounded-full" color="green">
                              {n.category?.category_name}
                            </Tag>
                            <p className="text-[14px] text-[#71717A]">
                              <span className="mr-2">
                                <UserOutlined />
                              </span>
                              {n.reporter?.full_name}
                            </p>

                            <p className="text-[14px] text-[#71717A]">
                              <span className="mr-2">
                                <CalendarOutlined />
                              </span>
                              {dayjs(n.createdAt).format("DD/MM/YYYY")}
                            </p>
                          </div>
                          <div className="border border-[#E5E5E5] p-[20px] rounded-[8px]">
                            <p className="text-[16px] font-[600]">
                              {n.describe}
                            </p>

                            <div
                              dangerouslySetInnerHTML={{
                                __html: n.content,
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-[10px] border border-[#E5E5E5] p-[20px] rounded-[8px]">
                            <h3 className="text-[18px] text-[#333] font-[600]">
                              Tất cả các bình luận
                            </h3>
                            {n.comment?.length > 0 ? (
                              <div
                                className="flex flex-col gap-[10px]"
                                key={n._id}
                              >
                                {n.comment.map((item) => (
                                  <Comment key={item._id} comment={item} />
                                ))}
                              </div>
                            ) : (
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Không có bình luận nào"
                              />
                            )}
                          </div>
                        </div>,
                        n._id
                      )
                    }
                  >
                    Xem chi tiết
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
                          Xóa tin tức
                        </h3>,
                        <div className="flex flex-col gap-4">
                          <p className="text-[#71717A] text-[14px]">
                            Bạn có chắc chắn muốn xóa tin tức?
                          </p>
                          <div className="border border-[#E5E5E5] p-[14px] rounded-[8px]">
                            <WarningOutlined style={{ marginRight: 8 }} />
                            <strong>Cảnh báo:</strong> Hành động này không thể
                            hoàn tác. Tất cả dữ liệu của tin tức sẽ bị xóa vĩnh
                            viễn.
                          </div>
                          <div className="flex gap-3 justify-end">
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button
                              variant="solid"
                              color="danger"
                              onClick={() => handleDeleteNews(n._id)}
                            >
                              Xóa tin tức
                            </Button>
                          </div>
                        </div>,
                        n._id
                      )
                    }
                  >
                    Xóa bài viết
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
              width={800}
              open={modalVisible === n._id}
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
}

export default NewsItem;
