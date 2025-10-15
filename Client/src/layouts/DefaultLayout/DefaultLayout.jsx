import { memo } from "react";
import { useSelector } from "react-redux";
import { FloatButton } from "antd";

import Navbar from "~/layouts/DefaultLayout/components/Header/Navbar";
import Category from "~/layouts/DefaultLayout/components/Header/Category";
import Chatbot from "~/components/Chatbot";
import Footer from "~/layouts/DefaultLayout/components/Footer";
import Loading from "~/components/Loading";
import { selectLoading } from "~/redux/slices/loadingSlice";

function DefaultLayout({ children }) {
  const isLoading = useSelector(selectLoading);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Category />
      <div className="max-w-[1130px] px-4 mx-auto pt-[20px] pb-[100px]">
        {isLoading && <Loading />}
        {children}
      </div>
      <Footer />
      <FloatButton.BackTop shape="square" />
      <Chatbot />
    </div>
  );
}

export default memo(DefaultLayout);
