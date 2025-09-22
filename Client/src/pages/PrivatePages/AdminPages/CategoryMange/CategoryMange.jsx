import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  Tabs,
  Empty,
  Form,
  Button,
  Input,
  Modal,
  Pagination,
  DatePicker,
  Select,
} from "antd";
import {
  FolderOpenOutlined,
  FileTextOutlined,
  RiseOutlined,
  ContainerOutlined,
} from "@ant-design/icons";

import {
  getCategoryAPI,
  getRecommendAPI,
  addCategoryAPI,
  postCategoriesAPI,
} from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import RecommendItem from "~/components/RecommendItem";
import CategoryItem from "~/components/CategoryItem";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

function CategoryMange() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [dates, setDates] = useState([]);
  const [recommends, setRecommends] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [form] = Form.useForm();

  const startIndex = (currentPage - 1) * pageSize;
  const currentCategories = categories.slice(startIndex, startIndex + pageSize);
  const currentRecommends = recommends.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(startLoading());
        const res = await getCategoryAPI();
        setListCategories(res.data.reverse());
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đề xuất:", error);
        dispatch(stopLoading());
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        dispatch(startLoading());
        const startDate = dates?.[0]?.format("YYYY-MM-DD") || "";
        const endDate = dates?.[1]?.format("YYYY-MM-DD") || "";

        const res = await postCategoriesAPI(searchKey, startDate, endDate);
        setCategories(res.data.reverse());
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        dispatch(stopLoading());
      }
    };

    fetchCategory();
  }, [searchKey, dates]);

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        dispatch(startLoading());
        const res = await getRecommendAPI();
        setRecommends(res.data.reverse());
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
        categories.length > 0 ? (
          <>
            <CategoryItem
              categories={currentCategories}
              setCategories={setCategories}
              setListCategories={setListCategories}
            />
            {categories.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={categories.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có thể loại nào"
          />
        ),
    },
    {
      key: "2",
      label: "Đề xuất",
      children:
        recommends.length > 0 ? (
          <>
            <RecommendItem
              recommends={currentRecommends}
              setRecommends={setRecommends}
              setCategories={setCategories}
              setListCategories={setListCategories}
            />
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

  const totalNews = listCategories.reduce(
    (sum, item) => sum + item.news.length,
    0
  );

  const handleAddCategory = async (values) => {
    try {
      dispatch(startLoading());
      const payload = {
        ...values,
      };
      await addCategoryAPI(payload);
      const res = await getCategoryAPI();
      setCategories(res.data.reverse());

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-1 gap-[24px] mb-[20px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#222222] font-[700] text-[24px]">
            Danh mục tin tức
          </h2>
          <p className="text-[14px] text-[#757575]">
            Quản lý các danh mục có trong hệ thống
          </p>
        </div>
        <>
          <Button onClick={() => setIsModalOpen(!isModalOpen)}>
            Tạo danh mục
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
              onFinish={handleAddCategory}
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
                  Tạo thể loại
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
              Tổng danh mục
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {listCategories.length}
            </p>
          </div>
          <FolderOpenOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng tin tức
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">{totalNews}</p>
          </div>
          <FileTextOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng đề xuất
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {recommends.length}
            </p>
          </div>
          <RiseOutlined style={{ fontSize: 32 }} />
        </div>

        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              TB tin tức / danh mục
            </h3>
            <p className="text-[24px] text-[#222222] font-[600]">
              {Math.ceil(totalNews / listCategories.length)}
            </p>
          </div>
          <ContainerOutlined style={{ fontSize: 32 }} />
        </div>
      </div>

      <div className="p-[24px] border border-[#E5E5E5] rounded-[8px] bg-gray-50">
        <h3 className="text-[#222222] font-[700] text-[24px] mb-[24px]">
          Bộ lọc và tìm kiếm
        </h3>

        <div className="flex items-center gap-[12px]">
          <Search
            className="search-user"
            placeholder="Tìm kiếm danh mục"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />
          <div>
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

export default CategoryMange;
