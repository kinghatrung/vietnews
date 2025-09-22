import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { Tabs, Empty, Pagination, Select, DatePicker, Input } from "antd";
import {
  FileTextOutlined,
  BarChartOutlined,
  LikeOutlined,
  EyeOutlined,
  CommentOutlined,
} from "@ant-design/icons";

import { postNewsAPI, getCategoryAPI, getAllReporters } from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import NewsItem from "~/pages/PrivatePages/AdminPages/NewsMange/NewsItem";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

function NewsMange() {
  const dispatch = useDispatch();
  const [news, setNews] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectCategories, setSelectCategories] = useState([]);
  const [selectAuthorId, setSelectAuthorId] = useState("");
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = news.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        dispatch(startLoading());
        const startDate = dates?.[0]?.format("YYYY-MM-DD") || "";
        const endDate = dates?.[1]?.format("YYYY-MM-DD") || "";

        const res = await postNewsAPI(
          searchKey,
          startDate,
          endDate,
          selectCategories,
          selectAuthorId
        );
        setNews(res.data.reverse());
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tức:", error);
        dispatch(stopLoading());
      }
    };

    fetchNews();
  }, [searchKey, dates, selectCategories, selectAuthorId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(startLoading());
        const res = await getCategoryAPI();
        setCategories(res.data.reverse());
        dispatch(stopLoading());
      } catch (err) {
        console.error("Lỗi lấy danh sách thể loại:", err);
        dispatch(stopLoading());
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        dispatch(startLoading());
        const res = await getAllReporters();
        setAuthors(res.data.reporters.reverse());
        dispatch(stopLoading());
      } catch (err) {
        console.error("Lỗi lấy danh sách người dùng:", err);
        dispatch(stopLoading());
      }
    };
    fetchAuthor();
  }, []);

  const totalViews = news.reduce((sum, item) => sum + item.views, 0);
  const totalComment = news.reduce((sum, item) => sum + item.commentCount, 0);
  const totalLikes = news.reduce((sum, item) => sum + item.like, 0);

  const items = [
    {
      key: "1",
      children:
        news.length > 0 ? (
          <>
            <NewsItem news={currentNews} setNews={setNews} />
            {news.length > pageSize && (
              <Pagination
                className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
                align="center"
                defaultCurrent={1}
                current={currentPage}
                pageSize={pageSize}
                total={news.length}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có tin tức nào"
          />
        ),
    },
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-1 gap-[20px] mb-[20px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#222222] font-[700] text-[24px]">
            Quản lý tin tức đã đăng tải
          </h2>
          <p className="text-[14px] text-[#757575]">
            Quản lý và theo dõi tin tức trong hệ thống.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center w-full gap-[18px]">
        <div className="flex justify-between items-center p-[24px] border border-[#E5E5E5] rounded-[8px] h-[100%] w-full bg-gray-50">
          <div className="mb-[4px]">
            <h3 className="text-[14px] text-[#222222] font-[500]">
              Tổng số tin đã đăng
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
      </div>

      <div className="p-[24px] border border-[#E5E5E5] rounded-[8px] bg-gray-50">
        <h3 className="text-[#222222] font-[700] text-[24px] mb-[24px]">
          Bộ lọc và tìm kiếm
        </h3>

        <div className="flex items-center gap-[12px]">
          <Search
            className="search-user"
            placeholder="Tìm kiếm tin tức"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />

          <div className="flex items-center gap-[12px]">
            <Select
              className="h-[45px] w-[280px]"
              mode="multiple"
              placeholder="Thể loại"
              value={selectCategories}
              onChange={(value) => setSelectCategories(value)}
            >
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.category_name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ height: 45, width: 280 }}
              placeholder="Tác giả"
              value={selectAuthorId}
              onChange={(value) => setSelectAuthorId(value)}
            >
              <Option value="">Tất cả</Option>
              {authors.map((author) => (
                <Option key={author._id} value={author._id}>
                  {author.full_name}
                </Option>
              ))}
            </Select>

            <RangePicker
              format="DD/MM/YYYY"
              style={{ height: 45, width: 280 }}
              placeholder="Ngày đăng tải"
              onChange={(values) => setDates(values)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1" items={items} />
    </section>
  );
}

export default NewsMange;
