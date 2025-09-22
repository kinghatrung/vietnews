import { Link } from "react-router-dom";

import config from "~/config";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-[120px] font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600 mb-6">
          Không tìm thấy trang
        </h2>
        <p className="text-gray-500 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to={config.routes.home}
          className="inline-block px-6 py-3 bg-[#c4302e] text-white font-medium rounded-lg transition-colors"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
