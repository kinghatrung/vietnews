import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Divider, Button, notification, Input, Dropdown } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CaretDownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import LazyLoad from "react-lazyload";

import config from "~/config/";
import FormValidate from "~/components/FormValidate";
import { logoutUser } from "~/redux/apiRequest";
import ForgotPassword from "~/components/FormValidate/ForgotPassword";
import { showLoginModal, hideLoginModal } from "~/redux/modalSlice";

const Navbar = React.memo(function Navbar() {
  const user = useSelector((state) => {
    return state.auth.login.currentUser;
  });
  const isModalOpen = useSelector((state) => state.modal.loginModalVisible);

  const handleOpen = () => dispatch(showLoginModal());
  const handleClose = () => dispatch(hideLoginModal());

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFormForgotPassword, setIsFormForgotPassword] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60 * 60 * 24);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = useCallback(async () => {
    logoutUser(dispatch, navigate);
  }, [dispatch, navigate]);

  const handleSearch = useCallback(
    (value) => {
      const trimmedValue = value?.trim() || "";
      if (location.pathname !== "/search") {
        if (trimmedValue) {
          navigate(`/search?q=${encodeURIComponent(trimmedValue)}`);
        } else {
          navigate("/search");
        }
      }
    },
    [location.pathname, navigate]
  );

  return (
    <div className="border-b border-[#E5E5E5] text-[#757575]">
      <div className="max-w-[1130px] px-4 mx-auto h-[50px] flex justify-between items-center">
        <div className="flex items-center">
          <Link to={config.routes.home}>
            <LazyLoad height={40} offset={40} once>
              <picture>
                <source srcSet="/image/NEWS.webp" type="image/webp" />
                <img
                  className="h-[40px] w-auto"
                  src="/image/NEWS.png"
                  alt="Logo"
                  width="121"
                  height="40"
                />
              </picture>
            </LazyLoad>
          </Link>
          <Divider
            className="!hidden md:!block"
            style={{ height: 26 }}
            type="vertical"
          />
          <p className="hidden md:block">
            {currentDate.toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center">
          <NavLink
            to={config.routes.latest}
            className={({ isActive }) =>
              isActive
                ? "hover-color active-color hidden md:block"
                : "hover-color hidden md:block"
            }
          >
            Mới nhất
          </NavLink>
          <Divider
            className="!hidden md:!block"
            style={{ height: 26 }}
            type="vertical"
          />
          <div
            className={
              !isOpenSearch
                ? "flex items-center"
                : "flex items-center border border-[#E5E5E5] rounded-4xl px-3"
            }
          >
            <Button
              className="!text-[#4f4f4f] !p-0 !text-[15px] !hidden md:!block"
              color="default"
              variant="link"
              onClick={() => setIsOpenSearch(!isOpenSearch)}
            >
              <SearchOutlined />
            </Button>
            <AnimatePresence>
              {isOpenSearch && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "180px" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input.Search
                    className="custom-search"
                    placeholder="Tìm kiếm"
                    onSearch={handleSearch}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Divider
            className="!hidden md:!block"
            style={{ height: 26 }}
            type="vertical"
          />
          {user ? (
            <Dropdown
              arrow
              trigger={["click"]}
              overlay={
                <div className="min-w-[200px] bg-[#fff] border border-[#E5E5E5] flex flex-col rounded-[6px] px-[15px]">
                  <Link
                    className="py-[10px] block text-[15px] !text-[#4f4f4f] hover:!text-[#c4302e]"
                    to={config.routes.profile}
                  >
                    Thông tin chung
                  </Link>
                  <Link
                    className="py-[10px] block text-[15px] !text-[#4f4f4f] hover:!text-[#c4302e]"
                    to={config.routes.profile}
                  >
                    Tin đã lưu
                  </Link>
                  <Divider className="!m-0" />
                  <Link
                    className="pt-[10px] pb-[12px] block text-[15px] !text-[#4f4f4f] hover:!text-[#c4302e]"
                    onClick={handleLogout}
                  >
                    Đăng xuất <LogoutOutlined />
                  </Link>
                </div>
              }
            >
              <Link>
                <div className="flex items-center gap-1">
                  <LazyLoad height={32} offset={32} once>
                    <img
                      alt="Avatar"
                      src={user.avatar ? user.avatar : "/image/no-image.png"}
                      className="w-[32px] h-[32px] rounded-full"
                    />
                  </LazyLoad>
                  <p className="ml-2">{user.full_name}</p>
                  <CaretDownOutlined />
                </div>
              </Link>
            </Dropdown>
          ) : (
            <>
              <Button
                className="!text-[#4f4f4f] hover:!text-[#c4302e] !p-0"
                color="default"
                variant="link"
                onClick={handleOpen}
              >
                <UserOutlined /> Đăng nhập
              </Button>
              {isFormForgotPassword ? (
                <ForgotPassword
                  isModalOpen={isModalOpen}
                  isChangeForm={isChangeForm}
                  isFormForgotPassword={isFormForgotPassword}
                  setIsChangeForm={setIsChangeForm}
                  setIsModalOpen={handleClose}
                  setIsFormForgotPassword={setIsFormForgotPassword}
                />
              ) : (
                <FormValidate
                  isModalOpen={isModalOpen}
                  isChangeForm={isChangeForm}
                  isFormForgotPassword={isFormForgotPassword}
                  setIsChangeForm={setIsChangeForm}
                  setIsModalOpen={handleClose}
                  setIsFormForgotPassword={setIsFormForgotPassword}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default Navbar;
