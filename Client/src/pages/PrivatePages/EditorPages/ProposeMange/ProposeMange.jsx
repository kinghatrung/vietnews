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

import { addRecommendAPI, getRecommendAPI } from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import RecommendItem from "~/components/RecommendItem";
import NotificationBell from "~/components/NotificationBell";

function ProposeMange() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [recommends, setRecommends] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = recommends.slice(startIndex, startIndex + pageSize);

  const user = useSelector((state) => {
    return state.auth.login.currentUser;
  });

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        dispatch(startLoading());
        const res = await getRecommendAPI();
        setRecommends(res.data);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đề xuất:", error);
        dispatch(stopLoading());
      }
    };

    fetchRecommend();
  }, []);

  const items = [
    {
      key: "1",
      label: "Tất cả",
      children:
        recommends.length > 0 ? (
          <>
            <RecommendItem recommends={currentNews} />
            {recommends.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={recommends.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có đề xuất nào"
          />
        ),
    },
  ];

  const handleSendRecommend = async (values) => {
    try {
      dispatch(startLoading());
      const payload = {
        ...values,
        editor: user._id,
      };
      await addRecommendAPI(payload);
      form.resetFields();
      const updatedList = await getRecommendAPI();
      setRecommends(updatedList.data);
      setIsModalOpen(false);
      dispatch(stopLoading());
      message.success("Gửi đề xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi đề xuất:", error);
      message.error("Lỗi khi gửi đề xuất!");
      dispatch(stopLoading());
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-1 gap-[10px] mb-[20px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#222222] font-[700] text-[24px]">
            Quản lý đề xuất danh mục
          </h2>
          <p className="text-[14px] text-[#757575]">
            Gửi các đề xuất tới danh mục cho Tổng biên tập
          </p>
        </div>
        <>
          <div className="inline-flex gap-2">
            <NotificationBell id={user._id} />
            <Button onClick={() => setIsModalOpen(!isModalOpen)}>
              Tạo đề xuất
            </Button>
          </div>
          <Modal
            open={isModalOpen}
            width={600}
            form={form}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <h2 className="text-[#222222] font-[700] text-[24px] mb-[20px]">
              Tạo đề xuất
            </h2>
            <Form
              form={form}
              onFinish={handleSendRecommend}
              name="register"
              layout="vertical"
              className="!mb-4"
            >
              <Form.Item
                layout="vertical"
                label="Thể loại"
                name="name"
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
                  Gửi đề xuất
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </section>
  );
}

export default ProposeMange;
