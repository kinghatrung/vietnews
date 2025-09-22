import React, { useEffect, useState } from "react";
import { Button, Badge, Dropdown, Menu, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { getNotificationAPI } from "~/api";

const NotificationBell = React.memo(function NotificationBell({ id }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotificationAPI(id);
        setNotifications(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông báo:", err);
      }
    };

    if (id) fetchNotifications();
  }, [id]);

  const unreadCount = notifications.filter((noti) => !noti.isRead).length;

  // Tạo menu cho Dropdown từ danh sách notifications
  const menu = (
    <Menu
      style={{ maxHeight: "384px", overflowY: "auto" }} // max-h-96 = 384px
    >
      {notifications.length === 0 ? (
        <Menu.Item key="empty" disabled>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có thông báo"
            style={{ padding: "16px", textAlign: "center" }}
          />
        </Menu.Item>
      ) : (
        notifications.map((noti) => (
          <Menu.Item key={noti._id} style={{ padding: "12px 16px" }}>
            <div>
              <div style={{ fontSize: "14px" }}>{noti.message}</div>
              <div
                style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px" }}
              >
                {new Date(noti.createdAt).toLocaleString()}
              </div>
            </div>
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      open={showDropdown}
      onOpenChange={(open) => setShowDropdown(open)}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Badge count={unreadCount} offset={[-4, 4]}>
        <Button
          icon={<BellOutlined />}
          shape="circle"
          onClick={() => setShowDropdown(!showDropdown)}
        />
      </Badge>
    </Dropdown>
  );
});

export default NotificationBell;
