import React, { useState, useEffect } from "react";
import { Empty, Pagination } from "antd";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "~/redux/loadingSlice";

import { getNewsAPI } from "~/api";
import News from "~/components/News";

const LatestNews = React.memo(function LatestNews() {
  const dispatch = useDispatch();
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        dispatch(startLoading());
        const res = await getNewsAPI();
        setNews(res.data.reverse());
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tức:", error);
        dispatch(stopLoading());
      }
    };

    fetchNews();
  }, []);

  const oneDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  const recentNews = news.filter((newsItem) => {
    const createdAt = new Date(newsItem.createdAt);
    return now - createdAt <= oneDay;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = recentNews.slice(startIndex, startIndex + pageSize);

  return (
    <section>
      <div className="border-b border-[#E5E5E5] mb-[24px]">
        <h3 className="font-title font-[600] text-[32px] !mb-0">
          Tin tức mới nhất
        </h3>
        <p className="text-[#4f4f4f] text-[14px] pb-[20px]">
          Tin tức được cập nhật 24h
        </p>
      </div>
      <div className="flex flex-col">
        {currentNews.map((newsItem) => (
          <News
            key={newsItem._id}
            {...newsItem}
            heading={newsItem.title}
            title
            semiMedium
            sizeSemiSmall
            time
          />
        ))}

        {currentNews.length > 0 ? (
          <Pagination
            className="!pt-[20px] !pb-[30px] !mt-[10px] custom-pagination"
            align="center"
            defaultCurrent={1}
            current={currentPage}
            pageSize={pageSize}
            total={recentNews.length}
            onChange={(page) => setCurrentPage(page)}
          />
        ) : (
          <Empty
            className="flex flex-col justify-center items-center h-[50vh]"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có tin tức nào"
          />
        )}
      </div>
    </section>
  );
});

export default LatestNews;
