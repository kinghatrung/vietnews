import { Link } from "react-router-dom";
import { LikeOutlined } from "@ant-design/icons";

import config from "~/config";

function TopStory() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-24 gap-[10px] mb-[20px]">
      <div className="col-span-17 border-b border-[#E5E5E5] pb-[20px]">
        <article className="border-b border-[#E5E5E5] pb-[20px] mb-[20px]">
          <div className="sm:flex gap-[20px]">
            <div className="">
              <Link
                to={config.routes.home}
                className="xl:w-[520px] xl:h-[312px] lg:w-[440px] lg:h-[264px] md:w-[440px] md:h-[264px] aspect-[5/3] block"
              >
                <img
                  alt="Ảnh bài viết"
                  loading="lazy"
                  className="size-full object-cover"
                  src="/image/nothing.jpg"
                />
              </Link>
            </div>
            <div className="pt-[16px] sm:pt-0">
              <h3 className="text-[24px] font-title font-bold">
                <Link
                  to={config.routes.home}
                  className="hover-color text-color text-[24px] font-title font-bold"
                >
                  Vua Bỉ thăm Hoàng thành Thăng Long
                </Link>
              </h3>
              <p className="mt-[10px] text-[17px] sm:text-[14px]">
                <Link style={{ color: "#4f4f4f" }}>
                  Hà Nội - Chủ tịch nước Lương Cường và Vua Philippe cùng tham
                  quan Hoàng thành Thăng Long, nghe giới thiệu về lịch sử hàng
                  nghìn năm của dân tộc Việt Nam.
                </Link>
              </p>
              <p className="mt-2 text-[#757575]">
                44' trước
                <span className="ml-3">Kinh doanh</span>
              </p>
            </div>
          </div>
        </article>

        <div className="flex flex-col sm:flex-row gap-[20px]">
          <div className="flex flex-col justify-between">
            <h3 className="text-[18px] sm:text-[16px] font-title font-bold mb-2">
              <Link to={config.routes.home} className="hover-color text-color">
                Cả nước dự kiến còn 5.000 xã phường Cả nước dự kiến còn 5.000 xã
                phường
              </Link>
            </h3>
            <p className="block sm:hidden text-[17px] sm:text-[14px] mb-3 ms:mb-0">
              <Link to={config.routes.home} style={{ color: "#4f4f4f" }}>
                Cục Đường sắt Việt Nam cho biết từ nay đến năm 2030, ngành xây
                dựng dự kiến khởi công 9 dự án đường sắt quốc gia trên toàn mạng
                lưới theo quy hoạch.
              </Link>
            </p>
            <Link to={config.routes.home}>
              <div className="sm:w-[250px] sm:h-[150px] aspect-[5/3]">
                <img
                  loading="lazy"
                  src="/image/test.webp"
                  className="size-full object-cover"
                  alt="Ảnh bài viết"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-[18px] sm:text-[16px] font-title font-bold mb-2">
              <Link to={config.routes.home} className="hover-color text-color">
                Cả nước dự kiến còn 5.000 xã phường
              </Link>
            </h3>
            <p className="block sm:hidden text-[17px] sm:text-[14px] mb-3">
              <Link to={config.routes.home} style={{ color: "#4f4f4f" }}>
                Cục Đường sắt Việt Nam cho biết từ nay đến năm 2030, ngành xây
                dựng dự kiến khởi công 9 dự án đường sắt quốc gia trên toàn mạng
                lưới theo quy hoạch.
              </Link>
            </p>
            <Link to={config.routes.home}>
              <div className="sm:w-[250px] sm:h-[150px] aspect-[5/3]">
                <img
                  loading="lazy"
                  src="/image/nothing.jpg"
                  className="size-full object-cover"
                  alt="Ảnh bài viết"
                />
              </div>
            </Link>
          </div>

          <div className="bg-[#f7f7f7] p-[16px] md:p-[10px] lg:bg-transparent lg:p-0">
            <p className="text-[20px] sm:text-[14px] font-bold font-title mb-2">
              <Link
                style={{ color: "#c4302e" }}
                to={config.routes.home}
                className="hover-color"
              >
                Góc nhìn
              </Link>
            </p>

            <article className="flex flex-col">
              <h3 className="text-[20px] sm:text-[16px] font-title font-bold mb-2">
                <Link
                  to={config.routes.home}
                  className="hover-color text-color"
                >
                  Công bằng với kinh tế tư nhân
                </Link>
              </h3>
              <p className="text-[17px] sm:text-[14px]">
                <Link to={config.routes.home} style={{ color: "#4f4f4f" }}>
                  Doanh nghiệp tư nhân khó lớn mạnh nếu vẫn phải cạnh tranh bất
                  bình đẳng với doanh nghiệp Nhà nước.
                </Link>
              </p>

              <div className="flex justify-between mt-5">
                <div className="flex flex-col">
                  <h3 className="italic font-title text-[16px] sm:text-[14px]">
                    <Link style={{ color: "#757575" }} to={config.routes.home}>
                      Nguyễn Minh Huyên
                    </Link>
                  </h3>
                  <p className="mt-1 text-[12px]">
                    <LikeOutlined /> 34
                  </p>
                </div>
                <img
                  loading="lazy"
                  className="block sm:hidden md:hidden lg:hidden xl:block w-[72px] sm:w-[60px] rounded-full"
                  src="/image/nothing.jpg"
                  alt="Ảnh người dùng"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
      <div className="col-span-7">Quảng cáo</div>
    </section>
  );
}

export default TopStory;
