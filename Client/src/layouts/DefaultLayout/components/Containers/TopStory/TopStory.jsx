import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import News from "~/components/News";
import { getNewsAPI } from "~/api";

function TopStory() {
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

  const sortedNews = useMemo(() => {
    return [...news].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [news]);

  const topNews = sortedNews?.[0] || null;
  const subNews = sortedNews?.slice(1, 3) || [];
  const opinionNews = sortedNews?.[4] || null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-1 gap-[10px] mb-[20px]">
      <div className="col-span-1 border-b border-[#E5E5E5] pb-[20px]">
        {topNews && (
          <News
            key={topNews._id}
            {...topNews}
            heading={topNews.title}
            large
            title
            sizeLarge
          />
        )}

        <div className="flex flex-col sm:flex-row gap-[20px]">
          <div className="flex flex-col sm:flex-row gap-[20px] max-w-[520px]">
            {subNews.map((item) => (
              <News
                key={item._id}
                {...item}
                newsId={item._id}
                heading={item.title}
                title
                noTime
                medium
                reverse
                hiddenSubTitle
                sizeDefault
              />
            ))}
          </div>

          {opinionNews && (
            <div
              key={opinionNews._id}
              className="bg-[#f7f7f7] p-[16px] md:p-[10px] lg:bg-transparent lg:p-0"
            >
              <p className="text-[20px] sm:text-[14px] font-bold font-title mb-2">
                <Link
                  style={{ color: "#c4302e" }}
                  to={`/genre/${opinionNews.category?._id}`}
                  className="hover-color"
                >
                  {opinionNews.category?.category_name}
                </Link>
              </p>

              <News
                {...opinionNews}
                heading={opinionNews.title}
                author
                noImage
                title
                noTime
                sizeAuthor
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TopStory;
