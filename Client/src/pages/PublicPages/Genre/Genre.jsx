import React from "react";
import { Empty, Pagination } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "~/redux/loadingSlice";

import { getNewsAPI, getCategoryByIdAPI } from "~/api";
import News from "~/components/News";

const Genre = React.memo(function Genre() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        dispatch(startLoading());
        const res = await getCategoryByIdAPI(id);
        setCategories(res.data);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        dispatch(stopLoading());
      }
    };

    fetchCategory();
  }, [id]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        dispatch(startLoading());
        const res = await getNewsAPI();
        setNews(res.data);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tức:", error);
        dispatch(stopLoading());
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter((newsItem) => newsItem.category._id === id);
  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = filteredNews.slice(startIndex, startIndex + pageSize);

  return (
    <section>
      <h3 className="font-title font-[600] text-[32px] mb-1">
        {categories.category_name}
      </h3>
      <p className="text-[#4f4f4f] text-[18px] mb-[30px]">
        {categories.description}
      </p>
      {categories.news?.length > 0 ? (
        <div className="flex flex-col">
          {currentNews.map((newsItem) => (
            <News
              key={newsItem._id}
              {...newsItem}
              heading={newsItem.title}
              title
              semiMedium
              sizeSemiSmall
              noTime
            />
          ))}
          {currentNews.length > pageSize && (
            <Pagination
              className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
              align="center"
              defaultCurrent={1}
              current={currentPage}
              pageSize={pageSize}
              total={filteredNews.length}
              onChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      ) : (
        <Empty
          className="flex flex-col justify-center items-center h-[50vh]"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có tin tức nào"
        />
      )}
    </section>
  );
});

export default Genre;
