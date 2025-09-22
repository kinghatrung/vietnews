import { useDispatch } from "react-redux";
import React, { useState, useCallback } from "react";
import { Button, message, Popconfirm, Modal, Divider } from "antd";
import { ClockCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { startLoading, stopLoading } from "~/redux/loadingSlice";
import {
  deleteComment,
  approveComment,
  banUserAPI,
  unbanUserAPI,
  checkContentArticleAPI,
} from "~/api";

const CommentItem = React.memo(function CommentItem({ comments, setComments }) {
  const dispatch = useDispatch();
  const [isToxic, setIsToxic] = useState(false);
  const [toxic, setToxic] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(null);

  const handleDeleteUComment = async (id) => {
    try {
      dispatch(startLoading());
      await deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
      message.success("Xóa bình luận thành công!");
      dispatch(stopLoading());
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      dispatch(stopLoading());
    }
  };

  const handleAddCommentByNews = async (id) => {
    try {
      dispatch(startLoading());
      await approveComment(id);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
      message.success("Duyệt bình luận thành công!");
      dispatch(stopLoading());
    } catch (error) {
      console.error("Lỗi khi duyệt bình luận:", error);
      dispatch(stopLoading());
    }
  };

  const handleBanUser = async (userId, commentId) => {
    try {
      dispatch(startLoading());
      const payload = {
        days: 1,
        reason: "Người dùng bị cấm 1 ngày vì vi phạm nội dung bình luận",
      };
      await banUserAPI(userId, payload);
      message.success("Cấm người dùng thành công!");
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.user?._id === userId) {
            return {
              ...comment,
              user: {
                ...comment.user,
                isActive: false,
              },
            };
          }
          return comment;
        })
      );
      dispatch(stopLoading());
    } catch (error) {
      console.error("Lỗi khi cấm người dùng:", error);
      dispatch(stopLoading());
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      dispatch(startLoading());
      await unbanUserAPI(userId);
      message.success("Mở tài khoản người dùng thành công!");
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.user?._id === userId) {
            return {
              ...comment,
              user: {
                ...comment.user,
                isActive: true,
              },
            };
          }
          return comment;
        })
      );
      dispatch(stopLoading());
    } catch (err) {
      console.error("Lỗi khi mở tài khoản người dùng:", err);
      dispatch(stopLoading());
    }
  };

  const handleCheckContent = useCallback(async (content) => {
    try {
      const response = await checkContentArticleAPI({ content });
      setToxic(response.data.toxicSentences);
      if (!response.data.isToxic) {
        setIsToxic(false);
        message.success("Nội dung bài viết hợp lệ!");
      } else {
        setIsToxic(true);
        message.error(
          "Tổng số câu có chứa từ toxic trong bài viết: " +
            response.data.totalToxic
        );
      }
    } catch (err) {
      message.error("Lỗi kiểm tra nội dung!");
    }
  }, []);

  return (
    <>
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="flex justify-between items-center gap-[30px] border-b border-[#E5E5E5] pb-[20px] mb-[20px]"
        >
          <div className="flex gap-[16px]">
            <img
              alt="Avatar"
              loading="lazy"
              src={comment.user?.avatar}
              className="w-[40px] h-[40px] object-cover rounded-full"
            />
            <div className="max-w-[500px] w-full">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[#222222] font-[600] text-[16px]">
                  {comment.user?.full_name}
                </p>
                <p className="text-[#757575] font-[500] text-[12px]">
                  {comment.user?.email}
                </p>
              </div>
              <div>
                <p className="mb-1 truncate w-full">
                  <strong>Bình luận:</strong> {comment.content}
                </p>
                <p className="mb-1 truncate w-full">
                  <strong>Tiêu đề bài viết:</strong> {comment.news?.title}
                </p>
              </div>

              <p className="text-[12px] text-[#757575]">
                <ClockCircleOutlined /> Tham gia:{" "}
                {dayjs(comment.user?.createdAt).format("MM/YYYY")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[6px]">
            <Popconfirm
              title="Phê duyệt"
              description="Bạn muốn phê duyệt bình luận này?"
              onConfirm={() => handleAddCommentByNews(comment._id)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button
                style={{ height: 30, color: "#52c41a", borderColor: "#52c41a" }}
              >
                Phê duyệt
              </Button>
            </Popconfirm>
            <>
              <Button
                onClick={() => setIsModalOpen(comment._id)}
                style={{ height: 30 }}
              >
                Chi tiết
              </Button>
              <Modal
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen === comment._id}
                onCancel={() => setIsModalOpen(null)}
                width={900}
                footer={null}
              >
                <h2 className="text-[#222222] font-[700] text-[24px] mb-[10px]">
                  Chi tiết bình luận
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 border border-[#e5e5e5] rounded-[8px] p-[10px]">
                      <div className="flex flex-col items-center">
                        <h2 className="text-[20px] text-[#333] font-[600]">
                          Thông tin người dùng
                        </h2>
                        <p className="text-[#71717A] text-[14px] mb-[10px]">
                          Chi tiết về người gửi bình luận
                        </p>
                        <img
                          alt="Avatar"
                          loading="lazy"
                          className="h-[100px] w-[100px] object-cover rounded-full mb-[10px]"
                          src={comment.user?.avatar}
                        />
                        <p className="mb-1 text-[14px]">
                          <strong>Họ tên:</strong>{" "}
                          {comment.user?.full_name
                            ? comment.user?.full_name
                            : "Chưa có thông tin"}
                        </p>
                        <p className="mb-1 text-[14px]">
                          <strong>Email:</strong>{" "}
                          {comment.user?.email
                            ? comment.user?.email
                            : "Chưa có thông tin"}
                        </p>
                        <p className="mb-1 text-[14px]">
                          <strong>Địa chỉ:</strong>{" "}
                          {comment.user?.address
                            ? comment.user?.address
                            : "Chưa có thông tin"}
                        </p>
                        <p className="mb-1 truncate">
                          <strong>Số điện thoại:</strong>{" "}
                          {comment.user?.phone
                            ? comment.user?.phone
                            : "Chưa có thông tin"}
                        </p>
                        <Divider />
                        <p className="mb-[10px]">Hành động với người dùng</p>
                        {comment.user?.isActive ? (
                          <Button
                            onClick={() =>
                              handleBanUser(comment.user?._id, comment._id)
                            }
                            danger
                            className="mb-[20px]"
                          >
                            Cấm tạm thời
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleUnbanUser(comment.user?._id)}
                            style={{
                              color: "#52c41a",
                              borderColor: "#52c41a",
                            }}
                            className="mb-[20px]"
                          >
                            Mở tài khoản
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 border border-[#e5e5e5] rounded-[8px] p-[24px]">
                      <h2 className="text-[20px] text-[#333] font-[600]">
                        Nội dung bình luận
                      </h2>
                      <p className="mb-1 text-[14px]">
                        <strong>Bình luận trên bài viết:</strong>{" "}
                        {comment.news?.title}
                      </p>
                      <div className="border border-[#e5e5e5] rounded-[8px] p-[12px]">
                        <p className="mb-1 text-[14px]">{comment.content}</p>
                        <p>
                          <ClockCircleOutlined />{" "}
                          {dayjs(comment.createdAt).fromNow()}
                        </p>
                      </div>
                      {/* <Button
                        type="primary"
                        onClick={() => handleCheckContent(comment.content)}
                      >
                        Kiểm tra nội dung
                      </Button> */}
                      <h2 className="text-[20px] text-[#333] font-[600] mt-[16px]">
                        Chi tiết tin tức
                      </h2>
                      <div className="border border-[#e5e5e5] rounded-[8px] p-[12px]">
                        <p className="mb-1 text-[14px]">
                          {comment.news?.describe}
                        </p>
                        <p>{dayjs(comment.news?.createdAt).fromNow()}</p>
                      </div>
                      <div className="flex gap-[12px] mt-[12px]">
                        <Button
                          style={{ height: 30 }}
                          danger
                          onClick={() => handleDeleteUComment(comment._id)}
                        >
                          Từ chối
                        </Button>
                        <Button
                          style={{
                            height: 30,
                            color: "#52c41a",
                            borderColor: "#52c41a",
                          }}
                          onClick={() => handleAddCommentByNews(comment._id)}
                        >
                          Phê duyệt
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            </>

            <Popconfirm
              title="Xóa bình luận"
              description="Bạn muốn xóa bình luận này?"
              onConfirm={() => handleDeleteUComment(comment._id)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button style={{ height: 30 }} danger>
                Từ chối
              </Button>
            </Popconfirm>
          </div>
        </div>
      ))}
    </>
  );
});

export default CommentItem;
