import { useEffect, useState, useMemo, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";

import CategoryList from "~/components/CategoryList";
import { getCategoryAPI } from "~/api";
import { startLoading, stopLoading } from "~/redux/loadingSlice";

const News = lazy(() => import("~/components/News"));

function ContentVertical() {
  const dispatch = useDispatch();
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

  const subCategories = useMemo(() => categories.slice(0, 6), [categories]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] pb-[20px] mb-[20px] border-b border-[#E5E5E5]">
      {subCategories.map((category) => (
        <div key={category._id} className="col-span-1">
          <CategoryList
            category={category.category_name}
            categoryId={category._id}
          />
          {category.news.slice(2, 3).map((itemNews) => (
            <News
              key={itemNews._id}
              {...itemNews}
              heading={itemNews.title}
              vertical
              title
              noTime
              sizeDefault
            />
          ))}
          {category.news.slice(4, 5).map((itemNews) => (
            <News
              key={itemNews._id}
              {...itemNews}
              heading={itemNews.title}
              vertical
              title
              noImage
              noTime
              sizeDefault
            />
          ))}
        </div>
      ))}
    </section>
  );
}

export default ContentVertical;
