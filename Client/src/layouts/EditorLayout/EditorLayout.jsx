import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, theme, notification, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FormOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import LazyLoad from "react-lazyload";

import Loading from "~/components/Loading";
import config from "~/config/";

const { Header, Sider, Content } = Layout;

const EditorLayout = React.memo(function EditorLayout({ children }) {
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.loading.isLoading);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider
        trigger={null}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
        }}
        collapsible
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
          defaultSelectedKeys={[config.routes.reporter]}
          items={[
            {
              key: config.routes.home,
              icon: <FormOutlined />,
              label: "Bài viết",
            },
            {
              key: config.routes.propose,
              icon: <FileTextOutlined />,
              label: "Đề xuất",
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

export default EditorLayout;
