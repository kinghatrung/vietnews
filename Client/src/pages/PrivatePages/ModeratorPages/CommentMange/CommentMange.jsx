import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  Tabs,
  Empty,
  Modal,
  Form,
  Input,
  Button,
  message,
  Pagination,
} from "antd";

import { getAllComment } from "~/api";
import Loading from "~/components/Loading";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import NotificationBell from "~/components/NotificationBell";
import CommentItem from "~/components/CommentItem";

function CommentMange() {
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = comments.slice(startIndex, startIndex + pageSize);

  const isLoading = useSelector((state) => state.loading.isLoading);

  const items = [
    {
      key: "1",
      children:
        comments.length > 0 ? (
          <>
            <CommentItem comments={currentNews} setComments={setComments} />
            {comments.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={comments.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có bình luận nào"
          />
        ),
    },
  ];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        dispatch(startLoading());
        const res = await getAllComment();
        setComments(res.data.reverse());
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        dispatch(stopLoading());
      }
    };

    fetchComments();
  }, []);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-1 gap-[10px] mb-[20px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#222222] font-[700] text-[24px]">
            Quản lý bình luận chờ xét duyệt
          </h2>
          <p className="text-[14px] text-[#757575]">
            Bình luận được người dùng gửi đến
          </p>
        </div>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </section>
  );
}

export default CommentMange;
