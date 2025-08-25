import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Layout, Menu, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  UserOutlined,
  FormOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import LazyLoad from "react-lazyload";

import config from "~/config/";
import Loading from "~/components/Loading";

const { Header, Sider, Content } = Layout;

const AdminLayout = React.memo(function AdminLayout({ children }) {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const isLoading = useSelector((state) => state.loading.isLoading);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
        }}
        collapsed={collapsed}
      >
        <LazyLoad height={40} offset={40} once>
          <picture>
            <source srcSet="/image/NEWS.webp" type="image/webp" />
            <img
              alt="Logo"
              src="/image/NEWS.png"
              className="demo-logo-vertical"
            />
          </picture>
        </LazyLoad>
        <Menu
          onClick={(e) => navigate(e.key)}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[config.routes.user]}
          items={[
            {
              key: config.routes.home,
              icon: <UserOutlined />,
              label: "Người dùng",
            },
            {
              key: config.routes.article,
              icon: <FormOutlined />,
              label: "Bài viết",
            },
            {
              key: config.routes.category,
              icon: <OrderedListOutlined />,
              label: "Danh mục tin tức",
            },
            {
              key: config.routes.newsMange,
              icon: <FileTextOutlined />,
              label: "Tin tức",
            },
            {
              key: config.routes.profile,
              icon: <SettingOutlined />,
              label: "Thông tin tài khoản",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            position: "relative",
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {isLoading && <Loading />}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
});

export default AdminLayout;
