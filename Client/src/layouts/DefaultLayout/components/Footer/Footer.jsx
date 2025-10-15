import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { loadingSlice } from "~/redux/slices/loadingSlice";
import { getCategoryAPI } from "~/api";

function Footer() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        dispatch(loadingSlice.actions.startLoading());
        const res = await getCategoryAPI();
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", err);
        dispatch(loadingSlice.actions.stopLoading());
      }
    };

    fetchCategory();
  }, []);

  return (
    <footer className="bg-gray-100 text-gray-700 pt-8 pb-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6">
          <div className="font-bold text-xl text-red-600 mb-1">VIETNEWS</div>
          <div className="text-sm text-gray-500">Tin túc 24h</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => (
            <div key={category._id} className="text-center">
              <Link
                to={`/genre/${category._id}`}
                className="font-medium text-gray-800 hover:text-red-600 transition-colors"
              >
                {category.category_name}
              </Link>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between text-sm">
            <div className="mb-4 md:mb-0">
              <p className="font-bold mb-2">Tòa soạn</p>
              <p className="text-gray-600">
                Địa chỉ: Số nhà 226, Đường Quang Trung, Phường Quang Trung, TP. Thái Nguyên
              </p>
              <p className="text-gray-600">Điện thoại: 0123.456.789 - Email: toasoan@tinnhanh.vn</p>
            </div>
            <div>
              <p className="font-bold mb-2">Liên hệ quảng cáo</p>
              <p className="text-gray-600">Hotline: 0987.654.321</p>
              <p className="text-gray-600">Email: quangcao@tinnhanh.vn</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
          <p>© {currentYear} VIETNEWS. Tất cả các quyền được bảo lưu.</p>
          <p className="mt-1">
            Không được sao chép nội dung dưới mọi hình thức khi chưa được sự chấp thuận bằng văn bản.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
