import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import config from "~/config";
import { getNewsAPI } from "~/api";

function MostViewed() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNewsAPI();
        setNews(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tức:", error);
      }
    };

    fetchNews();
  }, []);
  return (
    <section>
      <h3 className="text-[18px] font-title font-bold mb-[12px]">
        <Link
          to={config.routes.home}
          className="hover-color text-color font-title font-bold"
        >
          Xem nhiều
        </Link>
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
        {news
          .sort((a, b) => b.like - a.like)
          .slice(0, 6)
          .map((itemNews, index) => (
            <article
              key={itemNews._id}
              className="flex items-center gap-[20px]"
            >
              <span className="text-[48px] font-title">#{index + 1}</span>
              <h3 className="text-[18px] lg:text-[14px] font-title font-bold">
                <Link
                  to={`/news/${itemNews._id}`}
                  className="hover-color text-color font-title font-light"
                >
                  {itemNews.title}
                </Link>
              </h3>
            </article>
          ))}
      </div>
    </section>
  );
}

export default MostViewed;
