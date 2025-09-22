import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Divider, notification, Anchor } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import config from "~/config/";
import { logoutUser } from "~/redux/apiRequest";
import Info from "~/pages/PrivatePages/Profile/Info";

function Profile() {
  const user = useSelector((state) => {
    return state.auth.login.currentUser;
  });

  const date = new Date(user.createdAt);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const formattedDate = `${day}/${month}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logoutUser(dispatch, navigate);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-24 gap-[40px] mb-[20px] max-w-[1000px] mx-auto">
      <div className="col-span-7">
        <div className="border border-[#E5E5E5] rounded-[6px] px-[16px] sticky top-[60px]">
          <div className="flex items-center gap-1 py-[15px]">
            <img
              alt="Ảnh người dùng"
              loading="lazy"
              src={user.avatar ? user.avatar : "/image/no-image.png"}
              className="w-[48px] h-[48px] rounded-full object-cover"
            />
            <div>
              <p className="ml-2 text-[14px] text-color font-title font-[700]">
                {user.full_name}
              </p>
              <p className="ml-2 text-[14px] text-[#9f9f9f9f]">
                Tham gia ngày: {formattedDate}
              </p>
            </div>
          </div>
          <Divider className="!m-0" />
          <Anchor
            affix={false}
            className="profile-anchor bg-transparent border-none"
            items={[
              {
                key: "info",
                href: "#info",
                title: (
                  <span className="!py-[11px] block text-[16px] !text-[#4f4f4f] hover:!text-[#c4302e]">
                    Thông tin chung
                  </span>
                ),
              },
              ...(user.role?.role_name === "user"
                ? [
                    {
                      key: "saved",
                      href: "#saved",
                      title: (
                        <span className="!py-[11px] block text-[16px] !text-[#4f4f4f] hover:!text-[#c4302e]">
                          Tin đã lưu
                        </span>
                      ),
                    },
                  ]
                : []),
              {
                key: "logout",
                href: "#",
                title: (
                  <span
                    className="pt-[15px] pb-[12px] block text-[16px] mb-[12px] !text-[#4f4f4f] hover:!text-[#c4302e]"
                    onClick={handleLogout}
                  >
                    Đăng xuất <LogoutOutlined />
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>
      <div className="col-span-17">
        <Info />
      </div>
    </section>
  );
}

export default Profile;
