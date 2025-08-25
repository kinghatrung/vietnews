import { useSelector, useDispatch } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { startLoading, stopLoading } from "~/redux/loadingSlice";
import { getCategoryAPI } from "~/api";

const Category = React.memo(function Category() {
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

  return (
    <div className="h-[50px] border-b border-[#E5E5E5] sticky top-0 bg-white z-10 shadow-[0px_2px_8px_rgba(0,0,0,0.1)] flex justify-center items-center">
      <div className="scroll-container px-4">
        <ul className="inline-flex">
          {categories.map((category) => (
            <li key={category._id} className="item-link mx-[10px]">
              <NavLink
                to={`/genre/${category._id}`}
                className={({ isActive }) =>
                  isActive ? "active-color hover-color" : "hover-color"
                }
              >
                {category.category_name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Category;
