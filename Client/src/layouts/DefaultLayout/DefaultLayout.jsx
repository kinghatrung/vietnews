import React from "react";
import { useSelector } from "react-redux";
import { FloatButton } from "antd";

import Navbar from "~/layouts/DefaultLayout/components/Header/Navbar";
import Category from "~/layouts/DefaultLayout/components/Header/Category";
import Chatbot from "~/components/Chatbot";
import Footer from "~/layouts/DefaultLayout/components/Footer";
import Loading from "~/components/Loading";

const DefaultLayout = React.memo(function DefaultLayout({ children }) {
  const isLoading = useSelector((state) => state.loading.isLoading);

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
});

export default DefaultLayout;
