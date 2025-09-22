import { useEffect, useState, useMemo, lazy } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CategoryList from "~/components/CategoryList";
import { getCategoryAPI, getNewsAPI } from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";

const News = lazy(() => import("~/components/News"));

function ContentDaily() {
  const dispatch = useDispatch();
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        dispatch(startLoading());
        const res = await getCategoryAPI();
        setCategories(res.data);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        dispatch(stopLoading());
      }
    };

    fetchCategory();
  }, []);

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

  const subCategories = useMemo(() => categories.slice(0, 4), [categories]);
  const subNews = useMemo(() => news.slice(5, 12), [news]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-24 border-b border-[#E5E5E5] pb-[20px] mb-[20px]">
      <div className="lg:col-span-9 col-span-full pr-0 lg:pr-[20px] border-r-0 lg:border-r border-[#E5E5E5]">
        {subNews.map((item) => (
          <article
            key={item._id}
            className="border-b border-[#E5E5E5] pb-[20px] mb-[20px] last:lg:border-b-0"
          >
            <h3 className="text-[18px] sm:text-[15px] font-title font-bold mb-2 ms:mb-0">
              <Link to={`/news/${item._id}`} style={{ color: "#222222" }}>
                {item.title}
              </Link>
            </h3>
            <div className="flex flex-col md:flex-row gap-[10px] mt-0 sm:mt-2">
              <Link to={`/news/${item._id}`} className="order-2 md:order-1">
                <div className="md:w-[145px] md:h-[87px] aspect-[5/3]">
                  <img
                    loading="lazy"
                    alt="Ảnh bài viết"
                    className="size-full object-cover"
                    src={item.image}
                  />
                </div>
              </Link>
              <p className="order-1 md:order-2 text-[17px] sm:text-[14px] line-clamp-4">
                <Link to={`/news/${item._id}`} style={{ color: "#4f4f4f" }}>
                  {item.describe}
                </Link>
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="lg:col-span-15 col-span-full pl-0 lg:pl-[20px]">
        {subCategories.map((item) => (
          <div
            key={item._id}
            className="border-b border-b-[#bdbdbd] border-[#E5E5E5] pb-[20px] mb-[20px] last:pb-0 last:mb-0 last:border-b-0"
          >
            <CategoryList
              category={item?.category_name}
              categoryId={item?._id}
            />
            <div className="flex flex-col lg:flex-row gap-0 md:gap-[20px] border-b border-[#E5E5E5] pb-[20px]">
              {item.news.slice(-1).map((itemNews) => (
                <News
                  key={itemNews._id}
                  {...itemNews}
                  heading={itemNews.title}
                  horizontal
                  title
                  medium
                  noTime
                  sizeDefault
                />
              ))}
              {item.news.slice(-2, -1).map((itemNews) => (
                <News
                  key={itemNews._id}
                  {...itemNews}
                  heading={itemNews.title}
                  title
                  noImage
                  noImageAndSubTitle
                  noTime
                  sizeDefault
                />
              ))}
            </div>

            <div className="list-disc pl-[20px] pt-[20px]">
              <ul className="flex flex-col lg:flex-row justify-between list-disc gap-[20px] lg:gap-[40px]">
                {item.news.slice(-5, -2).map((article) => (
                  <li key={article._id} className="flex-1">
                    <News
                      key={article._id}
                      {...article}
                      heading={article.title}
                      title
                      noImage
                      noSubTitle
                      noTime
                      sizeDefault
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ContentDaily;
